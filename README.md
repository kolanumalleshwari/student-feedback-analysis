# Student Feedback Analysis System

A full-stack web application designed for colleges and universities to collect, analyze, and report student feedback on courses, faculty members, teaching quality, laboratories, and institutional facilities.

---

## 🚀 Features

* **Home Dashboard**: Displays overall feedback statistics, average rating, positive/neutral/negative sentiment split, interactive rating distribution bar chart, sentiment donut chart, and recent feedback entries.
* **Submit Feedback Form**: Allows students to submit course and faculty ratings across 4 key criteria (Teaching Quality, Course Content, Communication, and Overall Rating) with written comments. Includes client-side and server-side validation.
* **Rule-Based Sentiment Analyzer**: Automatically analyzes student comments using an explainable rule-based algorithm (handling capitalization and negations like "not good") to label feedback as **Positive** (Green), **Neutral** (Grey), or **Negative** (Red).
* **View Feedback Table**: Offers searching by student name, ID, subject, or faculty, plus filtering by department, year of study, and sentiment status. Features an interactive modal to inspect individual response details.
* **Analytics & Intelligence**: Displays average ratings by subject, feedback counts by department, sentiment ratios, most appreciated aspects, and key areas needing improvement.
* **Reports & CSV Export**: Provides summary reports filtered by date range and department, with one-click CSV export capability for offline record-keeping and administrative review.

---

## 🛠️ Technology Stack

### Frontend
* **React.js** (v18)
* **Vite** (Build Tool)
* **React Router DOM** (v6 Navigation)
* **Axios** (API HTTP Client)
* **Recharts** (Data Visualization & Charts)
* **Lucide React** (Modern Iconography)
* **Vanilla CSS** (Custom Design System with responsive grid, CSS variables, and modern cards)

### Backend
* **Node.js & Express.js** (REST API)
* **MySQL Database** (`mysql2` connection pool with async/await promises)
* **dotenv** (Environment variable management)
* **cors** (Cross-Origin Resource Sharing middleware)

---

## 📁 Project Structure

```text
student-feedback-analysis/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MySQL database connection pool & health test
│   │   ├── controllers/
│   │   │   ├── analyticsController.js # Analytics & summary logic
│   │   │   └── feedbackController.js  # CRUD feedback operations & validations
│   │   ├── routes/
│   │   │   ├── analyticsRoutes.js     # Analytics endpoints
│   │   │   └── feedbackRoutes.js      # Feedback API routes
│   │   ├── utils/
│   │   │   └── sentimentAnalyzer.js   # Rule-based sentiment analyzer algorithm
│   │   └── server.js                  # Main Express app entry point
│   ├── .env                           # Environment variables
│   ├── .env.example                   # Environment template
│   ├── database.sql                   # MySQL schema & sample seed dataset
│   └── package.json                   # Backend dependencies & npm scripts
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosConfig.js         # Axios base URL setup
│   │   ├── components/
│   │   │   ├── ErrorMessage.jsx       # Retryable error alert box
│   │   │   ├── LoadingSpinner.jsx     # Loading state spinner
│   │   │   ├── Navbar.jsx             # Top header bar
│   │   │   ├── SentimentBadge.jsx     # Color-coded sentiment pill badge
│   │   │   ├── Sidebar.jsx            # Left navigation bar
│   │   │   └── StarRating.jsx         # Interactive/read-only star component
│   │   ├── pages/
│   │   │   ├── Analytics.jsx          # Analytics & metrics charts
│   │   │   ├── HomeDashboard.jsx      # Overview dashboard page
│   │   │   ├── Reports.jsx            # Reports & CSV export page
│   │   │   ├── SubmitFeedback.jsx     # Student feedback submission form
│   │   │   └── ViewFeedback.jsx       # Filterable feedback table
│   │   ├── App.jsx                    # React Router configuration
│   │   ├── index.css                  # Custom design system styles
│   │   └── main.jsx                   # React root entry
│   ├── .env                           # Frontend environment variables
│   ├── .env.example                   # Frontend env template
│   ├── index.html                     # HTML root template
│   ├── package.json                   # Frontend dependencies
│   └── vite.config.js                 # Vite server config
├── .gitignore
└── README.md
```

---

## 🗄️ MySQL Database Setup

1. Open **MySQL Workbench** or your MySQL command line client.
2. Ensure MySQL Server is running on your machine (default port `3306`).
3. Open and run the `database.sql` script located inside `backend/database.sql`.
   Alternatively, execute via terminal:
   ```bash
   mysql -u root -p < backend/database.sql
   ```
4. This script creates the `student_feedback_db` database, sets up the `feedback` table, and populates initial seed records for testing.

---

## ⚙️ Environment Configuration

### Backend Setup (`backend/.env`)
Create `backend/.env` (copy from `backend/.env.example`):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_feedback_db
```
*Replace `your_mysql_password` with your actual local MySQL root password.*

### Frontend Setup (`frontend/.env`)
Create `frontend/.env` (copy from `frontend/.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 💻 How to Run in VS Code

### Step 1: Open VS Code
Open the project root folder `student-feedback-analysis` in VS Code.

### Step 2: Start Backend Server
1. Open a new terminal in VS Code (`Terminal -> New Terminal`).
2. Navigate to `backend`:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. The backend will start on **`http://localhost:5000`**.

### Step 3: Start Frontend Server
1. Open a second terminal window in VS Code (`+` icon in VS Code Terminal).
2. Navigate to `frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open your browser at **`http://localhost:5173`**.

---

## 🤖 Sentiment Analysis Engine Note

> [!NOTE]
> The sentiment analysis module in this system uses a deterministic, rule-based keyword lexicon and negation parser (located in `backend/src/utils/sentimentAnalyzer.js`). It categorizes feedback based on curated positive and negative terms while properly evaluating phrase context (e.g. "not good" is parsed as Negative). This serves as an explainable, lightweight rule-based demonstration and does not require paid AI tokens, cloud models, or external API keys.

---

## 📡 Backend REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint returning database connectivity status |
| `GET` | `/api/feedback` | Fetch all feedback entries with optional `search`, `department`, `year`, `sentiment`, `startDate`, `endDate` params |
| `GET` | `/api/feedback/:id` | Fetch single feedback entry by ID |
| `POST` | `/api/feedback` | Submit new feedback (performs validation, sentiment analysis, and MySQL insert) |
| `GET` | `/api/analytics/summary` | Get aggregated dashboard stats (total count, averages, distribution breakdown) |
| `GET` | `/api/analytics/departments` | Get feedback counts and average ratings grouped by department |
| `GET` | `/api/analytics/subjects` | Get course ratings breakdown grouped by subject |
| `GET` | `/api/analytics/sentiment` | Get overall sentiment percentage breakdown & qualitative highlights |

---

## 🔧 Troubleshooting & Common Errors

1. **`ER_ACCESS_DENIED_ERROR` / Database Connection Error**
   * **Fix**: Ensure your MySQL server is running and check `backend/.env`. Verify `DB_USER` and `DB_PASSWORD` match your local MySQL credentials.

2. **`ER_NO_SUCH_TABLE` (Table 'student_feedback_db.feedback' doesn't exist)**
   * **Fix**: Run the `database.sql` script inside MySQL Workbench or MySQL CLI to create the table and seed data.

3. **Frontend showing "Could not connect to backend server"**
   * **Fix**: Ensure backend server is running in terminal 1 on port `5000` (`http://localhost:5000/api/health`).

4. **Port 5000 or 5173 in use error**
   * **Fix**: Stop any process using port 5000/5173, or update `PORT` in `backend/.env` and `VITE_API_BASE_URL` in `frontend/.env`.
