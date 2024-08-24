# Hire AI

Hire AI is an AI-powered interview platform that facilitates interactive, AI-driven interviews, allowing enterprises to create, manage, and analyze interviews while providing candidates with a personalized dashboard to track their progress. The platform uses modern web technologies to deliver a seamless and interactive experience for both enterprises and candidates.

### Key Features:

1. **Interactive AI-Driven Interview Process:**
   - **Introduction:** The AI interviewer begins the interview with an introduction, setting the stage for the candidate.
   - **Candidate Response:** Candidates can click the "Start response" button to begin recording their answer. They can click "End response" to stop the recording.
   - **AI Follow-Up:** The AI interviewer listens to the candidate's response and provides follow-up questions or comments, ensuring a dynamic and conversational interview experience.
   - **Back-and-Forth Dialogue:** This back-and-forth interaction continues throughout the interview, simulating a real-world interview scenario.
   - **End of Interview:** Once the conversation reaches its natural conclusion, the AI interviewer ends the interview. Alternatively, candidates can click the "End interview" button at any point to conclude the session early.
   - **Bonus Features:** The platform boasts a visually appealing UI, with AI response latency optimized to under 3 seconds. The system supports interrupting the AI interviewer by allowing candidates to start their response before the AI finishes speaking. Robust input sanitization and prompt engineering techniques are implemented to protect against prompt injection attacks.

2. **Enterprise Dashboard:**
   - Enterprises can manage, create, and edit interviews, and view analytics in a responsive and user-friendly interface.

3. **Interview Creation and Management:**
   - Easy-to-use tools for creating and managing interviews, including specifying questions and tracking candidate performance.

4. **Interview Analytics:**
   - Detailed analytics to monitor interview outcomes, including scores and completion status.

5. **User Dashboard:**
   - Candidates can view and take their assigned interviews, with real-time updates on interview status.

6. **Google OAuth Integration:** 
   - Secure Google account sign-in using OAuth 2.0.

7. **Recording and Playback:** 
   - Interviews are recorded using the MediaRecorder API, with recordings available for download.

8. **Responsive Navbar:** 
   - A navigation bar that adapts to scrolling, maintaining a clean and readable interface.

### Technologies Used:
- **Frontend:** React, TypeScript, Tailwind CSS, React Router, Google OAuth
- **Backend:** FastAPI, PostgreSQL 
- **APIs:** GPT-3 for follow-up question generation and TTS
- **Speech Recognition:** Web Speech API
- **Audio Recording:** MediaRecorder API

### Hosting:
- **Backend:** Hosted on **Azure** via Azure Web Apps for scalable, secure, and reliable service delivery.
- **Frontend:** Deployed on **GitHub Pages** for easy access and reliability.

## Potential Enhancements with More Time/Resources:

1. **Comprehensive Testing:** 
   - Add end-to-end, unit, and integration tests to improve reliability.

2. **Scalability Improvements:** 
   - Optimize backend to handle higher traffic and consider serverless functions for auto-scaling.

3. **Enhanced UI/UX:** 
   - Introduce advanced features like drag-and-drop question reordering and dynamic dashboards with charts.

4. **Real-Time Analytics:** 
   - Implement real-time feedback on candidate progress and interview outcomes.

5. **Complete Recording & Transcript Feature:** 
   - Fully implement the recording and transcript feature, as the current implementation only supports downloading interview recordings.

6. **Multi-Language Support:** 
   - Expand the platform to support multiple languages in both UI and interview processes.

7. **Mobile Optimization:** 
   - Ensure full functionality and performance on mobile devices.

8. **Deployment Automation:** 
   - Set up CI/CD pipelines for seamless automated testing and deployment.

9. **User Roles & Permissions:** 
   - Add more granular control over user roles and permissions for managing different parts of the application.

10. **Security Enhancements:** 
    - Implement advanced security features like two-factor authentication (2FA) and end-to-end encryption.

This project provides a solid foundation for an AI-powered interview platform, with room for further development and refinement.
