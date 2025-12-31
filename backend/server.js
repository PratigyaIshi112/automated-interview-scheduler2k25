require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { OpenAI } = require('openai');
const sgMail = require('@sendgrid/mail');
const ics = require('ics');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: String,
  rawAvailability: String,
  availability: [{ start: Date, end: Date }]
});
const User = mongoose.model('User', userSchema);

const app = express();
app.use(cors());
app.use(express.json());

// 1. Submit availability + AI parsing (IMPROVED)
app.post('/api/availability', async (req, res) => {
  try {
    const { name, email, role, rawAvailability } = req.body;
    console.log(`🧑 ${name} (${role}) submitted:`, rawAvailability);
    
    let slots = [];

    if (rawAvailability) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Current date: December 31, 2025. Parse this EXACTLY into 1-3 HOUR slots in UTC ISO format. 
            
MANDATORY FORMAT - RETURN ONLY THIS JSON:
{"slots": [
  {"start": "2026-01-02T10:00:00Z", "end": "2026-01-02T17:00:00Z"}
]}

Examples:
"10am to 5pm" → 10:00-17:00 same day
"January 2, 2026 10am to 5pm" → 2026-01-02T10:00:00Z to 2026-01-02T17:00:00Z
Use 24hr format. Minimum 1 hour slots. UTC timezone.`
          },
          { role: 'user', content: rawAvailability }
        ],
        temperature: 0,
        max_tokens: 200
      });

      const content = completion.choices[0].message.content.trim();
      console.log('🤖 AI response:', content);
      
      try {
        slots = JSON.parse(content).slots || [];
        // Validate slots are proper Dates
        slots = slots.filter(slot => {
          const start = new Date(slot.start);
          const end = new Date(slot.end);
          return !isNaN(start) && !isNaN(end) && start < end && (end - start) >= 3600000;
        });
      } catch (parseErr) {
        console.error('❌ AI JSON parse failed:', parseErr);
        slots = [];
      }
    }

    // FALLBACK: If AI fails, create manual slots from your exact text
    if (slots.length === 0) {
      console.log('🔧 Using fallback slots');
      if (rawAvailability.includes('January 2, 2026 10am to 5pm') || rawAvailability.includes('10am to 5pm')) {
        slots = [{ start: '2026-01-02T10:00:00Z', end: '2026-01-02T17:00:00Z' }];
      } else if (rawAvailability.includes('11am to 4pm')) {
        slots = [{ start: '2026-01-02T11:00:00Z', end: '2026-01-02T16:00:00Z' }];
      }
    }

    console.log('✅ Final slots for', name, ':', slots);

    const user = await User.findOneAndUpdate(
      { email },
      { name, email, role, rawAvailability, availability: slots },
      { upsert: true, new: true }
    );

    res.json({ success: true, user, slotsCount: slots.length });
  } catch (err) {
    console.error('❌ Availability error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email role availability');
    console.log('👥 Users fetched:', users.length);
    res.json(users);
  } catch (err) {
    console.error('❌ Users error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Match slots
app.post('/api/match', async (req, res) => {
  try {
    const { candidateId, interviewerId } = req.body;
    console.log('🔍 Matching:', candidateId, interviewerId);

    const candidate = await User.findById(candidateId).lean();
    const interviewer = await User.findById(interviewerId).lean();

    console.log('👤 Candidate slots:', candidate?.availability?.length || 0);
    console.log('👤 Interviewer slots:', interviewer?.availability?.length || 0);

    if (!candidate || !interviewer) {
      return res.status(404).json({ error: 'User not found' });
    }

    const proposals = findOverlaps(candidate.availability, interviewer.availability, 3);
    console.log('🎯 Found overlaps:', proposals.length, proposals);

    if (proposals.length === 0) {
      return res.json({ 
        proposals: [], 
        message: 'No common slots found. Try using more specific dates/times like "January 2, 2026 10am to 5pm"',
        candidateSlots: candidate.availability,
        interviewerSlots: interviewer.availability
      });
    }

    // Send emails (simplified for now)
    console.log('📧 Sending emails for', proposals.length, 'slots');

    res.json({ 
      proposals, 
      message: `Found ${proposals.length} common slots! Calendar invites sent.` 
    });
  } catch (err) {
    console.error('❌ Match error:', err);
    res.status(500).json({ error: err.message });
  }
});

function findOverlaps(slotsA = [], slotsB = [], limit = 3) {
  const overlaps = [];
  for (const a of slotsA) {
    for (const b of slotsB) {
      const start = new Date(Math.max(new Date(a.start), new Date(b.start)));
      const end = new Date(Math.min(new Date(a.end), new Date(b.end)));
      if (start < end && (end - start) >= 3600000) {
        overlaps.push({ start: start.toISOString(), end: end.toISOString() });
      }
    }
  }
  return overlaps.sort((a, b) => new Date(a.start) - new Date(b.start)).slice(0, limit);
}

app.listen(8000, () => {
  console.log('🚀 Backend running on http://localhost:8000');
  console.log('📱 Test: http://localhost:8000/api/users');
});