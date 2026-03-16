# 🎓 NEU MOA Monitoring Portal

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

A centralized, role-based web application designed for **New Era University (NEU)** to manage, track, and explore Host Training Establishments (HTE) and their Memorandum of Agreement (MOA) statuses.

🌐 **Live Demo:** [https://neu-moa-monitory-app.vercel.app/](https://neu-moa-monitory-app.vercel.app/)

---

## ✨ Key Features

- **Institutional Single Sign-On (SSO):** Secure Google Authentication that strictly permits only valid `@neu.edu.ph` email addresses. Uses a redirect flow to bypass strict mobile and tracking browser blockers.
- **Role-Based Access Control (RBAC):** Dynamic interfaces and permissions based on user roles (Admin, Faculty, Student).
- **Real-Time Dashboard:** Live-updating statistics cards tracking Active, Processing, and Expired/Expiring MOAs.
- **Full CRUD & Soft Deletes:** Admins can safely add, edit, and archive MOA records without permanently deleting critical university data.
- **Automated Audit Trails:** Every modification to an MOA automatically logs the user's email, the action performed, and a timestamp for strict accountability.
- **Smart Global Search Engine:** Instantly filter database records by Company Name, HTE ID, Contact Person, Industry, or processing status.

---

## 👥 User Roles & Permissions

1.  **🛡️ Admin:** Full access to the system. Can create, read, update, and soft-delete MOAs. Has exclusive access to view the Audit Trails of every record.
2.  **👨‍🏫 Faculty:** Can monitor the database, view processing statuses, and search for active partners endorsed by their college. Cannot modify or delete records.
3.  **🎓 Student:** Restricted access. Can only search and view highly simplified data (Company, Contact, Industry) of fully Approved HTEs for OJT application purposes.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Backend & Database:** Firebase (Firestore)
- **Authentication:** Firebase Auth (Google Provider)
- **Deployment:** Vercel

---

## 🚀 Getting Started (Local Development)

To run this project locally on your machine, follow these steps:

### 1. Clone the repository

```bash
git clone [https://github.com/your-username/neu-moa-monitoring.git](https://github.com/your-username/neu-moa-monitoring.git)
cd neu-moa-monitoring
```
