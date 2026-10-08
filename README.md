# CSA4301 — Internet Programming Lab (Slot D)

**Institution:** SIMATS Engineering  
**Department:** Computer Science and Engineering  
**Course Code & Title:** CSA4301 - Internet Programming Lab  

This repository contains the complete laboratory curriculum suite, featuring **46 core experiments (47 distinct, responsive web applications)**, full viva voce documentation manuals, and verified output screenshots.

---

## 📁 Repository Structure

```
CSA4301-SlotD/
├── Lab/
│   ├── Programs/               # All 47 experiment web apps, shared architecture, and test suite
│   │   ├── 01-library-management/
│   │   ├── 02-hotel-booking/
│   │   ├── ...
│   │   ├── 46-phone-bill-payment/
│   │   ├── shared/             # CSS theme design tokens & local database persistence layer
│   │   ├── index.html          # Interactive Master Launch Portal
│   │   ├── server.js           # Zero-dependency Node.js HTTP server
│   │   ├── package.json        # Project scripts (npm start, npm test)
│   │   ├── test_suite.js       # 477 automated tests (100% pass)
│   │   └── README.md           # Master curriculum manual & viva syllabus index
│   │
│   └── outputs/                # High-resolution rendered output screenshots for all 47 programs
│       ├── 00-master-portal.png
│       ├── 01-library-management.png
│       ├── 02-hotel-booking.png
│       ├── ...
│       ├── 46-phone-bill-payment.png
│       └── README.md           # Comprehensive visual gallery and output catalog
│
└── README.md                   # Main repository overview
```

---

## 🚀 Quick Navigation

- 💻 **[Browse All Programs & Source Code](./Lab/Programs/)**: Access every application's `index.html`, `styles.css`, `script.js`, and academic `README.md`.
- 🖼️ **[View Output Screenshots Gallery](./Lab/outputs/)**: Browse the rendered UI previews for all 47 experiments and the Master Portal.
- 🌐 **[Master Launch Portal](./Lab/Programs/index.html)**: The unified dashboard for filtering, launching, and managing all experiments.

---

## 🧪 Testing & Verification

All applications have been verified with 100% passing results across 477 test assertions:
- **Shared Assets:** Verified
- **4-File Architecture:** Verified across all 47 folders
- **JavaScript Syntax (`node -c`):** 0 syntax errors
- **Documentation Completeness:** Aim, Algorithm, and Viva Voce verified
- **HTTP 200 Delivery:** Verified on all endpoints