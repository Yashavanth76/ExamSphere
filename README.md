# ExamSphere

ExamSphere is an enterprise-grade, distributed multi-tenant web platform designed to automate, optimize, and secure academic evaluation loops within institutional ecosystems. The application isolates user domains into strict role-based access patterns for Administrators (Principals), Faculty (Teachers), and Candidates (Students), delivering real-time status auditing pipelines alongside sub-second API request processing.

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18 (Functional Components, Hooks Architecture), JavaScript, React Router DOM v6, Lucide React, CSS Modules
- **Backend:** Java, Spring Boot, Spring Security (BCrypt Hashing), Spring Data JPA, Hibernate ORM
- **Database:** MySQL 8.0, HikariCP Connection Pooling Layer
- **Build Tools & Environment:** Maven, Node.js, IntelliJ IDEA, VS Code

---

## ✨ Core Features & Business Logic

### 🏛️ Administrative Domain (Principal Portal)
- **Admission Verification Queue:** Self-registered students are held in a `PENDING` state until the Principal explicitly updates the row parameters to `APPROVED` or `REJECTED`.
- **Faculty Provisioning Office:** Generates secure faculty credentials and persists account profiles directly into MySQL database tables.
- **Global Activity Audit Log:** Captures non-repudiable real-time system actions (e.g., clearance overrides, profile updates, account purges) inside a scrollable feed panel.

### 🎓 Faculty Domain (Teacher Workspace)
- **Assessment Matrix Deployment:** Allows teachers to publish customized examination nodes detailing titles, descriptive guidelines, duration limits, and target stream tags (e.g., BCA, BSc, Engineering).
- **Continuous Grade Scroller:** Automatically updates and tracks candidate performance statistics across live evaluations.
- **Dynamic Metadata Customization:** Instructors can instantly update academic credentials, ranks, and core department focuses.

### 📝 Candidate Domain (Student Portal)
- **Target Stream Matrix:** Displays an interactive grid filtering active test models strictly allocated to the candidate's registered academic branch parameters.
- **Asynchronous Testing Interface:** Features an isolated assessment viewport backed by a persistent local storage cache synchronization loop to completely eliminate mid-session data loss or layout shifts.

---

## 💻 Technical Implementation Highlights

- **State Sync Lifecycle Resiliency:** Architected an immutable state broadcast sequence using React Context paired with `localStorage` write cache caching, preventing account data field resets on window reloads.
- **Type Coercion Safeguards:** Fixed runtime layout rendering engine crashes by implementing strict type coercion lookups inside relational data arrays, aligning Java numeric index entities with frontend string object keys seamlessly.
- **Clean N-Tier Decoupled Pattern:** Implemented strict separation of concerns across a presentation layer, controller data-mapping gateways, business transactional services, and JPA repositories.
- **Unified API Response Schema:** Configured strongly-typed backend response contracts (`ResponseEntity<Map<String, Object>>`) to systematically map raw MySQL table column mutations to frontend context handlers.

---

## 🚀 Getting Started

### Prerequisites
- OpenJDK 17 or higher (Java 24 recommended)
- Node.js LTS (v18+)
- MySQL Server 8.0+

### Database Setup
1. Open your MySQL terminal client or workbench and instantiate the target schema container:
```sql
   CREATE DATABASE exam_sphere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;