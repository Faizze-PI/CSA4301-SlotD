# CSA4301 - Internet Programming Lab Suite
**Department of Computer Science and Engineering | SIMATS Engineering**

---

## Overview
This repository contains the complete professional suite of **46 Web Application Experiments** designed for the **Internet Programming Lab (CSA4301)** curriculum.

Each experiment is built with:
- **Clean Architecture:** Semantic HTML5, CSS3 Custom Properties (Design Tokens), and ES6+ Modular JavaScript.
- **Role-Based Access Control (RBAC):** Dedicated views and interfaces for Administrator, Customers, and specialized domain actors (e.g., Doctors, Conductors, Police, Teachers).
- **Persistent Local Database Engine:** Zero configuration required; data persists across page refreshes via an integrated reactive localStorage store (`shared/js/db.js`).
- **Mathematical & Business Precision:** Exact algorithms implemented for tiered utility tariffs (Exp 42), income tax slabs and exemptions (Exp 45), overdue fine calculations (Exp 42, 46), and dynamic ticket generation.

---

## How to Run

### Option 1: Built-in Node.js Server (Recommended)
You have Node.js (`v24.14.0`) installed. Run:
```bash
npm start
```
or
```bash
node server.js
```
Open your browser and navigate to:
```
http://localhost:3000
```
This opens the **Master Lab Portal**, where you can browse, filter, search, and launch any of the 46 experiments with one click.

### Option 2: Direct Browser Execution (Offline / Zero Installation)
Double-click `index.html` directly or open it in Google Chrome, Microsoft Edge, or Firefox. All assets and logic are fully self-contained.

---

## Lab Structure
```text
Lab programs/
├── index.html                   # Master Lab Portal & Interactive Experiment Catalog
├── server.js                    # Zero-dependency local Node.js static server
├── package.json                 # Project configuration and launch scripts
├── README.md                    # Lab record guide, syllabus mapping & viva notes
├── shared/                      # Shared assets & design system
│   ├── css/
│   │   └── theme.css            # Standardized SIMATS lab design system
│   └── js/
│       └── db.js                # Shared client-side reactive relational database
└── [Numbered Experiment Folders 01 to 46]
    ├── index.html               # Main application interface with role switcher
    ├── styles.css               # Experiment-specific modern styling
    ├── script.js                # Application logic, state management & calculations
    └── README.md                # Lab Record Manual (Aim, Algorithm, I/O, Viva Q&A)
```

---

## Taxonomy of Experiments

| Category | Count | Experiment Numbers | Focus Areas |
| :--- | :---: | :--- | :--- |
| **Transport & Booking** | 10 | 02, 03, 04, 05, 07, 11, 15, 20, 24, 27/35 | Schedules, Seat Layouts, PNR States, QR Codes |
| **E-Commerce & Retail** | 8 | 06, 09, 10, 13, 14, 18, 31, 32, 36b, 39 | Catalogs, Carts, Orders, Multi-vendor Marketplaces |
| **Utility & Calculators**| 4 | 12, 42, 45, 46 | Mathematical Formulations, Tiered Slabs, Late Fees |
| **Healthcare & Civic** | 8 | 01, 08, 16, 19, 22, 23, 25, 26 | Grievances, Tele-health, Waste Routing, Blood Stock |
| **Content & Portfolios**| 8 | 28a, 28b, 30, 33, 37, 38, 40, 41, 44 | Portfolios, Editorial Flow, Interactive Maps |
| **EdTech & Assessment** | 4 | 17, 21, 34, 36a, 43 | Timed Tests, Auto-grading, LMS, E-Voting |

---

## Academic Record & Viva Preparation
Each experiment folder includes a standardized academic write-up detailing:
1. **Aim of the Experiment**
2. **System Architecture & Data Flow Diagram**
3. **Algorithm & Pseudo-code**
4. **Input & Expected Output Specifications**
5. **Key Viva Voce Questions & Answers**

---

## Complete Experiments Index (All 47 Applications)

| # | Directory | Experiment Title | Key Modules & Features |
|---|---|---|---|
| 01 | [`01-library-management/`](01-library-management/index.html) | Local Library Management System | Book search, issue/return status, fine calculation, semester materials |
| 02 | [`02-hotel-booking/`](02-hotel-booking/index.html) | Online Hotel Room Booking Portal | 4 room types, 3-day cancellation cutoff policy, admin room CMS |
| 03 | [`03-bus-booking/`](03-bus-booking/index.html) | Online Bus Ticket Booking System | 2D seat matrix with aisles, Volvo/Sleeper categories, PDF ticket |
| 04 | [`04-train-reservation/`](04-train-reservation/index.html) | Indian Train Reservation System | Via-stops, Confirmed / RAC / Waiting List states, cancellation refunds |
| 05 | [`05-flight-reservation/`](05-flight-reservation/index.html) | Airline Flight Reservation System | Domestic routes, cabin class pricing multipliers, boarding pass passbook |
| 06 | [`06-cake-ordering/`](06-cake-ordering/index.html) | Online Cake Ordering & Custom Bakery | Weight scaling (0.5kg-2kg), custom inscription, cart, order tracking |
| 07 | [`07-beauty-parlour/`](07-beauty-parlour/index.html) | Beauty Parlour & Salon Appointment | Stylist calendar, lockout unavailable hours, deposit payment, cancel |
| 08 | [`08-hospital-appointment/`](08-hospital-appointment/index.html) | MedCare Hospital Appointment Portal | Specialty search, pre-visit triage form, doctor slots, branch map |
| 09 | [`09-techsavvy-electronics/`](09-techsavvy-electronics/index.html) | TechSavvy Electronics Store | 13 UML use cases, categorized gadgets, stock check, audit log |
| 10 | [`10-stylehub-fashion/`](10-stylehub-fashion/index.html) | StyleHub Fashion & Apparel Store | Apparel departments, interactive size guide modal, wishlist, 30-day return |
| 11 | [`11-real-estate-homefinder/`](11-real-estate-homefinder/index.html) | Home Finder Real Estate Marketplace | Property search filters, mortgage EMI calculator, viewing scheduler |
| 12 | [`12-insureeasy-insurance/`](12-insureeasy-insurance/index.html) | InsureEasy Policy & Claims Management | Health/Auto/Home comparison, claims filing, 10% agent commission, SMS alerts |
| 13 | [`13-blossomgifts-flowers/`](13-blossomgifts-flowers/index.html) | BlossomGifts Floral & Gift Portal | Gifts by occasion/recipient, scheduled delivery slot selector, inquiries |
| 14 | [`14-renewmarket-marketplace/`](14-renewmarket-marketplace/index.html) | ReNewMarket Second-Hand Marketplace | C2C listing creator, condition grading, offer negotiation protocol |
| 15 | [`15-easytoll-toll-payment/`](15-easytoll-toll-payment/index.html) | EasyToll Highway Electronic Toll System | e-Wallet deduction, advance pass renewal, return trip discount, QR scanner |
| 16 | [`16-complainease-grievance/`](16-complainease-grievance/index.html) | ComplainEase Civic Grievance System | Complaint submission, map coordinate pinning, 4-stage tracking, proof photo |
| 17 | [`17-voteonline-evoting/`](17-voteonline-evoting/index.html) | VoteOnline Civic E-Voting System | Voter roll verification, dual-step OTP auth, ward candidates, VVPAT receipt |
| 18 | [`18-agrimart-agriculture/`](18-agrimart-agriculture/index.html) | AgriMart Agricultural Marketplace | Seeds/fertilizers catalog, 10% farmer subsidy formulation, AgriPay wallet |
| 19 | [`19-veterinary-telehealth/`](19-veterinary-telehealth/index.html) | Tele-Vet Animal Telehealth Platform | Symptom multimedia upload, Govt CVH vs paid clinic, outbreak heatmap |
| 20 | [`20-rentride-vehicle-rental/`](20-rentride-vehicle-rental/index.html) | RentRide Self-Drive Vehicle Rentals | Fleet browser, duration fare + ₹3000 deposit, departure check-in, keycode |
| 21 | [`21-job-recruitment-portal/`](21-job-recruitment-portal/index.html) | Online Job Recruitment & ATS Portal | Candidate skill/location search, ATS pipeline tracking, director review |
| 22 | [`22-solid-waste-management/`](22-solid-waste-management/index.html) | Smart Solid Waste & Municipal Routing | Citizen reporting, ultrasonic bin telemetry gauges, compactor truck routes |
| 23 | [`23-blood-management-system/`](23-blood-management-system/index.html) | LifeFlow Blood Bank Information System | ABO/Rh registry, 90-day cooling period check, 8-group stock matrix, donor card |
| 24 | [`24-wanderlust-travel-agency/`](24-wanderlust-travel-agency/index.html) | Wanderlust Travels Holiday Agency | Holiday package catalog, day-by-day sightseeing itinerary, meal plans, voucher |
| 25 | [`25-road-breakdown-assistance/`](25-road-breakdown-assistance/index.html) | On-Demand Road Breakdown & SOS | Stranded motorist 1-Click SOS, nearby mechanic GPS radar, animated ETA van |
| 26 | [`26-trafficsquad-police-fir/`](26-trafficsquad-police-fir/index.html) | TrafficSquad Police FIR & E-Challan | Police FIR with ANPR proof, MV Act penalty matrix, challan payment, receipt |
| 27 | [`27-bus-pass-system/`](27-bus-pass-system/index.html) | Commuter Bus Pass Management (v1) | Student & route concession (Govt 100%, Pvt 50%), wallet deduction, QR code |
| 28a | [`28a-artist-portfolio-artistryhub/`](28a-artist-portfolio-artistryhub/index.html) | Emily Harris Fine Art Portfolio | Fine art oil/abstract gallery, ambient audio soundscape, bibliography, print cart |
| 28b | [`28b-event-landing-page/`](28b-event-landing-page/index.html) | NexusTech 2026 AI Summit Landing Page | Speaker cards, 2-day schedule timetable, venue navigation, delegate badge |
| 30 | [`30-ijsse-scopus-journal/`](30-ijsse-scopus-journal/index.html) | IJSSE Scopus Journal Publishing System | ISSN 2395-1443, manuscript submission, double-blind peer review, DOI minting |
| 31 | [`31-komatha-dairy-farm/`](31-komatha-dairy-farm/index.html) | Ko-Matha Smart Dairy Farm Management | Indian A1 cow milk & sweets, Fat% & SNF rate formula, vendor intake ledger |
| 32 | [`32-ram-infotech-laptop-service/`](32-ram-infotech-laptop-service/index.html) | Ram Infotech Laptop Sales & Service | Laptop catalog, 4-stage chip repair tracking, corporate rental lease contract |
| 33 | [`33-kodaikanaleats-dining-rooms/`](33-kodaikanaleats-dining-rooms/index.html) | KodaikanalEats Dining & Mountain Suites | Table reservations, suite booking (Single/Double/Deluxe), surge pricing +40% |
| 34 | [`34-learnwell-tuition-centre/`](34-learnwell-tuition-centre/index.html) | LearnWell Tuition Centre Portal | Course catalog, online enrollment, student marksheets & grades, tax invoice |
| 35 | [`35-smart-bus-pass-v2/`](35-smart-bus-pass-v2/index.html) | Smart Metropolitan Bus Pass (v2) | e-Wallet tap-and-pay, IoT waypoint stop broadcasting, stop countdown ETA, QR |
| 36a | [`36a-educonnect-online-lms/`](36a-educonnect-online-lms/index.html) | EduConnect Online Teaching Platform | Course catalog, live video classroom simulator, auto-graded quiz, timetable |
| 36b | [`36b-bookhaven-online-bookstore/`](36b-bookhaven-online-bookstore/index.html) | BookHaven Curated Online Bookstore | Bestsellers carousel, faceted catalog filters, reactive cart, coupon SAVE10 |
| 37 | [`37-professional-portfolio/`](37-professional-portfolio/index.html) | MyProfessionalShowcase Portfolio | Career timeline, project live sandbox modals, skill meters, printable resume |
| 38 | [`38-gourmet-haven-restaurant/`](38-gourmet-haven-restaurant/index.html) | Gourmet Haven Fine Dining Experience | Rotating ambiance carousel, course-wise à la carte menu, table reservation QR |
| 39 | [`39-general-ecommerce-store/`](39-general-ecommerce-store/index.html) | OmniStore Universal Online Store | Faceted catalog, quantity adjustments, coupon discounts, order tracking stepper |
| 40 | [`40-travel-blog-interactive-map/`](40-travel-blog-interactive-map/index.html) | Wanderlust Chronicles Travel Blog | Geotagged clickable world atlas radar, packing checklist, budget estimator |
| 41 | [`41-digital-recipe-book/`](41-digital-recipe-book/index.html) | GourmetPlate Digital Recipe Book | Dynamic serving size ingredient scaler, cooking timer, weekly meal planner |
| 42 | [`42-electricity-bill-payment/`](42-electricity-bill-payment/index.html) | Electricity Bill Payment Engine | Domestic vs Commercial tiered tariff engine + ₹10/day overdue fine calculator |
| 43 | [`43-online-placement-exam/`](43-online-placement-exam/index.html) | PlacementPro CBT Placement Examination | Timed exam console, question palette, auto-grading, merit rank list, scorecard |
| 44 | [`44-painting-rating-review/`](44-painting-rating-review/index.html) | ArtSentiment Painting Rating & Review | Admin painting upload, 1-5 star ratings, NLP sentiment breakdown, curator desk |
| 45 | [`45-income-tax-calculator/`](45-income-tax-calculator/index.html) | Indian Income Tax Calculation Engine | Net taxable income formula, 80C/80D deductions, ₹500k zero tax rebate, slabs |
| 46 | [`46-phone-bill-payment/`](46-phone-bill-payment/index.html) | Online Phone Bill Payment Portal | Monthly billing cycle, ₹10/day fine, partial/full payment, printable tax receipt |

