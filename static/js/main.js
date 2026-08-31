document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            // Toggle icon between hamburger and close
            const icon = mobileMenuBtn.innerHTML;
            if (icon.includes('☰')) {
                mobileMenuBtn.innerHTML = '✕';
            } else {
                mobileMenuBtn.innerHTML = '☰';
            }
        });
    }

    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            
            // Close all others
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                    otherItem.querySelector('.icon').textContent = '+';
                }
            });

            // Toggle current
            item.classList.toggle('active');
            const icon = header.querySelector('.icon');
            
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.textContent = '-';
            } else {
                content.style.maxHeight = null;
                icon.textContent = '+';
            }
        });
    });

    // Chatbot UI Shell (Preparation for Phase 5)
    const chatbotBtn = document.querySelector('.chatbot-btn');
    if (chatbotBtn) {
        chatbotBtn.addEventListener('click', () => {
            alert('Chatbot feature will be implemented in Phase 5!');
        });
    }
});
