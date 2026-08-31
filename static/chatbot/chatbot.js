document.addEventListener('DOMContentLoaded', () => {

    // --- State ---
    let dbData = { courses: [], faqs: [] };
    let currentContext = null;
    let isWaitingForBot = false;

    // --- Elements ---
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatBody = document.getElementById('chatBody');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    // Check if chatbot shell exists
    if (!chatbotToggle || !chatbotWindow) return;

    // --- Initialization ---
    initChatbot();

    async function initChatbot() {
        try {
            const res = await fetch('/api/chatbot_data');
            const result = await res.json();
            if (result.success) {
                dbData = result.data;
            }
        } catch (e) {
            console.error("Chatbot failed to load data.", e);
        }

        // Add event listeners
        chatbotToggle.addEventListener('click', toggleChat);
        chatbotClose.addEventListener('click', toggleChat);

        chatSend.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });

        // Show initial welcome message
        setTimeout(() => {
            appendBotMessage("Hi! 👋 I'm your Admission Assistant. I can help you with courses, fees, eligibility, subjects, documents and the admission process.");
            appendQuickReplies([
                "Courses", "Fees", "Eligibility", "Admission Process", "Documents", "Contact"
            ]);
        }, 500);
    }

    // --- UI Controls ---
    function toggleChat() {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatInput.focus();
            chatbotToggle.style.transform = 'scale(0)';
        } else {
            chatbotToggle.style.transform = 'scale(1)';
        }
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function appendUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'chat-message message-user';
        div.textContent = text;
        chatBody.appendChild(div);
        scrollToBottom();
    }

    function appendBotMessage(text) {
        const div = document.createElement('div');
        div.className = 'chat-message message-bot';
        div.textContent = text; // Secure from XSS
        chatBody.appendChild(div);
        scrollToBottom();
    }

    function appendBotMessageWithHTML(html) {
        // Used only for static controlled links like "Make an Enquiry"
        const div = document.createElement('div');
        div.className = 'chat-message message-bot';
        div.innerHTML = html;
        chatBody.appendChild(div);
        scrollToBottom();
    }

    function appendQuickReplies(replies) {
        const container = document.createElement('div');
        container.className = 'quick-replies';

        replies.forEach(reply => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn';
            btn.textContent = reply;
            btn.addEventListener('click', () => {
                // Remove quick replies container after click
                container.remove();
                processUserInput(reply);
            });
            container.appendChild(btn);
        });

        chatBody.appendChild(container);
        scrollToBottom();
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.id = 'typingIndicator';
        div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatBody.appendChild(div);
        scrollToBottom();
    }

    function removeTyping() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    // --- Interaction ---
    function handleSend() {
        const text = chatInput.value.trim();
        if (!text || isWaitingForBot) return;

        chatInput.value = '';

        // Remove existing quick replies
        document.querySelectorAll('.quick-replies').forEach(el => el.remove());

        processUserInput(text);
    }

    function processUserInput(text) {
        appendUserMessage(text);

        isWaitingForBot = true;
        chatSend.disabled = true;
        showTyping();

        // Simulate network/processing delay (400 - 700ms)
        const delay = Math.floor(Math.random() * 300) + 400;

        setTimeout(() => {
            removeTyping();
            generateBotResponse(text);
            isWaitingForBot = false;
            chatSend.disabled = false;
            chatInput.focus();
        }, delay);
    }

    // --- NLP Logic ---
    function generateBotResponse(input) {
        const text = input.toLowerCase();

        // Keyword definitions
        const intents = {
            greeting: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
            thanks: ['thanks', 'thank you', 'thx'],
            courses: ['course', 'courses', 'program', 'programs', 'degree', 'bca', 'bba', 'bsc', 'bcom', 'b.sc', 'b.com'],
            fees: ['fee', 'fees', 'cost', 'charges', 'tuition', 'price'],
            eligibility: ['eligibility', 'eligible', 'qualification', 'percentage', 'criteria', 'requirement'],
            subjects: ['subject', 'subjects', 'syllabus', 'semester', 'curriculum'],
            faculty: ['faculty', 'teacher', 'teachers', 'professor', 'professors'],
            admission: ['admission', 'apply', 'application', 'process', 'procedure'],
            documents: ['document', 'documents', 'certificate', 'certificates', 'papers'],
            duration: ['duration', 'years', 'year'],
            contact: ['contact', 'phone', 'email', 'address', 'location', 'office', 'timing']
        };

        // Extract course context if mentioned
        const courseKeywords = ['bca', 'bba', 'bsc', 'bcom', 'b.sc', 'b.com'];
        let matchedCourse = null;
        for (let ck of courseKeywords) {
            if (text.includes(ck)) {
                matchedCourse = ck.replace('.', '').toUpperCase(); // normalize to BCA, BBA, BSC, BCOM
                currentContext = matchedCourse;
                break;
            }
        }

        // Determine primary intents
        let matchedIntents = [];
        for (const [intentName, keywords] of Object.entries(intents)) {
            if (keywords.some(kw => text.includes(kw))) {
                matchedIntents.push(intentName);
            }
        }

        // Handle specific logic based on intent
        if (matchedIntents.includes('greeting')) {
            appendBotMessage("Hello! How can I assist you with your college admission today?");
            return;
        }

        if (matchedIntents.includes('thanks')) {
            appendBotMessage("You're very welcome! Let me know if you need anything else.");
            currentContext = null;
            return;
        }

        if (matchedIntents.includes('contact')) {
            appendBotMessage("You can reach us at (+91) 96805 88414 or bjsrjaincollege@gmail.com. Our office is open Monday to Saturday, 9 AM to 5 PM.");
            appendQuickReplies(["Admission Process", "Courses", "Make an Enquiry"]);
            return;
        }

        if (matchedIntents.includes('faculty')) {
            appendBotMessage("We have a team of highly experienced and qualified professors across all departments. You can view their complete profiles on our Faculty page.");
            return;
        }

        if (matchedIntents.includes('documents')) {
            appendBotMessage("To apply, you will typically need: 10th & 12th Marksheets, TC, Character Certificate, ID Proof (Aadhaar), and 4 passport photos.");
            appendBotMessageWithHTML("Ready to apply? <a href='/enquiry'><strong>Make an Enquiry</strong></a>");
            return;
        }

        if (matchedIntents.includes('admission')) {
            appendBotMessage("The admission process is simple: 1) Explore courses 2) Submit an enquiry 3) Attend counselling 4) Document verification 5) Fee payment.");
            appendQuickReplies(["Documents Required", "Make an Enquiry"]);
            return;
        }

        // Handle Course-Specific Queries (Fees, Eligibility, Duration, Subjects)
        // If they ask about fees, but we don't know which course, check currentContext

        let targetCourseName = matchedCourse || currentContext;

        if (targetCourseName && dbData.courses.length > 0) {
            // Find course in DB
            // Normalizing names for comparison
            const dbCourse = dbData.courses.find(c => c.short_name.toUpperCase().replace('.', '') === targetCourseName);

            if (dbCourse) {
                if (matchedIntents.includes('fees')) {
                    appendBotMessage(`The fee for ${dbCourse.short_name} is ₹${parseFloat(dbCourse.fee).toLocaleString()}/year.`);
                    appendQuickReplies(["Eligibility", "Subjects", "Admission Process"]);
                    return;
                }
                if (matchedIntents.includes('eligibility')) {
                    appendBotMessage(`To be eligible for ${dbCourse.short_name}, you need: ${dbCourse.eligibility}.`);
                    appendQuickReplies(["Fees", "Admission Process", "Make an Enquiry"]);
                    return;
                }
                if (matchedIntents.includes('duration')) {
                    appendBotMessage(`The duration for ${dbCourse.short_name} is ${dbCourse.duration}.`);
                    return;
                }
                if (matchedIntents.includes('subjects')) {
                    appendBotMessage(`${dbCourse.short_name} covers a comprehensive curriculum designed for industry needs. You can view the full semester-wise syllabus on the specific Course Details page.`);
                    return;
                }
                if (matchedIntents.includes('courses')) {
                    appendBotMessage(`${dbCourse.course_name} (${dbCourse.short_name}) is one of our premier programs. ${dbCourse.description.substring(0, 100)}...`);
                    appendQuickReplies(["Fees", "Eligibility", "Make an Enquiry"]);
                    return;
                }
            }
        }

        // Handle generic queries if no specific course context is found
        if (matchedIntents.includes('courses')) {
            if (dbData.courses.length > 0) {
                const cNames = dbData.courses.map(c => c.short_name).join(', ');
                appendBotMessage(`We currently offer: ${cNames}. Which program are you interested in?`);
                appendQuickReplies(dbData.courses.map(c => c.short_name));
            } else {
                appendBotMessage("We offer a variety of undergraduate programs including BCA, BBA, B.Sc, and B.Com.");
                appendQuickReplies(["BCA", "BBA", "B.Sc", "B.Com"]);
            }
            return;
        }

        if (matchedIntents.includes('fees') || matchedIntents.includes('eligibility') || matchedIntents.includes('duration') || matchedIntents.includes('subjects')) {
            appendBotMessage(`Which specific course would you like to know the ${matchedIntents[0]} for?`);
            if (dbData.courses.length > 0) {
                appendQuickReplies(dbData.courses.map(c => c.short_name));
            }
            return;
        }

        // FAQ checking as a secondary fallback
        if (dbData.faqs.length > 0) {
            for (let faq of dbData.faqs) {
                // simple keyword match against question
                const words = text.split(' ').filter(w => w.length > 3);
                for (let w of words) {
                    if (faq.question.toLowerCase().includes(w)) {
                        appendBotMessage(faq.answer);
                        return;
                    }
                }
            }
        }

        // Fallback
        appendBotMessage("I'm sorry, I couldn't find an answer to that. I can help with courses, fees, eligibility, subjects, faculty, documents, admission process and contact information.");
        appendQuickReplies(["Courses", "Fees", "Admission Process", "Contact"]);
    }
});
