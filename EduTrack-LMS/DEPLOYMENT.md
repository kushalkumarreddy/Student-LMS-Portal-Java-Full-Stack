# EduTrack LMS - Production Deployment Guide (Render + Vercel + PostgreSQL)

This guide provides step-by-step instructions to deploy the **EduTrack LMS** project to production using:
- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render Web Service](https://render.com/) (Docker runtime)
- **Database:** [Render Managed PostgreSQL](https://render.com/)

---

## 1. Project Directory Structure

In the GitHub repository (`https://github.com/kushalkumarreddy/Student-LMS-Portal-Java-Full-Stack`):

| Component | Relative Directory in Repository | Local Filesystem Path |
| :--- | :--- | :--- |
| **Project Root** | `EduTrack-LMS/` (or repository root if pushed flat) | `E:\Codegnan\Frontend\LMS\EduTrack-LMS` |
| **Frontend Root** | `EduTrack-LMS/frontend` | `E:\Codegnan\Frontend\LMS\EduTrack-LMS\frontend` |
| **Backend Root** | `EduTrack-LMS/backend/EduTrackBackend` | `E:\Codegnan\Frontend\LMS\EduTrack-LMS\backend\EduTrackBackend` |
| **Dockerfile** | `EduTrack-LMS/backend/EduTrackBackend/Dockerfile` | `E:\Codegnan\Frontend\LMS\EduTrack-LMS\backend\EduTrackBackend\Dockerfile` |

> [!NOTE]
> If your Git repository root is `E:\Codegnan\Frontend\LMS\`, your root directories in Render and Vercel will be prefixed with `EduTrack-LMS/`. If `EduTrack-LMS` itself is the root of your Git repository, omit the `EduTrack-LMS/` prefix.

---

## 2. Recommended Deployment Order

Follow this exact sequence to avoid circular dependencies:

```mermaid
flowchart TD
    Step1["1. Create Render PostgreSQL Database"] --> Step2["2. Deploy Backend on Render (Web Service)"]
    Step2 --> Step3["3. Deploy Frontend on Vercel"]
    Step3 --> Step4["4. Update Backend CORS Origin on Render"]
    Step4 --> Step5["5. Smoke Test & Verify"]
```

---

## 3. Step 1: Provision Render PostgreSQL Database

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **PostgreSQL**.
3. Configure the database details:
   - **Name:** `edutrack-lms-db`
   - **Database:** `edutrack_prod`
   - **User:** `edutrack_user` (or leave default)
   - **Region:** Choose the region closest to your users (e.g., `Frankfurt`, `Singapore`, or `Ohio`). Note: Backend and Database must be in the same region!
   - **Plan:** `Free`
4. Click **Create Database**.
5. Once provisioned, locate the **Connections** section:
   - Copy the **Internal Database URL** (if backend is in same Render region) or **External Database URL** (format: `postgres://user:password@host:port/database`).
   - Also note the individual fields: **Host**, **Port**, **Database**, **Username**, and **Password**.

> [!IMPORTANT]
> Render provides database URLs in `postgres://...` format. For Java Spring Boot / JDBC, the driver format must be `jdbc:postgresql://<host>:<port>/<dbname>` or set using `spring.datasource.url`. Render provides a **JDBC Connection String** directly under Connection Details!

---

## 4. Step 2: Deploy Backend Web Service on Render

1. On the Render Dashboard, click **New +** > **Web Service**.
2. Connect your GitHub repository: `kushalkumarreddy/Student-LMS-Portal-Java-Full-Stack`.
3. Configure settings:
   - **Name:** `edutrack-backend`
   - **Region:** Same region as your PostgreSQL database.
   - **Branch:** `main`
   - **Root Directory:** `EduTrack-LMS/backend/EduTrackBackend` (or `backend/EduTrackBackend` if repository root is EduTrack-LMS)
   - **Runtime:** `Docker`
   - **Instance Type:** `Free`
4. Scroll down to **Environment Variables** and add the following:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | `prod` | Activates PostgreSQL configuration |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<host>:<port>/<dbname>` | Render PostgreSQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `edutrack_user` | PostgreSQL Username |
| `SPRING_DATASOURCE_PASSWORD` | `<your-db-password>` | PostgreSQL Password |
| `SPRING_DATASOURCE_DRIVER_CLASS_NAME` | `org.postgresql.Driver` | PostgreSQL JDBC Driver |
| `SPRING_JPA_DATABASE_PLATFORM` | `org.hibernate.dialect.PostgreSQLDialect` | Hibernate Dialect |
| `APP_CORS_ALLOWED_ORIGINS` | `http://localhost:5173,https://your-frontend.vercel.app` | Allowed frontend origins (can start with `http://localhost:5173` and update after Vercel deployment) |
| `ADMIN_EMAIL` | `admin@edutrack.com` | Production Admin Email |
| `ADMIN_PASSWORD` | `YourSecureAdminPassword123!` | Strong Admin Password (BCrypt-hashed on startup) |

> [!TIP]
> The backend Dockerfile automatically listens on `${PORT}` assigned dynamically by Render. You do not need to manually override `PORT`.

5. Click **Create Web Service**.
6. Render will build the multi-stage Docker image and start the Spring Boot service.
7. Once deployment finishes, copy your Render Web Service URL (e.g., `https://edutrack-backend.onrender.com`).
8. Verify health endpoint in your browser:
   `https://edutrack-backend.onrender.com/api/health`
   Expected response:
   ```json
   {
     "status": "UP",
     "service": "EduTrack LMS Backend",
     "timestamp": "2026-..."
   }
   ```

---

## 5. Step 3: Deploy Frontend on Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository: `Student-LMS-Portal-Java-Full-Stack`.
4. In the **Configure Project** screen:
   - **Project Name:** `edutrack-lms`
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and select `EduTrack-LMS/frontend` (or `frontend` if repository root is EduTrack-LMS).
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
   - **Install Command:** `npm install` (default)
5. Expand **Environment Variables** and add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://edutrack-backend.onrender.com` | Paste your actual Render backend URL without trailing slash |

6. Click **Deploy**.
7. Vercel will install dependencies, run `npm run build`, and deploy the static SPA.
8. Once complete, copy your production frontend URL (e.g., `https://edutrack-lms.vercel.app`).

---

## 6. Step 4: Finalize Backend CORS Origin

1. Return to the **Render Dashboard**.
2. Open your `edutrack-backend` Web Service.
3. Go to **Environment**.
4. Update the `APP_CORS_ALLOWED_ORIGINS` variable to include your real Vercel domain:
   ```text
   http://localhost:5173,https://edutrack-lms.vercel.app
   ```
5. Click **Save Changes**. Render will automatically trigger a rolling redeploy with the updated CORS configuration.

---

## 7. Verification & Testing Checklist

Once both services are running, test all core flows:

1. **Public Health Check:**
   - Visit `https://edutrack-backend.onrender.com/api/health` -> verify HTTP 200 and `"status": "UP"`.
2. **SPA Routing on Vercel:**
   - Visit `https://edutrack-lms.vercel.app/login` directly in browser -> verify it does not return 404 (handled by `vercel.json`).
3. **Student Registration:**
   - Go to Register page.
   - Register a new student: `student1@example.com` / `Password123!`.
   - Verify successful redirect or login prompt.
4. **Admin Login:**
   - Log in using configured `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
   - Verify navigation to Admin Dashboard (`/admin/dashboard`).
   - Create a new course (e.g., "Full Stack Java & React Development").
   - Add lessons to the course.
   - View enrolled/registered students list.
5. **Student Course Enrollment & Lessons:**
   - Log out as admin.
   - Log in as the student (`student1@example.com`).
   - Browse courses in Student Dashboard (`/student/dashboard`).
   - Enroll in the course created above.
   - Open course lessons and verify lesson content displays properly.
   - Attempt duplicate enrollment -> verify duplicate prevention logic.
6. **Authentication Persistence:**
   - Refresh the page while logged in -> verify auth session remains active.
7. **Logout:**
   - Click Logout -> verify token clearing and redirection to login page.

---

## 8. Continuous Deployment & Redeployment

- **Automatic Git Deploys:** Both Render and Vercel listen to the `main` branch. Pushing commits to GitHub will automatically trigger:
  - Docker rebuild and deploy on Render.
  - Vite static build and deploy on Vercel.
- **Manual Redeploy:**
  - Render: In Web Service dashboard, click **Manual Deploy** > **Deploy latest commit** or **Clear build cache & deploy**.
  - Vercel: In Deployments tab, click `...` on latest deployment > **Redeploy**.

---

## 9. Render Free Tier Limitations & Operational Notes

- **Instance Spin-Down (Cold Start):**
  - Render free web services spin down after 15 minutes of inactivity.
  - The first request after sleep may take 50–90 seconds while the container boots and JVM starts up.
  - Once warmed up, requests respond normally.
- **Database Expiration:**
  - Render Free PostgreSQL databases expire after 30 days. For permanent production use, upgrade to the Starter plan ($7/mo) or export/backup data.
- **Out of Memory (OOM):**
  - Render free tier includes 512 MB RAM. The multi-stage Docker build uses Temurin Alpine JRE 21 with `-XX:MaxRAMPercentage=75.0` to ensure the Spring Boot JVM operates safely within memory bounds.

---

## 10. Troubleshooting Common Issues

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **CORS Error** in browser console (`Access-Control-Allow-Origin`) | `APP_CORS_ALLOWED_ORIGINS` on Render does not include exact Vercel URL (e.g. trailing slash or protocol mismatch) | In Render Environment, ensure `APP_CORS_ALLOWED_ORIGINS` has `https://edutrack-lms.vercel.app` (no trailing slash). Save and redeploy. |
| **Backend 500 / Database Connection Refused** | PostgreSQL credentials or JDBC URL incorrect | Check Render logs. Ensure `SPRING_DATASOURCE_URL` begins with `jdbc:postgresql://` and username/password are correct. |
| **404 Not Found on Page Refresh on Vercel** | SPA fallback missing | Verify `frontend/vercel.json` exists in repository containing the rewrite rule `{"source": "/(.*)", "destination": "/index.html"}`. |
| **Admin Login Fails** | Wrong password or environment variables not loaded | Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Render Web Service. If database already initialized admin on first boot, existing hash in DB is used. |
| **Backend Takes 1+ Minute to Respond** | Free tier container cold start | Wait 60 seconds for Render container to wake up. Check `/api/health` to confirm when active. |
