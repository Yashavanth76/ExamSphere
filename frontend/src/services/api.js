import axios from 'axios';

// Instantiate our global configuration instance mapping directly to Spring Boot port 8080
const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // 🟢 Exams Operations
  getExams: async () => {
    // Hits: GET http://localhost:8080/api/exams/all
    const response = await API.get('/exams/all');
    return response.data;
  },

  getExamById: async (id) => {
    // Hits: GET http://localhost:8080/api/exams/{id}
    const response = await API.get(`/exams/${id}`);
    return response.data;
  },

  createExam: async (examData) => {
    // examData structure sent by your dashboard forms will map directly 
    // to your Spring Boot ExamEntity fields
    const response = await API.post('/exams/create', examData);
    return response.data;
  },

  deleteExam: async (examId) => {
    // Hits: DELETE http://localhost:8080/api/exams/delete/{examId}
    const response = await API.delete(`/exams/delete/${examId}`);
    return response.data; // Expecting { success: true }
  },

  // 🟢 Questions Retrieval
  getExamQuestions: async (examId) => {
    // Hits: GET http://localhost:8080/api/exams/{examId}/questions
    const response = await API.get(`/exams/${examId}/questions`);
    return response.data;
  },

  // 🟢 User Performance Metrics
  getMetrics: async () => {
    // Fetch global performance indexes or student history records 
    const response = await API.get('/metrics/all');
    return response.data;
  },

  submitResult: async (resultData) => {
    // Saves an active test session record cleanly into your exam_attempts table
    // Hits: POST http://localhost:8080/api/metrics/submit
    const response = await API.post('/metrics/submit', resultData);
    return response.data;
  }
};

export default API;