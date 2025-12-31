# Automated Interview Scheduler with AI Matching

A full-stack AI-powered interview scheduling app that allows candidates and interviewers to submit availability in natural English.  
The system automatically extracts time slots, finds the best matches, and sends calendar invites.

**Project:** Pratigya Kumari 

---

## ✨ Features

- Submit availability in **natural English**
  - Example: `"I'm free January 2 from 10am to 5pm"`
- **AI (OpenAI GPT-4o-mini)** automatically converts text into valid time slots
- Smart matching between candidate and interviewer availability
- Suggests up to **3 best common slots**
- Automatically sends **calendar invites (.ics files)** via email using SendGrid
- Beautiful, modern, colorful responsive UI with **Dark Mode**
- Fully responsive — works on **mobile and desktop**

---

## 🚀 Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- React Hook Form

### Backend
- Express.js
- MongoDB Atlas
- OpenAI API (gpt-4o-mini)
- SendGrid (Emails)
- `ics` library (Calendar files)

### Deployment
- Frontend: **Vercel**
- Backend: **Render**

---

## 🛠️ How to Run Locally

### 1️⃣ Clone the Repository

git clone https://github.com/PratigyaIshi112/automated-interview-scheduler2k25.git
cd automated-interview-scheduler2k25

## ▶️ Backend Setup

cd backend
npm install
cp .env.example .env   # add your keys
npm run dev

##▶️ Frontend Setup
   cd frontend
  npm install
  npm run dev

##🌐 Open Application
http://localhost:3000
