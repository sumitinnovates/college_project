# Web-Based College Admission Enquiry System

A comprehensive, fully functional web application designed as a BCA final-year academic project. It provides a polished public-facing portal for prospective students and a secure backend administration panel for managing admission enquiries.

## Features

- **Dynamic Public Website:** Responsive and modern UI with dynamic content loaded from the database (Courses, Faculty, FAQs).
- **Interactive Chatbot:** A custom, rule-based Vanilla JS chatbot serving fast, context-aware answers regarding admissions without relying on external APIs.
- **Enquiry System:** A secure AJAX-based admission enquiry form featuring robust client-side and server-side validation.
- **Admin Panel:** Secure authentication system with CSRF protection, session regeneration, and password hashing.
- **Enquiry Management:** Admins can view, search, filter, update statuses, and securely delete enquiries.
- **Security:** Built using PDO prepared statements to prevent SQL Injection and `htmlspecialchars()` to prevent XSS.

## Technologies Used

- **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox, Grid), Vanilla JavaScript
- **Backend:** PHP 8+ (Vanilla, PDO)
- **Database:** MySQL
- **Environment:** Laravel Herd / XAMPP compatible

## Folder Structure

```
college-project/
├── admin/               # Secure admin panel (Dashboard, login, management)
├── chatbot/             # Chatbot UI and Vanilla JS logic
├── css/                 # Global styles and responsive design
├── database/            # Contains database.sql for initial import
├── images/              # Assets
├── includes/            # Reusable header and footer components
├── js/                  # Global javascript (Navbar, accordions)
├── php/                 # Database configuration, connections, and endpoints
└── *.php                # Public facing pages (index, about, courses, etc.)
```

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client (e.g., phpMyAdmin, TablePlus, or CLI).
2. Create a new database named `college_admission`.
3. Import the `database/database.sql` file to create the necessary tables and populate demo data.

### 2. Environment Configuration
1. Ensure the `.env` file in the root directory contains your correct MySQL credentials:
   ```
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=college_admission
   DB_USER=root
   DB_PASS=dbpass
   ```
*(Note: Modify `DB_PASS` and `DB_USER` as per your local environment. The current credentials are set for the development environment.)*

### 3. Running the Project
Since this project uses plain PHP, you can run it using any local PHP server:
- **Laravel Herd:** Simply place the folder in your Herd paths. It will automatically be served.
- **XAMPP/WAMP:** Place the project inside `htdocs` or `www` and access it via `http://localhost/college-project`.
- **PHP Built-in Server:** Run `php -S localhost:8000` in the terminal and visit `http://localhost:8000`.

## Admin Login
To access the admin panel, navigate to `/admin/login.php` or `/admin/`.
- **Demo Username:** `admin`
- **Demo Password:** `admin123`

*(Important: Change these credentials before deploying to a production environment!)*

## Security Notes
- The `.env` file and SQL files are protected from direct access via the included `.htaccess` file.
- All forms are protected against CSRF and XSS attacks.
