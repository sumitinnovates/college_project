# 🎓 College Admission Enquiry System

![Python](https://img.shields.io/badge/Python-3.x-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.1.1-lightgrey.svg)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)

A complete web-based **College Admission Enquiry System** developed using Python, Flask, and MySQL. This system provides an interactive platform for students to explore college courses, view faculty, and submit admission enquiries. It also features a robust Admin Dashboard for college staff to manage and track those enquiries efficiently.

---

## 🌟 Key Features

### 👨‍🎓 Public Facing (Students & Parents)
- **Home & About:** Explore featured courses and learn about the college.
- **Course Details:** Browse available courses, fees, eligibility, and semester-wise subjects.
- **Faculty Directory:** View college faculty members grouped by their respective departments.
- **Admissions & FAQs:** Read the admission process and common FAQs.
- **Online Enquiry Form:** An interactive, AJAX-powered form to submit admission queries.
- **Chatbot Integration Support:** Built-in API endpoints to feed data to a frontend chatbot.

### 🔐 Admin Dashboard (College Staff)
- **Secure Login:** Protected admin routes with hashed passwords (Werkzeug).
- **Dashboard Overview:** Quick statistics on total, pending, contacted, admitted, and rejected enquiries.
- **Enquiry Management:** 
  - Search and filter enquiries by status, course, or year.
  - View detailed information of each applicant.
  - Update enquiry status (`Pending` ➔ `Contacted` ➔ `Admitted` / `Rejected`).
  - Delete obsolete enquiries.

---

## 🛠️ Technology Stack

| Component | Technology |
| --- | --- |
| **Backend Framework** | Python (Flask) |
| **Database** | MySQL |
| **Database Driver** | PyMySQL |
| **Frontend** | HTML5, CSS3, JavaScript |
| **Templating Engine** | Jinja2 |
| **Security** | Werkzeug Password Hashing |

---

## 🚀 Installation & Setup Guide

Follow these steps to run the project on your local machine.

### 1. Prerequisites
- Python 3.x installed
- MySQL Server installed and running
- Git (optional)

### 2. Clone the Repository (or navigate to the project folder)
```bash
cd "college project python"
```

### 3. Setup Virtual Environment (Recommended)
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Database Configuration
1. Open your MySQL client (e.g., phpMyAdmin, MySQL Workbench, or CLI).
2. Import the provided SQL script to create the database and tables:
   - File location: `database/database.sql`
   - This script will automatically create the database `college_admission_python` and insert sample data (courses, faculty, faqs, admin user).

### 6. Environment Variables
Create a `.env` file in the root directory (if not already present) and configure your database connection:

```env
SECRET_KEY=your_super_secret_key_here
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=college_admission_python
```

### 7. Run the Application
```bash
python app.py
```
The application will start running on `http://127.0.0.1:8080/`.

---

## 🔑 Default Admin Credentials

To access the admin dashboard, navigate to `http://127.0.0.1:8080/admin/login` and use the following credentials (provided by the initial SQL dump):

- **Username:** `admin`
- **Password:** `admin123`

*(Note: It is highly recommended to change this password in a production environment.)*

---

## 📁 Project Structure

```text
college project python/
│
├── app.py                  # Main Flask application and routes
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (Database credentials)
├── README.md               # Project documentation
│
├── database/
│   └── database.sql        # MySQL Database schema and seed data
│
├── static/                 # Static assets (CSS, JS, Images)
│   ├── css/
│   ├── js/
│   └── images/
│
└── templates/              # Jinja2 HTML Templates
    ├── index.html
    ├── about.html
    ├── admin/              # Admin panel templates
    └── ...
```

---

## 🤝 Contributing

This project was developed for a college dissertation/project. Feel free to fork and enhance it for your own learning purposes!

---
*Developed by SBJS Rampuria Jain College Project Team.*
