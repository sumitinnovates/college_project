-- --------------------------------------------------------
-- Table structure for `admins`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Password for 'admin' is 'admin123' (hashed using werkzeug pbkdf2)
INSERT INTO `admins` (`username`, `password`) VALUES
('admin', 'scrypt:32768:8:1$F2arhyQLeDB5RTj1$7775de5852674638c115322e4a27507956dd4b9c5a7fe445e2c87e5bbeb17d9797626ea671c2d55154bd424b5514b865cb3480d8eb5c2e74578820a81899560c');

-- --------------------------------------------------------
-- Table structure for `courses`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(100) NOT NULL,
  `short_name` varchar(20) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `eligibility` varchar(100) NOT NULL,
  `fee` decimal(10,2) NOT NULL,
  `description` text,
  `created_at` timestamp DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `courses` (`course_name`, `short_name`, `duration`, `eligibility`, `fee`, `description`) VALUES
('Bachelor of Computer Applications', 'BCA', '3 Years', '10+2 with any stream', 45000.00, 'A comprehensive course in computer applications, programming, and software development.'),
('Bachelor of Business Administration', 'BBA', '3 Years', '10+2 with any stream', 50000.00, 'A professional degree to build a strong foundation in business management and administration.'),
('Bachelor of Science in Computer Science', 'B.Sc CS', '3 Years', '10+2 with Science (PCM)', 40000.00, 'Focuses on the theoretical foundations of computing and mathematical algorithms.'),
('Bachelor of Commerce', 'B.Com', '3 Years', '10+2 Commerce preferred', 35000.00, 'An undergraduate degree in commerce and related subjects.');

-- --------------------------------------------------------
-- Table structure for `subjects`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `fk_course_subject` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `subjects` (`course_id`, `semester`, `subject_name`, `description`) VALUES
(1, 1, 'Programming Fundamentals using C', 'Introduction to programming concepts using C language.'),
(1, 1, 'Computer System Architecture', 'Basics of digital electronics and computer architecture.'),
(1, 2, 'Data Structures', 'Study of data organization, management, and storage formats.'),
(1, 2, 'Object Oriented Programming in C++', 'Concepts of OOPs including classes, objects, inheritance, etc.'),
(1, 3, 'Database Management Systems', 'Introduction to database concepts, SQL, and relational algebra.'),
(1, 4, 'Web Technologies', 'HTML, CSS, JavaScript, and basic PHP.'),
(1, 5, 'Java Programming', 'Core Java concepts and application development.'),
(1, 6, 'Project Work', 'Final year development project.');

-- --------------------------------------------------------
-- Table structure for `faculty`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `faculty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `designation` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `qualification` varchar(100) NOT NULL,
  `experience` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT 'default_faculty.png',
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `faculty` (`name`, `designation`, `department`, `qualification`, `experience`, `email`) VALUES
('Dr. Ramesh Sharma', 'HOD & Professor', 'Computer Science', 'Ph.D. in Computer Science', '15 Years', 'ramesh.sharma@sbjsr.in'),
('Ms. Anita Verma', 'Assistant Professor', 'Computer Science', 'MCA, M.Tech', '8 Years', 'anita.verma@sbjsr.in'),
('Mr. Vikram Singh', 'Assistant Professor', 'Business Administration', 'MBA, Ph.D. Scholar', '10 Years', 'vikram.singh@sbjsr.in'),
('Dr. Meera Patel', 'Associate Professor', 'Commerce', 'Ph.D. in Commerce', '12 Years', 'meera.patel@sbjsr.in');

-- --------------------------------------------------------
-- Table structure for `faqs`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `faqs` (`question`, `answer`, `category`, `keywords`) VALUES
('What courses do you offer?', 'We offer BCA, BBA, B.Sc Computer Science, and B.Com.', 'Courses', 'courses, programs, degrees'),
('What is the fee structure for BCA?', 'The BCA fee is ₹45,000 per year. For detailed fee structures, please visit the campus.', 'Fees', 'fee, fees, bca fee, structure'),
('What is the admission process?', 'The process includes: 1. Explore Course 2. Check Eligibility 3. Submit Enquiry 4. Counselling 5. Document Verification 6. Admission.', 'Admission', 'process, apply, admission, steps'),
('How can I contact the college?', 'You can reach us at bjsrjaincollege@gmail.com or call us at (+91) 96805 88414.', 'Contact', 'contact, phone, email, reach');

-- --------------------------------------------------------
-- Table structure for `admission_enquiries`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admission_enquiries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `date_of_birth` date NOT NULL,
  `address` text NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `qualification` varchar(50) NOT NULL,
  `percentage` decimal(5,2) NOT NULL,
  `course` varchar(50) NOT NULL,
  `admission_year` varchar(10) NOT NULL,
  `message` text,
  `status` enum('Pending','Contacted','Admitted','Rejected') DEFAULT 'Pending',
  `created_at` timestamp DEFAULT current_timestamp(),
  `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `admission_enquiries` (`full_name`, `email`, `phone`, `gender`, `date_of_birth`, `address`, `city`, `state`, `qualification`, `percentage`, `course`, `admission_year`, `message`, `status`) VALUES
('Rahul Kumar', 'rahul@example.com', '9876543210', 'Male', '2005-04-12', '123 Main Street', 'New Delhi', 'Delhi', '12th Science', 85.50, 'BCA', '2026', 'I am interested in joining the BCA program. Can you share the latest placement records?', 'Pending'),
('Priya Singh', 'priya@example.com', '9876543211', 'Female', '2006-08-22', '456 MG Road', 'Mumbai', 'Maharashtra', '12th Commerce', 78.00, 'BBA', '2026', 'What is the timing of the classes?', 'Contacted');
