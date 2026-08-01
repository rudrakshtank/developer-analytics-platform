<h1 align="center"> Developer Analytics Platform</h1>

<p align="center">
  <img src="frontend/public/icons.webp" alt="Logo" width="150"/>
</p>

<p align="center">
  <b>Analyze. Compare. Discover.</b>
</p>

This is a full-stack **Developer Analytical Platform** that aggregates coding profiles from multiple competitive programming platforms and GitHub into a single unified dashboard. It enables developers, recruiters, and organizations to analyze coding performance, compare developers, explore leaderboards, and discover talent based on real project experience and competitive programming achievements.

---

#  Features

## Unified Developer Dashboard

View complete developer statistics from:

* GitHub
* LeetCode
* Codeforces
* GeeksforGeeks
* CodeChef

Everything is combined into a single profile.

---

##  Developer Profile Analysis

Analyze a developer with:

* Total Problems Solved
* Platform-wise Statistics
* Contest Ratings
* Contest History
* Submission Activity
* Contribution Graphs
* GitHub Commit Activity
* Most Used Programming Languages
* Technology Stack Detection
* Profile Verification

---

##  DSA Analytics

Track problem solving across topics such as:

* Arrays
* Strings
* Trees
* and many more...

Visual charts help identify strengths and weak areas.

---

## Activity Tracking

Visualize developer activity using:

* Daily Activity Graph
* Weekly Statistics
* Monthly Submission Trends
* Platform-wise Submission History
* Coding Streaks
* Last 7 Days Global Heatmap
* Coding Consistency Analysis

---

##  Leaderboards

Explore rankings by:

*  Global Leaderboard
*  Country Leaderboard
*  Institute Leaderboard (coming soon...)

---

## Compare Developers

Compare multiple developers side-by-side.

Comparison includes:

* Total Problems Solved
* Contest Ratings
* GitHub Activity
* Programming Languages
* DSA Topic Distribution
* Contribution Graphs
* Technology Stack
* Coding Consistency
* Submission Activity

Perfect for recruiters and team selection.

---

## Interactive Charts

The dashboard includes beautiful visualizations for:

* Rating Progress
* Submission Timeline
* Monthly Activity
* Topic Distribution
* Language Usage
* Repository Languages
* Coding Heatmaps

---

##  Profile Verification

Every integrated profile is verified to ensure authenticity before analysis.

Supported verification:

* GitHub
* LeetCode
* Codeforces
* GeeksforGeeks
* CodeChef

---

#  Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* JWT Authentication
* OTP Verification
* Password Reset

---

#  Project Structure

```text
developer-analytics-platform/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/rudrakshtank/developer-analytics-platform
.git

cd developer-analytics-platform
```

---

## 2. Install Backend Dependencies

```bash
cd backend

npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd frontend

npm install
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASS=your_password
```

---

## 5. Run Backend

```bash
cd backend

npm run dev
```

Server runs at

```text
http://localhost:5000
```

---

## 6. Run Frontend

```bash
cd frontend

npm run dev
```

Frontend runs at

```text
http://localhost:5173
```

---

#  Use Cases

### Developers

* Track coding progress
* Analyze GitHub repositories
* Identify weak DSA topics
* Monitor consistency

---

# Contributing

Coming soon...

# Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub. It helps the project reach more developers and motivates further development.

---

# License

This project is licensed under the MIT License.

---

<p align="center">
Built with ❤️ for Developers, Recruiters, and the Competitive Programming Community.
</p>
