# Faruk Sayyad - Professional Data Analyst Portfolio Website

A modern, responsive, dark-themed personal portfolio website built with **HTML5**, **CSS3**, and **Vanilla JavaScript** (featuring an interactive **Chart.js** Data Analytics Engine).

---

## 📌 Project Overview

This portfolio showcases the technical skills, academic foundation, and project work of **Faruk Sayyad**, a third-year B.Tech Information Technology student at **D. Y. Patil College of Engineering, Akurdi, Pune** (CGPA: **9.28**), targeting **Data Analyst Intern** and **Junior Data Analyst** opportunities.

### Highlights & Key Features
- **Polished Dark / Light Theme Toggle:** Clean sun/moon button in the navigation header with persistent preference via `localStorage` and real-time palette adaptation across Chart.js graphs, card surfaces, and background canvases.
- **Project Category Filters:** Instant client-side filtering tabs for **All Projects (5)**, **Hackathon (1)**, **Data Analytics (1)**, **Web Development (2)**, and **Programming (Java/C++) (1)**.
- **Evidra – The Placement Hub (Hackathon Project):** A dedicated, high-impact hackathon project card featuring 3 separate action buttons (Certificate, Live Demo / Model, Source Code), and a full 7-section Case Study overlay. All URLs are centrally managed via `EVIDRA_CONFIG`.
- **Professional Project Case Study Modals:** Comprehensive structured overlays for every project detailing the **Problem Statement**, **Solution & Architecture**, **Tools & Technologies**, **Key Implemented Features**, and **Verified Outcomes**.
- **Recruiter Credentials Snapshot:** Instant one-click recruiter modal in the hero section displaying academic milestones (9.28 CGPA at D. Y. Patil COE), core technical competencies, and direct PDF download links.
- **Cinematic Dark & Crisp Light Themes:** Deep charcoal/navy executive theme (`#080c14`, `#0d1322`) and clean, high-contrast light theme (`#f8fafc`, `#ffffff`).
- **Interactive Data Constellation Canvas:** Hardware-accelerated background particle network responding subtly to pointer movement and pausing when idle or in background tabs.
- **Studio Custom Cursor:** Desktop dual-element tracking cursor (dot + elastic ring) with contextual hover states.
- **Top Scroll Progress Indicator:** Glowing multi-stop cyan-violet progress bar providing real-time reading progress.
- **Interactive 3D Card Tilt & Sheen:** Real-time pointer-tracking 3D tilt and radial light reflection on project cards and profile elements.
- **CGPA Count-Up Animation:** Smooth counter animation revealing the verified 9.28 CGPA in the hero and education sections.
- **IntersectionObserver Reveal System:** Staggered scroll storytelling across cards, headings, and skill chips.
- **Interactive Data Analytics Dashboard:** Demonstrates real-time data aggregation, dynamic KPI calculations, category filtering, and 3 interactive charts (Bar, Doughnut, Trend Line).
- **Client-Side CSV Importer:** Visitors and recruiters can drag and drop any CSV file to see instant client-side data parsing, statistical KPI calculations, and chart visualizations.
- **Accurate Academic Representation:** Highlights Faruk's **9.28 CGPA** and coursework transparently with zero fabricated claims.
- **Full Responsiveness & Accessibility:** Optimized for mobile phones, tablets, laptops, and ultra-wide screens with full `prefers-reduced-motion` compliance.

---

## 📂 Project Structure

```text
portfo1/
├── index.html               # Main portfolio semantic HTML5 page
├── css/
│   └── style.css            # Responsive styles, design tokens & dark-theme glassmorphism
├── js/
│   ├── dashboard.js         # Interactive analytics engine, KPI calculations & Chart.js logic
│   └── script.js            # Sticky navigation, modals, contact form validation & toasts
├── assets/
│   ├── README_ASSETS.txt    # Step-by-step instructions for photo & resume
│   ├── sample-data.csv      # Sample retail demonstration dataset for analytics testing
│   ├── profile-photo.jpg    # (Place your photo here)
│   └── Faruk_Sayyad_Resume.pdf # (Place your resume PDF here)
└── README.md                # Project documentation & GitHub Pages deployment guide
```

---

## 🚀 How to Run Locally

### Option 1: Using VS Code "Live Server" (Recommended)
1. Open **VS Code**.
2. Go to **File** > **Open Folder...** and select `c:\Users\Faruk Sayyad\OneDrive\Desktop\portfo1`.
3. In the VS Code Extensions tab (`Ctrl+Shift+X`), install **Live Server** (by Ritwick Dey).
4. Right-click on `index.html` and choose **"Open with Live Server"**.
5. Your browser will automatically open `http://127.0.0.1:5500/index.html`.

### Option 2: Using Python (Built-in Web Server)
1. Open PowerShell or Command Prompt in this folder:
   ```powershell
   cd "c:\Users\Faruk Sayyad\OneDrive\Desktop\portfo1"
   python -m http.server 8000
   ```
2. Open your web browser and navigate to:
   ```text
   http://localhost:8000
   ```

### Option 3: Using Node.js (`npx serve`)
```powershell
npx serve .
```

---

## 📷 How to Add Your Profile Photo

1. Prepare your photo in square format (e.g. 500x500 pixels, JPG or PNG).
2. Save the image file as:
   ```text
   assets/profile-photo.jpg
   ```
3. If your image uses a `.png` or `.webp` extension, open `index.html` and find line ~160:
   ```html
   <img src="assets/profile-photo.jpg" alt="Faruk Sayyad profile" ...>
   ```
   Change `profile-photo.jpg` to `profile-photo.png`.
4. **Note:** Until you add your picture, the site automatically displays an initials avatar badge (`FS`) so nothing looks missing.

---

## 📄 Resume & Profile Photo
- **Resume:** Your official resume is active and saved as `assets/Faruk_Sayyad_Resume.pdf`. All download buttons across the navigation bar, hero section, and career CTA automatically deliver this file directly with instant toast feedback.
- **Profile Photo:** Your photo is active as `assets/profile-photo.jpg` displayed in an executive framed container with grounded profile badges (Location, 9.28 CGPA, Internship Availability).

---

## 🛠️ Project Repository Links & Evidra Configuration
- **Evidra – The Placement Hub:** Centrally configured via `EVIDRA_CONFIG` in `js/script.js`:
  ```javascript
  const EVIDRA_CONFIG = {
    certificateUrl: '', // Paste your Certificate file or link here (e.g. 'assets/Evidra_Certificate.pdf')
    liveDemoUrl: '',    // Paste your Live Demo or deployed web app link here
    modelUrl: '',       // Optional secondary model URL
    githubUrl: ''       // Paste your GitHub repository link here
  };
  ```
  *When any URL is left empty (`""`), clicking the button displays a professional toast notice informing recruiters that the resource is coming soon.*
- **Retail Sales & Performance Analytics Engine:** Integrated with the live Chart.js engine and CSV ingestion tool in `#analytics`.
- **SmartExpense Manager:** Linked directly to your GitHub profile (@Faruk4040) with an interactive Project Case Study modal detailing architecture and features.
- **Myntra Clone:** Verified and linked directly to your active repository:
  ```html
  https://github.com/Faruk4040/Myntra-Clone
  ```

---

## 🌐 How to Publish to GitHub Pages (Free Hosting)

Follow these steps when you are ready to publish your portfolio online:

### Step 1: Create a New GitHub Repository
1. Log in to [GitHub](https://github.com).
2. Click **New Repository** (`+` icon at the top right).
3. Name your repository (e.g., `portfolio` or `faruk-sayyad-portfolio`).
4. Set visibility to **Public**.
5. Do **not** check "Initialize with a README" (we already have one).
6. Click **Create repository**.

### Step 2: Push Your Local Files to GitHub
Open PowerShell in your project folder (`c:\Users\Faruk Sayyad\OneDrive\Desktop\portfo1`) and run:
```powershell
git init
git add .
git commit -m "Initial release of Faruk Sayyad Data Analyst Portfolio"
git branch -M main
git remote add origin https://github.com/Faruk4040/YOUR-REPO-NAME.git
git push -u origin main
```
*(Replace `YOUR-REPO-NAME` with the name you chose in Step 1)*

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** (tab with the gear icon).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment** > **Branch**:
   - Select `main` branch.
   - Select `/ (root)` folder.
   - Click **Save**.
5. Wait 1–2 minutes. GitHub will provide your live URL:
   ```text
   https://faruk4040.github.io/YOUR-REPO-NAME/
   ```

---

## 🔄 How to Update Your Portfolio After Deployment

Whenever you want to update your resume, add a new project, or modify skills:
1. Make the changes in your local files.
2. In PowerShell, run:
   ```powershell
   git add .
   git commit -m "Update resume and new project details"
   git push
   ```
3. GitHub Pages will automatically rebuild and deploy your changes within 60 seconds!

---

## 📞 Contact Information

- **Email:** [faruksayyad451@gmail.com](mailto:faruksayyad451@gmail.com)
- **LinkedIn:** [linkedin.com/in/faruk-sayyad-504793333](https://www.linkedin.com/in/faruk-sayyad-504793333)
- **GitHub:** [github.com/Faruk4040](https://github.com/Faruk4040)
- **Institution:** D. Y. Patil College of Engineering, Akurdi, Pune, Maharashtra, India
