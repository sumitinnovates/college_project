"""
College Admission Enquiry System - Flask Application
=====================================================
This is the main application file that contains all the routes
and database logic for the College Admission Enquiry System.

Technology Stack:
- Backend: Python Flask
- Database: MySQL (via PyMySQL)
- Frontend: Jinja2 Templates, HTML, CSS, JavaScript

Author: SBJS Rampuria Jain College Project
"""

import os
import re
from datetime import datetime
from collections import OrderedDict

import pymysql
from flask import (
    Flask, render_template, request, redirect,
    url_for, session, flash, jsonify
)
from werkzeug.security import check_password_hash
from dotenv import load_dotenv

# ------------------------------------------------------------------
# App Configuration
# ------------------------------------------------------------------
load_dotenv()  # Load variables from .env file

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'default_secret_key')


# ------------------------------------------------------------------
# Database Helper Functions
# ------------------------------------------------------------------
def get_db():
    """Create and return a new database connection."""
    return pymysql.connect(
        host=os.getenv('DB_HOST', '127.0.0.1'),
        port=int(os.getenv('DB_PORT', 3306)),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASS', ''),
        database=os.getenv('DB_NAME', 'college_admission_python'),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )


def query_db(sql, params=None, fetchone=False):
    """
    Execute a SELECT query and return results.
    Uses parameterized queries to prevent SQL Injection.
    """
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params or ())
            if fetchone:
                return cursor.fetchone()
            return cursor.fetchall()
    except pymysql.MySQLError:
        return None if fetchone else []
    finally:
        conn.close()


def execute_db(sql, params=None):
    """
    Execute an INSERT, UPDATE, or DELETE query.
    Returns the last inserted ID for INSERT operations.
    """
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params or ())
            conn.commit()
            return cursor.lastrowid
    except pymysql.MySQLError:
        conn.rollback()
        return None
    finally:
        conn.close()


# ------------------------------------------------------------------
# Admin Login Required Decorator
# ------------------------------------------------------------------
def login_required(f):
    """Decorator to protect admin routes. Redirects to login if not authenticated."""
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function


# ==================================================================
# PUBLIC ROUTES
# ==================================================================

@app.route('/')
def index():
    """Home Page - Shows featured courses and faculty."""
    courses = query_db("SELECT * FROM courses LIMIT 4")
    faculty_list = query_db("SELECT * FROM faculty LIMIT 4")
    return render_template('index.html', courses=courses, faculty_list=faculty_list)


@app.route('/about')
def about():
    """About Page - Static content about the college."""
    return render_template('about.html')


@app.route('/courses')
def courses():
    """Courses Page - Lists all available courses from the database."""
    courses = query_db("SELECT * FROM courses ORDER BY course_name ASC")
    return render_template('courses.html', courses=courses)


@app.route('/course/<int:course_id>')
def course_details(course_id):
    """Course Details Page - Shows course info and semester-wise subjects."""
    course = query_db("SELECT * FROM courses WHERE id = %s", (course_id,), fetchone=True)

    semesters = OrderedDict()
    if course:
        subjects = query_db(
            "SELECT * FROM subjects WHERE course_id = %s ORDER BY semester ASC",
            (course_id,)
        )
        # Group subjects by semester number
        for subject in subjects:
            sem = subject['semester']
            if sem not in semesters:
                semesters[sem] = []
            semesters[sem].append(subject)

    return render_template('course_details.html', course=course, semesters=semesters)


@app.route('/admissions')
def admissions():
    """Admissions Page - Admission process steps and FAQs."""
    faqs = query_db("SELECT * FROM faqs ORDER BY category ASC")
    return render_template('admissions.html', faqs=faqs)


@app.route('/faculty')
def faculty():
    """Faculty Page - Faculty members grouped by department."""
    faculty_list = query_db(
        "SELECT * FROM faculty ORDER BY CASE WHEN department = 'Computer Science' THEN 0 ELSE 1 END, department ASC, name ASC"
    )

    # Group faculty by department
    departments = OrderedDict()
    for member in faculty_list:
        dept = member['department']
        if dept not in departments:
            departments[dept] = []
        departments[dept].append(member)

    return render_template('faculty.html', departments=departments)


@app.route('/contact')
def contact():
    """Contact Page - Static contact information."""
    return render_template('contact.html')


@app.route('/enquiry')
def enquiry():
    """Enquiry Form Page - Shows the admission enquiry form."""
    courses = query_db(
        "SELECT short_name, course_name FROM courses ORDER BY course_name ASC"
    )
    preselected_course = request.args.get('course', '').strip()
    current_year = datetime.now().year
    admission_years = [current_year + i for i in range(3)]

    return render_template(
        'enquiry.html',
        courses=courses,
        preselected_course=preselected_course,
        admission_years=admission_years
    )


# ==================================================================
# API ROUTES (JSON Responses)
# ==================================================================

@app.route('/api/submit_enquiry', methods=['POST'])
def api_submit_enquiry():
    """
    API Endpoint: Submit Admission Enquiry
    Receives form data via AJAX POST, validates it, and inserts into database.
    Returns JSON response with success status and enquiry ID.
    """
    if request.method != 'POST':
        return jsonify({'success': False, 'message': 'Invalid request method.'})

    # Retrieve and sanitize form fields
    full_name = request.form.get('full_name', '').strip()
    email = request.form.get('email', '').strip()
    phone = request.form.get('phone', '').strip()
    gender = request.form.get('gender', '').strip()
    date_of_birth = request.form.get('date_of_birth', '').strip()
    address = request.form.get('address', '').strip()
    city = request.form.get('city', '').strip()
    state = request.form.get('state', '').strip()
    qualification = request.form.get('qualification', '').strip()
    percentage = request.form.get('percentage', '').strip()
    course = request.form.get('course', '').strip()
    admission_year = request.form.get('admission_year', '').strip()
    message = request.form.get('message', '').strip()

    # Server-side validation
    errors = []

    if len(full_name) < 3:
        errors.append("Please provide a valid full name.")

    if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
        errors.append("Please provide a valid email address.")

    if not re.match(r'^[0-9]{10,15}$', phone):
        errors.append("Please provide a valid phone number.")

    if not qualification:
        errors.append("Qualification is required.")

    # Validate percentage
    if percentage:
        try:
            perc_num = float(percentage)
            if perc_num < 0 or perc_num > 100:
                errors.append("Percentage must be between 0 and 100.")
        except ValueError:
            errors.append("Invalid percentage value.")
    else:
        percentage = 0  # Default if empty

    # Validate course exists in database
    if not course:
        errors.append("Course selection is required.")
    else:
        course_exists = query_db(
            "SELECT COUNT(*) as cnt FROM courses WHERE short_name = %s",
            (course,), fetchone=True
        )
        if not course_exists or course_exists['cnt'] == 0:
            errors.append("Selected course is invalid.")

    if not admission_year:
        errors.append("Admission year is required.")

    if len(message) < 10:
        errors.append("Please provide a longer message/query.")

    if errors:
        return jsonify({'success': False, 'message': ' '.join(errors)})

    # Ensure valid gender enum value
    valid_genders = ['Male', 'Female', 'Other']
    safe_gender = gender if gender in valid_genders else 'Other'

    # Default date of birth if empty
    dob = date_of_birth if date_of_birth else '2000-01-01'

    # Insert into database
    sql = """INSERT INTO admission_enquiries
             (full_name, email, phone, gender, date_of_birth, address,
              city, state, qualification, percentage, course,
              admission_year, message, status)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'Pending')"""

    enquiry_id = execute_db(sql, (
        full_name, email, phone, safe_gender, dob, address,
        city, state, qualification, percentage, course,
        admission_year, message
    ))

    if enquiry_id:
        return jsonify({
            'success': True,
            'message': 'Enquiry submitted successfully.',
            'enquiry_id': enquiry_id
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Failed to submit enquiry. Please try again later.'
        })


@app.route('/api/chatbot_data')
def api_chatbot_data():
    """
    API Endpoint: Chatbot Data
    Returns courses and FAQs data as JSON for the frontend chatbot.
    """
    data = {'courses': [], 'faqs': []}

    courses = query_db(
        "SELECT short_name, course_name, duration, eligibility, fee, description FROM courses"
    )
    faqs = query_db("SELECT question, answer, category FROM faqs")

    if courses:
        # Convert Decimal fee to float for JSON serialization
        for c in courses:
            c['fee'] = float(c['fee']) if c['fee'] else 0
        data['courses'] = courses

    if faqs:
        data['faqs'] = faqs

    return jsonify({'success': True, 'data': data})


# ==================================================================
# ADMIN ROUTES
# ==================================================================

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """Admin Login Page - Handles both form display and authentication."""
    # If already logged in, redirect to dashboard
    if 'admin_id' in session:
        return redirect(url_for('admin_dashboard'))

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')

        if not username or not password:
            flash('Invalid username or password.', 'error')
            return redirect(url_for('admin_login'))

        # Check credentials from database
        admin = query_db(
            "SELECT id, password FROM admins WHERE username = %s LIMIT 1",
            (username,), fetchone=True
        )

        if admin and check_password_hash(admin['password'], password):
            # Successful login
            session['admin_id'] = admin['id']
            return redirect(url_for('admin_dashboard'))
        else:
            # Generic error to prevent username enumeration
            flash('Invalid username or password.', 'error')
            return redirect(url_for('admin_login'))

    return render_template('admin/login.html')


@app.route('/admin/logout')
def admin_logout():
    """Admin Logout - Clears session and redirects to login."""
    session.clear()
    return redirect(url_for('admin_login'))


@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    """Admin Dashboard - Shows statistics and recent enquiries."""
    stats = {
        'total': 0, 'pending': 0, 'contacted': 0,
        'admitted': 0, 'rejected': 0
    }

    total = query_db("SELECT COUNT(*) as cnt FROM admission_enquiries", fetchone=True)
    pending = query_db("SELECT COUNT(*) as cnt FROM admission_enquiries WHERE status = 'Pending'", fetchone=True)
    contacted = query_db("SELECT COUNT(*) as cnt FROM admission_enquiries WHERE status = 'Contacted'", fetchone=True)
    admitted = query_db("SELECT COUNT(*) as cnt FROM admission_enquiries WHERE status = 'Admitted'", fetchone=True)
    rejected = query_db("SELECT COUNT(*) as cnt FROM admission_enquiries WHERE status = 'Rejected'", fetchone=True)

    if total:
        stats['total'] = total['cnt']
    if pending:
        stats['pending'] = pending['cnt']
    if contacted:
        stats['contacted'] = contacted['cnt']
    if admitted:
        stats['admitted'] = admitted['cnt']
    if rejected:
        stats['rejected'] = rejected['cnt']

    recent_enquiries = query_db(
        "SELECT id, full_name, course, phone, status, created_at "
        "FROM admission_enquiries ORDER BY created_at DESC LIMIT 10"
    )

    return render_template(
        'admin/dashboard.html',
        stats=stats,
        recent_enquiries=recent_enquiries
    )


@app.route('/admin/enquiries')
@login_required
def admin_enquiries():
    """Admin Enquiries Page - Filterable and searchable list of all enquiries."""
    # Get filter dropdown data
    available_courses = query_db(
        "SELECT short_name FROM courses ORDER BY short_name ASC"
    )
    available_courses = [c['short_name'] for c in available_courses] if available_courses else []

    current_year = datetime.now().year
    years = [current_year + i for i in range(3)]

    # Build dynamic query based on filters
    query = ("SELECT id, full_name, email, phone, course, percentage, status, created_at "
             "FROM admission_enquiries WHERE 1=1")
    params = []

    search = request.args.get('search', '').strip()
    if search:
        query += " AND (full_name LIKE %s OR email LIKE %s OR phone LIKE %s)"
        like_search = f"%{search}%"
        params.extend([like_search, like_search, like_search])

    status_filter = request.args.get('status', '').strip()
    if status_filter in ['Pending', 'Contacted', 'Admitted', 'Rejected']:
        query += " AND status = %s"
        params.append(status_filter)

    course_filter = request.args.get('course', '').strip()
    if course_filter:
        query += " AND course = %s"
        params.append(course_filter)

    year_filter = request.args.get('year', '').strip()
    if year_filter and year_filter.isdigit():
        query += " AND admission_year = %s"
        params.append(year_filter)

    query += " ORDER BY created_at DESC"

    enquiries = query_db(query, params)

    return render_template(
        'admin/enquiries.html',
        enquiries=enquiries,
        available_courses=available_courses,
        years=years,
        search=search,
        status_filter=status_filter,
        course_filter=course_filter,
        year_filter=year_filter
    )


@app.route('/admin/enquiry/<int:enquiry_id>')
@login_required
def admin_view_enquiry(enquiry_id):
    """Admin View Enquiry - Shows full details of a single enquiry."""
    if enquiry_id <= 0:
        return redirect(url_for('admin_enquiries'))

    enquiry = query_db(
        "SELECT * FROM admission_enquiries WHERE id = %s",
        (enquiry_id,), fetchone=True
    )

    return render_template('admin/view_enquiry.html', enquiry=enquiry)


@app.route('/admin/update_status', methods=['POST'])
@login_required
def admin_update_status():
    """Admin Update Status - Updates the status of an enquiry."""
    enquiry_id = request.form.get('id', 0, type=int)
    status = request.form.get('status', '').strip()

    allowed_statuses = ['Pending', 'Contacted', 'Admitted', 'Rejected']

    if enquiry_id > 0 and status in allowed_statuses:
        execute_db(
            "UPDATE admission_enquiries SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
            (status, enquiry_id)
        )
        flash(f"Status successfully updated to '{status}'.", 'success')
    else:
        flash("Failed to update status.", 'error')

    return redirect(url_for('admin_view_enquiry', enquiry_id=enquiry_id))


@app.route('/admin/delete_enquiry', methods=['POST'])
@login_required
def admin_delete_enquiry():
    """Admin Delete Enquiry - Deletes an enquiry from the database."""
    enquiry_id = request.form.get('id', 0, type=int)

    if enquiry_id > 0:
        execute_db(
            "DELETE FROM admission_enquiries WHERE id = %s",
            (enquiry_id,)
        )

    return redirect(url_for('admin_enquiries'))


# ==================================================================
# ERROR HANDLERS
# ==================================================================

@app.errorhandler(404)
def page_not_found(e):
    """Custom 404 Error Page"""
    return render_template('404.html'), 404


# ==================================================================
# RUN APPLICATION
# ==================================================================

if __name__ == '__main__':
    app.run(debug=True, port=8080)
