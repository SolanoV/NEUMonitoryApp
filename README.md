# 🎓 NEU MOA Monitoring Portal

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

A centralized web application designed for **New Era University (NEU)** to manage, track, and explore Host Training Establishments (HTE) and their Memorandum of Agreement (MOA) statuses.

🌐 **Live Demo:** [https://neu-moa-monitory-app.vercel.app/](https://neu-moa-monitory-app.vercel.app/)

---

## ✨ Key Features

1. **Role-Based Access & SSO:** Secure `@neu.edu.ph` Google Authentication with dynamic dashboards and restricted permissions for Admins, Faculty, and Students.
2. **Real-Time Analytics & Search:** Live-updating statistics cards and a powerful filter sidebar to instantly sort MOAs by college, industry, status, and date.
3. **Secure Data Management:** Full MOA management (CRUD) equipped with non-destructive soft deletes and automated audit trails for strict university accountability.

---

## 👥 User Roles & Permissions

- **🛡️ Admin:** Full access to add, edit, soft-delete, and view audit histories.
- **👨‍🏫 Faculty:** View-only access to monitor active partners and processing statuses.
- **🎓 Student:** Restricted access to search for approved HTEs for OJT applications.

---

## 📖 User Manual

_Note: All users must log in using their official `@neu.edu.ph` Google account._

### 🛡️ Admin

- **Add MOA:** Click the **"+ Add New MOA"** button, fill in the HTE details, and click Save.
- **Manage Records:** Click the **(⋮) menu** on any row to **Edit** or **Delete** (archive) the data.
- **Track Changes:** Click **"View History"** on a record to see the timestamped audit trail of who modified it.

### 👨‍🏫 Faculty

- **Monitor Statuses:** Use the right sidebar to filter the table by your specific College or MOA Status.
- **View Analytics:** Check the top Stat Cards to see real-time counts of Active, Processing, and Expiring partners.

### 🎓 Student

- **Find HTEs:** Use the search bar and industry filters to browse university-approved companies.
- **Get Contact Info:** Securely view company addresses and HR emails to begin your OJT application.

---

## 🚀 Quick Start Instructions

Follow these simple steps to run the portal locally on your machine:

```bash
# 1. Clone the repository and open the folder
git clone [https://github.com/your-username/neu-moa-monitoring.git](https://github.com/your-username/neu-moa-monitoring.git)
cd neu-moa-monitoring
```

# 2. Install all required dependencies

```bash
npm install
```

# 3. Create a `.env.local` file in the root folder and add your Supabase keys:

```
# NEXT_PUBLIC_SUPABASE_URL=your_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

# 4. Start the local development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app!
