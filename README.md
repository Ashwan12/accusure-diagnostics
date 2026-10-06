# ACCUSURE DIAGNOSTICS
## Smart Healthcare & Diagnostic Management System

A full-stack responsive web application designed for **ACCUSURE DIAGNOSTICS** diagnostic and medical pathology center located in Jamshedpur. Fully built and verified for Desktop / Laptop, Tablets, and Smartphones.

---

## 🏥 Business Details
* **Business Name**: ACCUSURE DIAGNOSTICS
* **Address**: Shop No. 7, MIJO HOUSE, Sunday Market, Birsanagar, Jamshedpur, Jharkhand 831019
* **Contact Helpline**: `7205573352`
* **Email**: `ashwanarya20042004@gmail.com`
* **Core Services**: All Blood Test Checkups at Affordable Rates
* **Special Service**: 100% Free Doorstep Home Sample Collection across Jamshedpur

---

## 🚀 Technology Stack
* **Frontend**:
  * React.js (Vite)
  * Tailwind CSS (v4)
  * Lucide Icons
  * React Router v7
  * Axios with JWT interceptors
  * Responsive layout for Mobile, Tablet, and Desktop screens
  * Printable Lab Reports & Invoices with CSS Print media rules
* **Backend**:
  * Python 3.12 & Django 6.1
  * Django REST Framework (DRF)
  * SimpleJWT Authentication
  * Django CORS Headers
  * SQLite / Relational Database Design
* **Security**:
  * Role-Based Access Control (Admin, Doctor, Staff, Patient)
  * QR Code Verification for diagnostic lab reports

---

## ⚡ Quick Start / Run Instructions

### Option 1: One-Click Windows Launcher
Double-click `start_servers.bat` inside `d:\Medical`. It will automatically launch both the Django backend and Vite frontend servers.

### Option 2: Manual Terminal Commands
1. **Backend**:
   ```powershell
   cd d:\Medical\backend
   python manage.py runserver 0.0.0.0:8000
   ```
2. **Frontend**:
   ```powershell
   cd d:\Medical\frontend
   npm.cmd run dev -- --host
   ```

3. Open in your browser:
   * **Laptop / Desktop**: [http://localhost:5173/](http://localhost:5173/)
   * **Mobile Phone**: Open [http://10.227.118.149:5173/](http://10.227.118.149:5173/) (or your Wi-Fi IPv4 address) on your phone browser.

---

## 🔑 Ready-to-Use Demo Accounts

| Role | Username | Password | Full Name / Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Ashwani Arya (Full operations, revenue, analytics, reports & tests) |
| **Doctor** | `dr_mukherjee` | `doctor123` | Dr. R. K. Mukherjee (MD Pathologist - Review reports, clinical prescriptions) |
| **Staff / Phlebotomist**| `staff_rahul` | `staff123` | Rahul Verma (Home collections dispatch queue, update sample drawn status) |
| **Patient 1** | `patient_priya` | `patient123` | Priya Sharma (View appointments, download verified lab report, view invoices) |
| **Patient 2** | `patient_amit` | `patient123` | Amit Kumar (Live test tracking, sample testing in lab) |

*(Quick 1-Click Login buttons are also available on the Login page!)*

---

## 📱 Mobile & Responsive Experience
* **Sticky Bottom Quick Actions**: Quick Call `7205573352`, direct WhatsApp button, and Book Test wizard designed specifically for smartphone screens.
* **Responsive Workflow Stepper**: Shows live 6-step progress (`Pending` ➔ `Confirmed` ➔ `Sample Collected` ➔ `Testing` ➔ `Report Ready` ➔ `Completed`).
* **Mobile Drawer Navigation**: Slide-out menu for quick access to test catalog, free home collection form, and portal logins.
* **Printable Medical Reports**: Mobile and desktop friendly official letterhead reports with QR code scan verification.

---

## 📦 Features Implemented
1. **Public Website**:
   * Hero section with instant test search and value highlights.
   * Express 3-step Free Home Collection scheduling box.
   * Filterable Diagnostic Test catalog (15+ tests & packages with pricing, sample type, fasting guidelines, and report turnaround hours).
   * "How It Works" 4-step walkthrough.
   * About Us & Center Information (Sunday Market, Birsanagar, Jamshedpur).
   * Patient Reviews & Testimonials.
   * Contact details, Helpline `7205573352`, WhatsApp integration, and operating hours (06:30 AM - 09:00 PM).

2. **Patient Portal**:
   * User registration and JWT login.
   * My Appointments with live visual tracking status.
   * Free Home Sample Collection booking wizard with date/slot picker and address input.
   * Digital Medical Lab Reports with printable PDF layout and QR code security.
   * Itemized Invoices with simulated UPI/Cash payment settlement.
   * Doctor Prescriptions and lifestyle advice.
   * Profile management.

3. **Admin & Staff Management Console**:
   * KPI Analytics: Total Patients, Total Bookings, Pending Home Collections, Pending Reports, Collected Lab Revenue.
   * Booking workflow management (advance status, phlebotomist notes).
   * Home Collection dispatch board for phlebotomists.
   * Test catalog management (create new tests, set prices and offers).
   * Medical Report Generator (input observed test parameters, reference intervals, abnormal flags, and sign off).
   * Billing & Invoices overview.
   * Inventory & Supply tracker with automatic Low-Stock warning indicators (Tubes, Syringes, Gloves, Masks, Reagents).

4. **Doctor Portal**:
   * Authorized patient roster.
   * Lab report review.
   * Digital prescription creator (medicines, dosages, timings, follow-up dates).

5. **QR Code Verification**:
   * Online public verification at `/verify/:code`.

