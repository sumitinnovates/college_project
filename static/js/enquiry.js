document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('enquiryForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset errors
        document.querySelectorAll('.error-msg').forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });
        document.getElementById('globalError').style.display = 'none';

        // Get values
        const name = document.getElementById('full_name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const qualification = document.getElementById('qualification').value.trim();
        const percentage = document.getElementById('percentage').value.trim();
        const course = document.getElementById('course').value.trim();
        const admissionYear = document.getElementById('admission_year').value.trim();
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        // Validation Rules
        if (name.length < 3) {
            showError('err_full_name', 'Please enter a valid full name (min 3 characters).');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('err_email', 'Please enter a valid email address.');
            isValid = false;
        }

        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone)) {
            showError('err_phone', 'Please enter a valid phone number (10-15 digits only).');
            isValid = false;
        }

        if (qualification === "") {
            showError('err_qualification', 'Please select a qualification.');
            isValid = false;
        }

        if (percentage !== "") {
            const percNum = parseFloat(percentage);
            if (isNaN(percNum) || percNum < 0 || percNum > 100) {
                showError('err_percentage', 'Percentage must be between 0 and 100.');
                isValid = false;
            }
        }

        if (course === "") {
            showError('err_course', 'Please select a course.');
            isValid = false;
        }

        if (admissionYear === "") {
            showError('err_admission_year', 'Please select an admission year.');
            isValid = false;
        }

        if (message.length < 10) {
            showError('err_message', 'Message is too short (min 10 characters).');
            isValid = false;
        }

        if (!isValid) {
            showToast("Please fill all required fields correctly.", "error");
            return;
        }

        // Submission state
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const originalText = btnText.textContent;

        submitBtn.disabled = true;
        btnText.textContent = 'Submitting...';

        try {
            const formData = new FormData(form);
            const response = await fetch('/api/submit_enquiry', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.success) {
                // Show success state
                document.getElementById('formContainer').style.display = 'none';
                document.getElementById('successState').style.display = 'block';
                document.getElementById('refNumberDisplay').textContent = 'ENQ-' + String(result.enquiry_id).padStart(6, '0');
            } else {
                // Show backend validation error
                const globalError = document.getElementById('globalError');
                globalError.textContent = result.message || 'Submission failed. Please check your inputs.';
                globalError.style.display = 'block';
                showToast(result.message || 'Submission failed.', 'error');
                submitBtn.disabled = false;
                btnText.textContent = originalText;
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            const globalError = document.getElementById('globalError');
            globalError.textContent = 'A network error occurred. Please try again later.';
            globalError.style.display = 'block';
            showToast("A network error occurred. Please try again later.", "error");
            submitBtn.disabled = false;
            btnText.textContent = originalText;
        }
    });

    function showError(elementId, message) {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = message;
            el.style.display = 'block';
        }
    }

    function showToast(message, type = 'error') {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.padding = '15px 25px';
        toast.style.borderRadius = '5px';
        toast.style.color = '#fff';
        toast.style.backgroundColor = type === 'error' ? '#ef4444' : '#22c55e';
        toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        toast.style.zIndex = '9999';
        toast.style.fontFamily = "'Inter', sans-serif";
        toast.style.transition = 'opacity 0.3s ease';
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
