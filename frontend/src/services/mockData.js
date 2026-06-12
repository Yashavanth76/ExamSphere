// src/services/mockData.js

export const initialUsers = [
  {
    username: "student_bca",
    password: "password123",
    fullName: "Alice Vance",
    role: "student",
    classStream: "BCA",
    dob: "2004-06-15",
    gender: "Female",
    attempts: { "exam-react-202": 85 } // Already completed one
  },
  {
    username: "student_engg",
    password: "password123",
    fullName: "Bob Carter",
    role: "student",
    classStream: "Engineering",
    dob: "2003-09-22",
    gender: "Male",
    attempts: {} // No attempts yet
  },
  {
    username: "teacher_pro",
    password: "password123",
    fullName: "Dr. Evelyn Ross",
    role: "teacher",
    qualification: "Ph.D. in Computer Science",
    subjectExpertise: "Algorithms & Web Architectures"
  },
  {
    username: "principal_root",
    password: "password123",
    fullName: "Dr. K. S. Sharma", // Example Principal Name
    role: "admin", // Keeps internal system routing authority intact
    qualification: "Ph.D. in Education Management",
    subjectExpertise: "Institutional Governance & Academics"
  }
];

export const initialExams = [
  {
    id: "exam-dsa-101",
    title: "Data Structures & Algorithms",
    description: "Evaluate your knowledge on Trees, Graphs, Sorting algorithms, and Time Complexity optimization.",
    durationMinutes: 45,
    stream: "Engineering",
    subject: "Computer Science",
    totalQuestions: 2
  },
  {
    id: "exam-react-202",
    title: "React Core Fundamentals",
    description: "Validate your mastery of React Hooks, context isolation, virtual DOM diffing, and performance optimization rules.",
    durationMinutes: 30,
    stream: "BCA",
    subject: "Frontend Engineering",
    totalQuestions: 2
  },
  {
    id: "exam-accounting-301",
    title: "Advanced Financial Accounting",
    description: "Covers corporate restructuring, consolidated financial statements, and valuation paradigms.",
    durationMinutes: 60,
    stream: "BCom",
    subject: "Accounting",
    totalQuestions: 1
  }
];

export const examQuestions = {
  "exam-dsa-101": [
    { id: "q1", text: "What is the lookup time complexity in a balanced BST?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"] },
    { id: "q2", text: "Which underlying data structure is typically used to implement Breadth-First Search (BFS)?", options: ["Stack", "Queue", "Priority Queue", "Linked List"] }
  ],
  "exam-react-202": [
    { id: "q3", text: "Which hook computes and caches heavy structural calculations?", options: ["useCallback", "useMemo", "useRef", "useTransition"] },
    { id: "q4", text: "What happens if an empty array [] is passed as the second argument to useEffect?", options: ["It runs on every render cycle", "It runs once on mount and cleanup on unmount", "It throws a compilation error", "It runs only when state elements update"] }
  ]
};

export const initialLogs = [
  { id: "l-1", timestamp: "2026-05-28 09:12:04", user: "student_bca", action: "Completed assessment 'React Core Fundamentals' with score 85%" },
  { id: "l-2", timestamp: "2026-05-28 10:01:45", user: "teacher_pro", action: "Published new assessment 'Advanced Financial Accounting'" },
  { id: "l-3", timestamp: "2026-05-28 10:20:11", user: "admin_root", action: "Registered new teacher account for 'Dr. Evelyn Ross'" }
];
// Placeholder to satisfy Antigravity's API imports
export const mockMetrics = { totalStudents: 0, totalExams: 0, activeTests: 0 };

export const initialRetakeRequests = [
  { id: "r-1", username: "student_bca", examId: "exam-react-202", examTitle: "React Core Fundamentals", status: "Pending" }
];