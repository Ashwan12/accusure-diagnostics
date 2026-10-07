import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 750, "ACCUSURE DIAGNOSTICS — Interviewer Presentation & Dashboard Guide")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)

        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, footer_text)
        self.drawString(54, 36, "CONFIDENTIAL — Portfolio & Technical Interview Guide")
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()

def build_pdf(filename="ACCUSURE_DIAGNOSTICS_Interview_Dashboard_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom palette
    PRIMARY = colors.HexColor("#0284c7")      # Medical Sky Blue
    DARK_BG = colors.HexColor("#0f172a")      # Slate 900
    TEXT_COLOR = colors.HexColor("#1e293b")   # Slate 800
    MUTED = colors.HexColor("#64748b")        # Slate 500
    TEAL = colors.HexColor("#0d9488")         # Teal
    AMBER = colors.HexColor("#d97706")        # Amber

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=DARK_BG,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionHeading1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=DARK_BG,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionHeading2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_COLOR,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#0369a1")
    )

    qa_question = ParagraphStyle(
        'QAQuestion',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=DARK_BG,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    qa_answer = ParagraphStyle(
        'QAAnswer',
        parent=body_style,
        leftIndent=10,
        textColor=colors.HexColor("#334155")
    )

    story = []

    # Title Block
    story.append(Paragraph("ACCUSURE DIAGNOSTICS", title_style))
    story.append(Paragraph("Smart Healthcare & Diagnostic Management System — Interview Presentation Guide", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=14))

    # Meta Overview Box
    meta_table_data = [
        [
            Paragraph("<b>Target Role:</b> Full-Stack Developer / Software Engineer", body_style),
            Paragraph("<b>Tech Stack:</b> React, Django REST Framework, Tailwind, JWT", body_style)
        ],
        [
            Paragraph("<b>Business Domain:</b> Pathology & Healthcare Diagnostics", body_style),
            Paragraph("<b>Live Demo:</b> https://accusure-diagnostics.vercel.app/", body_style)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[240, 264])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # 1. 30-Second Elevator Pitch
    story.append(Paragraph("1. The 30-Second Elevator Pitch to Open Your Interview", h1_style))
    pitch_text = (
        "<i>\"ACCUSURE DIAGNOSTICS is a responsive full-stack healthcare web application designed to digitize "
        "and streamline operations for a pathology diagnostic center in Jamshedpur. It handles the complete lifecycle "
        "of clinical diagnostics: online test booking, 100% free doorstep home sample collection, a live 6-step progress tracker, "
        "digital medical reports with QR code authenticity verification, itemized billing, and an operations dashboard "
        "with automated inventory low-stock alerts. Built with React and Django REST Framework, it works seamlessly on "
        "desktops, tablets, and smartphones.\"</i>"
    )
    callout_box = Table([[Paragraph(pitch_text, callout_style)]], colWidths=[504])
    callout_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0f9ff")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#bae6fd")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(callout_box)
    story.append(Spacer(1, 14))

    # 2. System Architecture
    story.append(Paragraph("2. System Architecture & Engineering Stack", h1_style))
    arch_data = [
        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Technology</b>", body_style), Paragraph("<b>Architectural Responsibility</b>", body_style)],
        [
            Paragraph("<b>Frontend SPA</b>", body_style),
            Paragraph("React.js, Vite, Tailwind CSS v4, Lucide Icons", body_style),
            Paragraph("Component-based reactive UI, client-side routing (React Router), responsive mobile drawer & sticky action bar, print media styling.", body_style)
        ],
        [
            Paragraph("<b>Backend API</b>", body_style),
            Paragraph("Python 3.12, Django 6.1, Django REST Framework", body_style),
            Paragraph("RESTful endpoints, automated serializers, JWT token authentication, business logic for bookings, invoices, and diagnostic workflows.", body_style)
        ],
        [
            Paragraph("<b>Database & ORM</b>", body_style),
            Paragraph("SQLite (Dev) / PostgreSQL (Prod)", body_style),
            Paragraph("Relational schema modeling users, tests, bookings, invoices, inventory items, and pathologist reports with relational integrity.", body_style)
        ],
        [
            Paragraph("<b>Security & Auth</b>", body_style),
            Paragraph("SimpleJWT & Role-Based Access Control", body_style),
            Paragraph("Secure stateless authentication with token refresh and granular roles: Patient, Doctor, Phlebotomist/Staff, and Admin.", body_style)
        ],
        [
            Paragraph("<b>Deployment</b>", body_style),
            Paragraph("Vercel (Frontend) & Cloud-Ready", body_style),
            Paragraph("Global Edge CDN deployment with URL rewrites, ErrorBoundary crash protection, and resilient offline data fallback interception.", body_style)
        ]
    ]
    arch_table = Table(arch_data, colWidths=[100, 160, 244])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 14))

    # 3. Output Dashboards Breakdown
    story.append(Paragraph("3. Step-by-Step Walkthrough of Every Dashboard to Show the Interviewer", h1_style))
    story.append(Paragraph(
        "When presenting your project, guide the interviewer through the application in the sequence of the user journey:", body_style
    ))

    # Screen A: Landing Page
    story.append(Paragraph("A. Public Website & Free Home Collection Booking Wizard", h2_style))
    story.append(Paragraph("<b>What to demonstrate to the interviewer:</b>", body_style))
    story.append(Paragraph("• <b>Instant Test Search:</b> Type <i>\"CBC\"</i>, <i>\"Thyroid\"</i>, or <i>\"Lipid\"</i> into the hero search bar to show real-time filtering.", bullet_style))
    story.append(Paragraph("• <b>Express Home Collection Box:</b> Show the 3-step scheduling widget directly on the hero page. Highlight that Jamshedpur citizens get ₹0 doorstep collection fees.", bullet_style))
    story.append(Paragraph("• <b>Test Catalog Grid:</b> Switch category tabs (Routine Blood, Organ Profiles, Diabetes, Packages) showing price, discount tags, fasting guidelines, and report turnaround time.", bullet_style))
    story.append(Paragraph("• <b>Smartphone Responsiveness:</b> Shrink the browser window or show on your phone to demonstrate the sticky bottom quick-action bar (Call 7205573352, WhatsApp, Book Test).", bullet_style))

    # Screen B: Patient Dashboard
    story.append(Paragraph("B. Patient Portal & Live 6-Step Workflow Tracker", h2_style))
    story.append(Paragraph("<b>What to demonstrate to the interviewer:</b>", body_style))
    story.append(Paragraph("• <b>1-Click Demo Login:</b> Click <i>\"Login as Patient (Priya Sharma)\"</i> on the login page to show frictionless auth evaluation.", bullet_style))
    story.append(Paragraph("• <b>Visual Workflow Tracker:</b> Show the active appointment progression stepper:", bullet_style))
    story.append(Paragraph("  <font color='#0284c7'><b>[01 Pending] ➔ [02 Confirmed] ➔ [03 Sample Drawn] ➔ [04 Testing in Lab] ➔ [05 Report Ready] ➔ [06 Completed]</b></font>", body_style))
    story.append(Paragraph("• Explain to the interviewer how this eliminates patient anxiety by giving real-time transparency into specimen processing.", bullet_style))

    # Screen C: Medical Report Viewer
    story.append(Paragraph("C. Official Pathology Lab Report & QR Verification System", h2_style))
    story.append(Paragraph("<b>What to demonstrate to the interviewer:</b>", body_style))
    story.append(Paragraph("• Click <b>\"View & Download Report\"</b> in the patient portal or admin console.", bullet_style))
    story.append(Paragraph("• <b>Official Letterhead:</b> Point out the professional lab layout with ACCUSURE DIAGNOSTICS header, patient demographics, and referring doctor.", bullet_style))
    story.append(Paragraph("• <b>Clinical Parameters Table:</b> Show test parameters with reference intervals and automatic flag indicators (<font color='#b91c1c'><b>HIGH</b></font>, <font color='#d97706'><b>LOW</b></font>, <font color='#047857'><b>NORMAL</b></font>).", bullet_style))
    story.append(Paragraph("• <b>Dynamic QR Code:</b> Point to the QR code box on the top right. Explain that scanning this code opens the public URL (<code>/verify/:code</code>) to confirm the report's authenticity against database records.", bullet_style))
    story.append(Paragraph("• <b>Print / PDF Export:</b> Click \"Print / Save PDF\" to demonstrate clean, borderless paper printing using dedicated CSS <code>@media print</code> rules.", bullet_style))

    # Screen D: Invoicing & Billing
    story.append(Paragraph("D. Diagnostic Invoicing & Payment Settlement", h2_style))
    story.append(Paragraph("<b>What to demonstrate to the interviewer:</b>", body_style))
    story.append(Paragraph("• Click <b>\"View Receipt\"</b> or <b>\"Pay Now\"</b> on an invoice item.", bullet_style))
    story.append(Paragraph("• Show the itemized breakdown (test charges, 100% free home collection fee, discounts, and GST invoice number).", bullet_style))
    story.append(Paragraph("• Demonstrate payment settlement simulation (selecting UPI, Cash, or Card to transition the status from PENDING to PAID).", bullet_style))

    story.append(PageBreak())

    # Screen E: Admin Console
    story.append(Paragraph("E. Admin Operations Console & Analytics KPIs", h2_style))
    story.append(Paragraph("<b>What to demonstrate to the interviewer:</b>", body_style))
    story.append(Paragraph("• <b>High-Level Metrics Cards:</b> Total Patients (148), Total Bookings (52), Pending Home Collections (3), and Collected Revenue (₹68,400).", bullet_style))
    story.append(Paragraph("• <b>Workflow Lifecycle Controls:</b> In the Bookings tab, change an appointment's status dropdown from <i>CONFIRMED</i> to <i>SAMPLE_COLLECTED</i> to show real-time state transition.", bullet_style))
    story.append(Paragraph("• <b>Phlebotomist Assignment:</b> Select a staff member (Rahul Verma) to assign them to a pending home visit.", bullet_style))
    story.append(Paragraph("• <b>Doorstep Dispatch Board:</b> Switch to the \"Home Collections\" tab. Show how phlebotomists have a dedicated pickup queue with one-click WhatsApp and Phone calling links.", bullet_style))

    # Screen F: Report Generator
    story.append(Paragraph("F. Lab Report Generator & Parameter Input", h2_style))
    story.append(Paragraph("<b>What to demonstrate to the interviewer:</b>", body_style))
    story.append(Paragraph("• Click <b>\"Attach Report\"</b> on any booking in the admin panel.", bullet_style))
    story.append(Paragraph("• Show how the lab technician can input observed numeric values for Hemoglobin, Blood Sugar, or Cholesterol, select the High/Low flag, add clinical notes, and publish the verified report with a single click.", bullet_style))

    # Screen G: Inventory & Low-Stock Alerts
    story.append(Paragraph("G. Medical Supplies Inventory & Low-Stock Alert System", h2_style))
    story.append(Paragraph("<b>What to demonstrate to the interviewer:</b>", body_style))
    story.append(Paragraph("• Navigate to the <b>\"Inventory Supplies\"</b> tab.", bullet_style))
    story.append(Paragraph("• Show stock monitoring for EDTA purple tubes, SST gel tubes, 5ml syringes, nitrile gloves, and rapid test kits.", bullet_style))
    story.append(Paragraph("• <b>Automated Alert Badges:</b> Point out the red <b>\"LOW STOCK\"</b> badge that triggers whenever quantity falls below the safety reorder threshold.", bullet_style))
    story.append(Paragraph("• <b>One-Click Restocking:</b> Click <b>\"+25\"</b> or <b>\"+50\"</b> to show instant reactive stock replenishment without full-page reloads.", bullet_style))

    # Screen H: Doctor Portal
    story.append(Paragraph("H. Doctor & Consultant Pathologist Portal", h2_style))
    story.append(Paragraph("<b>What to demonstrate to the interviewer:</b>", body_style))
    story.append(Paragraph("• Log in as <i>\"Dr. R. K. Mukherjee\"</i>.", bullet_style))
    story.append(Paragraph("• Show authorized patient histories, pathology report reviews, and the digital prescription creator (entering drug names, dosages, timings, and follow-up consultation dates).", bullet_style))

    story.append(Spacer(1, 10))

    # 4. Key Engineering Highlights
    story.append(Paragraph("4. Key Technical Achievements to Highlight in Discussion", h1_style))
    eng_highlights = [
        ("Role-Based Access Control (RBAC)", "Implemented 4 distinct user tiers (Patient, Doctor, Staff, Admin) using custom Django User models and JWT claims, ensuring strict medical data privacy."),
        ("Dual-Layer Cloud & Offline Resilience", "Built an automated response interceptor in Axios. If the cloud backend is cold or unreachable on Vercel preview, the app seamlessly provides rich offline fallback data so the reviewer never sees a blank screen."),
        ("Mobile-First UX Engineering", "Designed responsive UI patterns including touch-optimized cards, mobile drawer navigation, and a sticky emergency/quick-booking bar on small screens."),
        ("Printable Laboratory Reports with QR Code", "Authored official pathology layouts adhering to medical lab formatting, featuring automatic flag detection, doctor signatures, and dynamic QR code authentication.")
    ]
    for title, desc in eng_highlights:
        story.append(Paragraph(f"• <b>{title}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 10))

    # 5. Top Interview Questions & Answers
    story.append(Paragraph("5. Anticipated Interview Questions & Winning Model Answers", h1_style))

    q1 = "Q1: Why did you choose React for the frontend and Django REST Framework for the backend?"
    a1 = (
        "<b>Answer:</b> React was chosen for its component-driven reactivity, fast virtual DOM, and rich ecosystem "
        "which enables smooth modal workflows, live search filtering, and state transitions without jarring page reloads. "
        "Django REST Framework was selected because Python is the industry standard in healthcare data processing, "
        "and Django provides a battle-tested ORM, built-in security protections against CSRF/SQL injection, and mature "
        "libraries for JWT authentication."
    )
    story.append(Paragraph(q1, qa_question))
    story.append(Paragraph(a1, qa_answer))

    q2 = "Q2: How did you design the booking status lifecycle in the database?"
    a2 = (
        "<b>Answer:</b> I modeled the booking workflow as a finite state machine with 6 discrete statuses: "
        "<code>PENDING ➔ CONFIRMED ➔ SAMPLE_COLLECTED ➔ TESTING ➔ REPORT_READY ➔ COMPLETED</code>. "
        "Each status change triggers business logic: for example, transitioning to <i>SAMPLE_COLLECTED</i> updates phlebotomist notes, "
        "while publishing a report automatically moves the booking to <i>REPORT_READY</i> and generates a notification for the patient."
    )
    story.append(Paragraph(q2, qa_question))
    story.append(Paragraph(a2, qa_answer))

    q3 = "Q3: How does the QR verification feature work technically?"
    a3 = (
        "<b>Answer:</b> Whenever a medical report is saved, a cryptographically unique verification code (e.g., "
        "<code>ACCUSURE-VER-XXXX</code>) is generated. A QR code image pointing to <code>/verify/{code}</code> is dynamically "
        "rendered on the printed report. When scanned with any smartphone camera, the public verification endpoint fetches "
        "the verified pathologist findings from the backend to confirm the document has not been tampered with."
    )
    story.append(Paragraph(q3, qa_question))
    story.append(Paragraph(a3, qa_answer))

    q4 = "Q4: How did you ensure the project works on mobile devices as requested?"
    a4 = (
        "<b>Answer:</b> I used Tailwind CSS media queries and flex/grid responsive breakpoints. On mobile screens, "
        "complex tables collapse into stacked cards, wide desktop headers fold into a slide-out drawer, and a specialized "
        "sticky bottom navigation bar provides quick one-tap access to WhatsApp, phone helpline, and the booking wizard. "
        "I also tested the build using Vite's <code>--host</code> flag to verify on physical mobile devices over Wi-Fi."
    )
    story.append(Paragraph(q4, qa_question))
    story.append(Paragraph(a4, qa_answer))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated: {filename}")

if __name__ == '__main__':
    build_pdf()

