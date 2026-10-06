import os
import django
from datetime import date, timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User
from lab_tests.models import TestCategory, LabTest
from bookings.models import Booking, BookingItem
from reports.models import MedicalReport
from billing.models import Invoice
from inventory.models import InventoryItem
from notifications.models import Notification
from doctors.models import DoctorProfile, Prescription
from patients.models import PatientProfile

def seed_database():
    print("Clearing and seeding database for ACCUSURE DIAGNOSTICS...")

    # 1. Create Users
    admin_user, _ = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'ashwanarya20042004@gmail.com',
            'first_name': 'Ashwani',
            'last_name': 'Arya',
            'role': 'admin',
            'phone_number': '7205573352',
            'address': 'Shop No. 7, MIJO HOUSE, Sunday Market, Birsanagar, Jamshedpur',
            'city': 'Jamshedpur',
            'pincode': '831019',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    admin_user.set_password('admin123')
    admin_user.save()

    doctor_user, _ = User.objects.get_or_create(
        username='dr_mukherjee',
        defaults={
            'email': 'dr.mukherjee@accusure.com',
            'first_name': 'R. K.',
            'last_name': 'Mukherjee',
            'role': 'doctor',
            'phone_number': '9876543210',
            'address': 'Telco Colony, Jamshedpur',
            'city': 'Jamshedpur',
            'pincode': '831004',
        }
    )
    doctor_user.set_password('doctor123')
    doctor_user.save()

    DoctorProfile.objects.get_or_create(
        user=doctor_user,
        defaults={
            'specialization': 'Consultant Pathologist & Hematologist',
            'qualification': 'MBBS, MD (Pathology)',
            'registration_number': 'JMC-98241',
            'bio': '14+ years of clinical experience in advanced diagnostic pathology and laboratory diagnostics.',
            'is_available': True
        }
    )

    staff_user, _ = User.objects.get_or_create(
        username='staff_rahul',
        defaults={
            'email': 'rahul.verma@accusure.com',
            'first_name': 'Rahul',
            'last_name': 'Verma',
            'role': 'staff',
            'phone_number': '7205573399',
            'address': 'Birsanagar Zone 3, Jamshedpur',
            'city': 'Jamshedpur',
            'pincode': '831019',
        }
    )
    staff_user.set_password('staff123')
    staff_user.save()

    patient1, _ = User.objects.get_or_create(
        username='patient_priya',
        defaults={
            'email': 'priya.sharma@example.com',
            'first_name': 'Priya',
            'last_name': 'Sharma',
            'role': 'patient',
            'phone_number': '9123456780',
            'address': 'Flat 302, Green Valley Apartments, Birsanagar, Jamshedpur',
            'gender': 'Female',
            'date_of_birth': date(1996, 5, 14),
            'city': 'Jamshedpur',
            'pincode': '831019',
        }
    )
    patient1.set_password('patient123')
    patient1.save()

    PatientProfile.objects.get_or_create(
        user=patient1,
        defaults={
            'blood_group': 'O+',
            'emergency_contact_name': 'Sanjay Sharma',
            'emergency_contact_phone': '9123456789',
            'allergies': 'None known',
            'chronic_conditions': 'Mild thyroid imbalance'
        }
    )

    patient2, _ = User.objects.get_or_create(
        username='patient_amit',
        defaults={
            'email': 'amit.kumar@example.com',
            'first_name': 'Amit',
            'last_name': 'Kumar',
            'role': 'patient',
            'phone_number': '9876512340',
            'address': 'Plot 45, Baridih Road, Jamshedpur',
            'gender': 'Male',
            'date_of_birth': date(1988, 11, 20),
            'city': 'Jamshedpur',
            'pincode': '831017',
        }
    )
    patient2.set_password('patient123')
    patient2.save()

    print("Users created: admin, dr_mukherjee, staff_rahul, patient_priya, patient_amit.")

    # 2. Test Categories
    categories_data = [
        {'name': 'Routine Blood Tests', 'slug': 'routine', 'description': 'Essential daily blood counts and baseline diagnostics', 'icon': 'Droplet'},
        {'name': 'Organ & Profile Panels', 'slug': 'profiles', 'description': 'Complete organ function panels (Liver, Kidney, Lipid, Thyroid)', 'icon': 'Activity'},
        {'name': 'Diabetes & Sugar Tests', 'slug': 'diabetes', 'description': 'Blood glucose monitoring and HbA1c screening', 'icon': 'Target'},
        {'name': 'Vitamins & Hormones', 'slug': 'vitamins', 'description': 'Critical vitamin levels, bone health and hormonal balances', 'icon': 'Sun'},
        {'name': 'Infection & Fever Panels', 'slug': 'fever', 'description': 'Dengue, Typhoid, Malaria, and viral markers', 'icon': 'ShieldAlert'},
        {'name': 'Full Body Health Packages', 'slug': 'packages', 'description': 'Comprehensive preventive health checkups at discounted bundle rates', 'icon': 'Package'},
    ]

    cat_map = {}
    for c_data in categories_data:
        cat, _ = TestCategory.objects.get_or_create(slug=c_data['slug'], defaults=c_data)
        cat_map[c_data['slug']] = cat

    # 3. Lab Tests
    tests_data = [
        {
            'name': 'Complete Blood Count (CBC) with ESR',
            'code': 'ACC-CBC',
            'category': cat_map['routine'],
            'price': 350.00,
            'discount_price': 299.00,
            'sample_type': 'EDTA Whole Blood',
            'fasting_required': False,
            'turnaround_hours': 6,
            'parameters_included': 'Hemoglobin, TLC, DLC, Platelet Count, RBC, PCV, MCV, MCH, MCHC, ESR',
            'preparation_instructions': 'No special fasting required. Can be done anytime.',
            'description': 'Measures cell counts in blood to evaluate overall health and detect disorders like anemia and infection.',
            'is_popular': True
        },
        {
            'name': 'Lipid Profile (Cholesterol Panel)',
            'code': 'ACC-LIPID',
            'category': cat_map['profiles'],
            'price': 750.00,
            'discount_price': 599.00,
            'sample_type': 'Serum',
            'fasting_required': True,
            'fasting_hours': 10,
            'turnaround_hours': 12,
            'parameters_included': 'Total Cholesterol, HDL Cholesterol, LDL Cholesterol, VLDL, Triglycerides, Cholesterol/HDL Ratio',
            'preparation_instructions': 'Requires 10-12 hours of overnight fasting. Water is permitted.',
            'description': 'Assesses cardiovascular risk and lipid metabolism for heart health.',
            'is_popular': True
        },
        {
            'name': 'Thyroid Profile Total (T3, T4, TSH)',
            'code': 'ACC-THYROID',
            'category': cat_map['profiles'],
            'price': 650.00,
            'discount_price': 499.00,
            'sample_type': 'Serum',
            'fasting_required': True,
            'fasting_hours': 8,
            'turnaround_hours': 12,
            'parameters_included': 'Triiodothyronine (T3), Thyroxine (T4), Thyroid Stimulating Hormone (TSH)',
            'preparation_instructions': 'Fasting preferred. Morning sample recommended before thyroid medication.',
            'description': 'Evaluates thyroid gland function to detect hyperthyroidism or hypothyroidism.',
            'is_popular': True
        },
        {
            'name': 'Liver Function Test (LFT)',
            'code': 'ACC-LFT',
            'category': cat_map['profiles'],
            'price': 800.00,
            'discount_price': 649.00,
            'sample_type': 'Serum',
            'fasting_required': True,
            'fasting_hours': 8,
            'turnaround_hours': 12,
            'parameters_included': 'Bilirubin (Total, Direct, Indirect), SGOT/AST, SGPT/ALT, Alkaline Phosphatase, Total Protein, Albumin, Globulin, A/G Ratio',
            'preparation_instructions': 'Overnight fasting of 8-10 hours recommended.',
            'description': 'Screens for liver injury, jaundice, hepatitis, and protein synthesis health.',
            'is_popular': True
        },
        {
            'name': 'Kidney Function Test (KFT) / Renal Profile',
            'code': 'ACC-KFT',
            'category': cat_map['profiles'],
            'price': 800.00,
            'discount_price': 649.00,
            'sample_type': 'Serum',
            'fasting_required': False,
            'turnaround_hours': 12,
            'parameters_included': 'Blood Urea, Serum Creatinine, Uric Acid, BUN, Calcium, Phosphorus, Electrolytes (Na, K, Cl)',
            'preparation_instructions': 'Stay adequately hydrated before test.',
            'description': 'Checks kidney filtering capacity and fluid/electrolyte balance.',
            'is_popular': True
        },
        {
            'name': 'HbA1c (Glycated Hemoglobin)',
            'code': 'ACC-HBA1C',
            'category': cat_map['diabetes'],
            'price': 550.00,
            'discount_price': 450.00,
            'sample_type': 'EDTA Whole Blood',
            'fasting_required': False,
            'turnaround_hours': 8,
            'parameters_included': 'HbA1c %, Estimated Average Glucose (eAG)',
            'preparation_instructions': 'No fasting required. Measures 3-month average blood sugar.',
            'description': 'Gold standard test for diabetes monitoring and long-term glycemic control.',
            'is_popular': True
        },
        {
            'name': 'Fasting Blood Sugar (FBS)',
            'code': 'ACC-FBS',
            'category': cat_map['diabetes'],
            'price': 120.00,
            'discount_price': 99.00,
            'sample_type': 'Fluoride Plasma',
            'fasting_required': True,
            'fasting_hours': 8,
            'turnaround_hours': 4,
            'parameters_included': 'Fasting Plasma Glucose',
            'preparation_instructions': 'Strict 8 to 10 hours overnight fasting required.',
            'description': 'Evaluates baseline glucose level after fasting.',
            'is_popular': False
        },
        {
            'name': 'Post Prandial Blood Sugar (PPBS)',
            'code': 'ACC-PPBS',
            'category': cat_map['diabetes'],
            'price': 120.00,
            'discount_price': 99.00,
            'sample_type': 'Fluoride Plasma',
            'fasting_required': False,
            'turnaround_hours': 4,
            'parameters_included': 'Post-Meal Glucose',
            'preparation_instructions': 'Sample given exactly 2 hours after commencing a meal.',
            'description': 'Evaluates how body manages glucose load after a meal.',
            'is_popular': False
        },
        {
            'name': 'Vitamin D (25-Hydroxy)',
            'code': 'ACC-VITD',
            'category': cat_map['vitamins'],
            'price': 1200.00,
            'discount_price': 899.00,
            'sample_type': 'Serum',
            'fasting_required': False,
            'turnaround_hours': 24,
            'parameters_included': '25-OH Vitamin D3 / D2',
            'preparation_instructions': 'No fasting required.',
            'description': 'Crucial for bone density, calcium absorption, and immune function.',
            'is_popular': True
        },
        {
            'name': 'Vitamin B12 (Cyanocobalamin)',
            'code': 'ACC-VITB12',
            'category': cat_map['vitamins'],
            'price': 1100.00,
            'discount_price': 850.00,
            'sample_type': 'Serum',
            'fasting_required': True,
            'fasting_hours': 8,
            'turnaround_hours': 24,
            'parameters_included': 'Serum Vitamin B12',
            'preparation_instructions': 'Fasting of 8 hours recommended.',
            'description': 'Essential for nerve function, neurological health, and red cell production.',
            'is_popular': False
        },
        {
            'name': 'Dengue NS1 Antigen & IgM/IgG Serology',
            'code': 'ACC-DENGUE',
            'category': cat_map['fever'],
            'price': 950.00,
            'discount_price': 750.00,
            'sample_type': 'Serum',
            'fasting_required': False,
            'turnaround_hours': 6,
            'parameters_included': 'Dengue NS1 Antigen, Dengue IgM Antibody, Dengue IgG Antibody',
            'preparation_instructions': 'Can be done at any time during fever illness.',
            'description': 'Rapid detection of dengue viral infection during early acute and convalescent phases.',
            'is_popular': False
        },
        {
            'name': 'Complete Urine Examination (CUE Routine & Microscopic)',
            'code': 'ACC-URINE',
            'category': cat_map['routine'],
            'price': 220.00,
            'discount_price': 180.00,
            'sample_type': 'Clean Catch Midstream Urine',
            'fasting_required': False,
            'turnaround_hours': 6,
            'parameters_included': 'Color, pH, Specific Gravity, Protein/Albumin, Sugar, Ketones, Pus Cells, RBCs, Epithelial Cells, Crystals, Casts',
            'preparation_instructions': 'Clean container provided. First morning mid-stream urine preferred.',
            'description': 'Detects urinary tract infections, kidney disorders, and metabolic indicators.',
            'is_popular': False
        },
        {
            'name': 'Accusure Basic Health Checkup Package',
            'code': 'ACC-PKG-BASIC',
            'category': cat_map['packages'],
            'price': 1900.00,
            'discount_price': 1199.00,
            'sample_type': 'Blood & Urine',
            'fasting_required': True,
            'fasting_hours': 10,
            'turnaround_hours': 12,
            'parameters_included': 'CBC (24 Parameters), Fasting Blood Sugar, Lipid Profile, Kidney Function Test, Urine Routine',
            'preparation_instructions': '10-12 hours overnight fasting. Includes free home sample collection.',
            'description': 'A foundational preventive health screening covering vital organs and metabolism.',
            'is_popular': True
        },
        {
            'name': 'Accusure Master Full Body Health Package (70+ Tests)',
            'code': 'ACC-PKG-MASTER',
            'category': cat_map['packages'],
            'price': 3500.00,
            'discount_price': 1999.00,
            'sample_type': 'Blood & Urine',
            'fasting_required': True,
            'fasting_hours': 10,
            'turnaround_hours': 24,
            'parameters_included': 'CBC, Liver Function Test (LFT), Kidney Function Test (KFT), Lipid Profile, Thyroid Profile (T3/T4/TSH), HbA1c, Fasting Sugar, Urine Analysis',
            'preparation_instructions': '10-12 hours overnight fasting. Comprehensive health review by MD Pathologist.',
            'description': 'Our most popular comprehensive diagnostic health screening for complete wellness.',
            'is_popular': True
        },
        {
            'name': 'Accusure Senior Citizen Care Comprehensive (85+ Tests)',
            'code': 'ACC-PKG-SENIOR',
            'category': cat_map['packages'],
            'price': 5200.00,
            'discount_price': 2999.00,
            'sample_type': 'Blood & Urine',
            'fasting_required': True,
            'fasting_hours': 10,
            'turnaround_hours': 24,
            'parameters_included': 'Master Package + Vitamin D3 + Vitamin B12 + Calcium + Iron Studies + Cardiac Risk Markers',
            'preparation_instructions': '10-12 hours overnight fasting. Phlebotomist visits home with comfortable gentle draw needles.',
            'description': 'Advanced preventive screening specially curated for seniors aged 50+.',
            'is_popular': True
        }
    ]

    for t_data in tests_data:
        LabTest.objects.update_or_create(code=t_data['code'], defaults=t_data)

    print(f"Loaded {len(tests_data)} diagnostic tests and packages.")

    # 4. Inventory items
    inventory_data = [
        {'name': 'EDTA Blood Collection Tubes (Purple 2ml)', 'category': 'TUBES', 'sku': 'TUB-EDTA-001', 'quantity': 180, 'unit': 'Tubes', 'reorder_level': 50, 'cost_per_unit': 8.50},
        {'name': 'Serum Separator Gel Tubes (Gold 5ml)', 'category': 'TUBES', 'sku': 'TUB-SST-002', 'quantity': 15, 'unit': 'Tubes', 'reorder_level': 30, 'cost_per_unit': 12.00}, # LOW STOCK
        {'name': 'Sodium Fluoride Sugar Tubes (Grey 2ml)', 'category': 'TUBES', 'sku': 'TUB-FLR-003', 'quantity': 95, 'unit': 'Tubes', 'reorder_level': 40, 'cost_per_unit': 9.00},
        {'name': 'Sterile 5ml Disposable Syringes (24G)', 'category': 'SYRINGES', 'sku': 'SYR-5ML-010', 'quantity': 250, 'unit': 'Pieces', 'reorder_level': 60, 'cost_per_unit': 5.00},
        {'name': 'Nitrile Examination Gloves Medium', 'category': 'PPE', 'sku': 'PPE-GLV-MED', 'quantity': 8, 'unit': 'Boxes (100s)', 'reorder_level': 10, 'cost_per_unit': 380.00}, # LOW STOCK
        {'name': 'Surgical 3-Ply Face Masks', 'category': 'PPE', 'sku': 'PPE-MSK-3P', 'quantity': 14, 'unit': 'Boxes (50s)', 'reorder_level': 5, 'cost_per_unit': 150.00},
        {'name': 'Isopropyl Alcohol Prep Swabs', 'category': 'MISC', 'sku': 'MSC-ALC-PAD', 'quantity': 4, 'unit': 'Boxes (100s)', 'reorder_level': 8, 'cost_per_unit': 120.00}, # LOW STOCK
        {'name': 'Sterile Urine Sample Collection Containers', 'category': 'CONTAINERS', 'sku': 'CON-URN-001', 'quantity': 120, 'unit': 'Cups', 'reorder_level': 40, 'cost_per_unit': 15.00},
        {'name': 'Dengue NS1 Antigen Rapid Test Kits', 'category': 'REAGENTS', 'sku': 'REG-DNG-RAP', 'quantity': 35, 'unit': 'Kits', 'reorder_level': 15, 'cost_per_unit': 320.00},
    ]

    for inv in inventory_data:
        InventoryItem.objects.update_or_create(sku=inv['sku'], defaults=inv)

    print("Loaded inventory items with stock levels.")

    # 5. Create Sample Bookings across the lifecycle
    today = timezone.now().date()

    cbc_test = LabTest.objects.get(code='ACC-CBC')
    lipid_test = LabTest.objects.get(code='ACC-LIPID')
    thyroid_test = LabTest.objects.get(code='ACC-THYROID')
    master_pkg = LabTest.objects.get(code='ACC-PKG-MASTER')

    # Booking 1: Completed with Medical Report & Invoice Paid (Priya Sharma)
    b1, _ = Booking.objects.get_or_create(
        booking_id='ACC-20261005-A109B2',
        defaults={
            'patient': patient1,
            'patient_name': 'Priya Sharma',
            'patient_phone': '9123456780',
            'patient_age': 28,
            'patient_gender': 'Female',
            'collection_type': 'HOME_COLLECTION',
            'collection_address': 'Flat 302, Green Valley Apartments, Birsanagar, Jamshedpur',
            'landmark': 'Near Sunday Market',
            'pincode': '831019',
            'preferred_date': today - timedelta(days=1),
            'preferred_time_slot': '07:30 AM - 08:30 AM',
            'status': 'COMPLETED',
            'assigned_staff': staff_user,
            'phlebotomist_notes': 'Sample collected smoothly via painless venipuncture. Purple EDTA and Gold SST tubes labeled.',
            'total_amount': master_pkg.final_price,
            'notes': 'Requested digital report on WhatsApp and email.',
        }
    )
    BookingItem.objects.get_or_create(booking=b1, test=master_pkg, defaults={'test_name': master_pkg.name, 'price': master_pkg.final_price})

    # Invoice for Booking 1 (PAID)
    inv1, _ = Invoice.objects.get_or_create(
        booking=b1,
        defaults={
            'invoice_number': 'INV-202610-8841',
            'patient': patient1,
            'subtotal': master_pkg.final_price,
            'discount': 0.00,
            'home_collection_fee': 0.00,
            'total_amount': master_pkg.final_price,
            'payment_status': 'PAID',
            'payment_method': 'UPI',
            'transaction_id': 'UPI-YESB-9988224411',
            'paid_at': timezone.now() - timedelta(days=1),
        }
    )

    # Medical Report for Booking 1
    report_parameters = [
        {
            'section': 'Complete Blood Count (CBC)',
            'items': [
                {'name': 'Hemoglobin (Hb)', 'value': '13.4', 'unit': 'g/dL', 'normal_range': '12.0 - 15.5', 'flag': 'NORMAL'},
                {'name': 'Total Leukocyte Count (TLC)', 'value': '7,200', 'unit': '/cu.mm', 'normal_range': '4,000 - 10,000', 'flag': 'NORMAL'},
                {'name': 'Platelet Count', 'value': '245,000', 'unit': '/cu.mm', 'normal_range': '150,000 - 450,000', 'flag': 'NORMAL'},
                {'name': 'RBC Count', 'value': '4.5', 'unit': 'mil/cu.mm', 'normal_range': '3.8 - 5.2', 'flag': 'NORMAL'},
                {'name': 'Packed Cell Volume (PCV)', 'value': '39.8', 'unit': '%', 'normal_range': '36.0 - 46.0', 'flag': 'NORMAL'},
            ]
        },
        {
            'section': 'Lipid Profile',
            'items': [
                {'name': 'Total Cholesterol', 'value': '178', 'unit': 'mg/dL', 'normal_range': '< 200', 'flag': 'NORMAL'},
                {'name': 'Triglycerides', 'value': '142', 'unit': 'mg/dL', 'normal_range': '< 150', 'flag': 'NORMAL'},
                {'name': 'HDL Cholesterol (Good)', 'value': '52', 'unit': 'mg/dL', 'normal_range': '> 50', 'flag': 'NORMAL'},
                {'name': 'LDL Cholesterol (Bad)', 'value': '97.6', 'unit': 'mg/dL', 'normal_range': '< 100', 'flag': 'NORMAL'},
            ]
        },
        {
            'section': 'Thyroid Profile',
            'items': [
                {'name': 'TSH (Thyroid Stimulating Hormone)', 'value': '4.85', 'unit': 'µIU/mL', 'normal_range': '0.35 - 4.94', 'flag': 'NORMAL'},
                {'name': 'Total T3', 'value': '1.20', 'unit': 'ng/mL', 'normal_range': '0.80 - 2.00', 'flag': 'NORMAL'},
                {'name': 'Total T4', 'value': '8.1', 'unit': 'µg/dL', 'normal_range': '5.1 - 14.1', 'flag': 'NORMAL'},
            ]
        },
        {
            'section': 'Diabetes / Sugar Profile',
            'items': [
                {'name': 'Fasting Blood Glucose', 'value': '92', 'unit': 'mg/dL', 'normal_range': '70 - 99', 'flag': 'NORMAL'},
                {'name': 'HbA1c (Glycated Hb)', 'value': '5.4', 'unit': '%', 'normal_range': '< 5.7 (Normal)', 'flag': 'NORMAL'},
            ]
        }
    ]

    MedicalReport.objects.get_or_create(
        booking=b1,
        defaults={
            'report_id': 'RPT-202610-8841',
            'patient': patient1,
            'doctor_name': 'Dr. R. K. Mukherjee (MD, Pathologist)',
            'verification_code': 'ACCUSURE-VER-998822AABB44',
            'status': 'PUBLISHED',
            'overall_summary': 'Comprehensive parameters are within standard physiological reference ranges. Good metabolic and hematologic balance. Annual routine follow-up recommended.',
            'parameters_data': report_parameters,
            'sample_collected_at': timezone.now() - timedelta(days=1, hours=4),
            'reported_at': timezone.now() - timedelta(days=1),
        }
    )

    # Booking 2: Sample Collected & In Lab Testing (Amit Kumar)
    b2, _ = Booking.objects.get_or_create(
        booking_id='ACC-20261006-F81C43',
        defaults={
            'patient': patient2,
            'patient_name': 'Amit Kumar',
            'patient_phone': '9876512340',
            'patient_age': 36,
            'patient_gender': 'Male',
            'collection_type': 'HOME_COLLECTION',
            'collection_address': 'Plot 45, Baridih Road, Jamshedpur',
            'landmark': 'Near Tata Steel Colony Gate',
            'pincode': '831017',
            'preferred_date': today,
            'preferred_time_slot': '08:00 AM - 09:30 AM',
            'status': 'TESTING',
            'assigned_staff': staff_user,
            'phlebotomist_notes': 'Sample drawn at 08:15 AM. Barcode attached #AK981. Dispatched to central lab analyzer.',
            'total_amount': cbc_test.final_price + lipid_test.final_price,
            'notes': 'Doctor advised lipid test due to family history.',
        }
    )
    BookingItem.objects.get_or_create(booking=b2, test=cbc_test, defaults={'test_name': cbc_test.name, 'price': cbc_test.final_price})
    BookingItem.objects.get_or_create(booking=b2, test=lipid_test, defaults={'test_name': lipid_test.name, 'price': lipid_test.final_price})

    Invoice.objects.get_or_create(
        booking=b2,
        defaults={
            'invoice_number': 'INV-202610-9012',
            'patient': patient2,
            'subtotal': cbc_test.final_price + lipid_test.final_price,
            'discount': 0.00,
            'home_collection_fee': 0.00,
            'total_amount': cbc_test.final_price + lipid_test.final_price,
            'payment_status': 'PENDING',
            'payment_method': 'UNPAID',
        }
    )

    # Booking 3: Confirmed / Phlebotomist Assigned (Priya Sharma for Mother)
    b3, _ = Booking.objects.get_or_create(
        booking_id='ACC-20261006-K29M77',
        defaults={
            'patient': patient1,
            'patient_name': 'Shashi Sharma (Mother)',
            'patient_phone': '9123456780',
            'patient_age': 54,
            'patient_gender': 'Female',
            'collection_type': 'HOME_COLLECTION',
            'collection_address': 'Flat 302, Green Valley Apartments, Birsanagar, Jamshedpur',
            'landmark': 'Near Sunday Market',
            'pincode': '831019',
            'preferred_date': today + timedelta(days=1),
            'preferred_time_slot': '07:00 AM - 08:30 AM',
            'status': 'CONFIRMED',
            'assigned_staff': staff_user,
            'phlebotomist_notes': 'Scheduled for tomorrow morning slot. Please advise 10h fasting.',
            'total_amount': thyroid_test.final_price,
            'notes': 'Senior citizen home visit.',
        }
    )
    BookingItem.objects.get_or_create(booking=b3, test=thyroid_test, defaults={'test_name': thyroid_test.name, 'price': thyroid_test.final_price})

    Invoice.objects.get_or_create(
        booking=b3,
        defaults={
            'invoice_number': 'INV-202610-9430',
            'patient': patient1,
            'subtotal': thyroid_test.final_price,
            'discount': 0.00,
            'home_collection_fee': 0.00,
            'total_amount': thyroid_test.final_price,
            'payment_status': 'PENDING',
            'payment_method': 'CASH',
        }
    )

    # Notifications
    Notification.objects.get_or_create(
        user=patient1,
        title='Lab Report Ready: RPT-202610-8841',
        defaults={
            'message': 'Your Accusure Master Full Body Health Package report is verified and ready to view/download.',
            'notification_type': 'REPORT_READY',
            'link': '/dashboard/reports',
            'is_read': False
        }
    )

    Notification.objects.get_or_create(
        user=patient2,
        title='Sample In Lab: ACC-20261006-F81C43',
        defaults={
            'message': 'Your blood sample has been received at ACCUSURE DIAGNOSTICS laboratory. Testing is currently underway.',
            'notification_type': 'SAMPLE_COLLECTED',
            'link': '/dashboard/appointments',
            'is_read': False
        }
    )

    # Doctor Prescription
    Prescription.objects.get_or_create(
        doctor=doctor_user,
        patient=patient1,
        defaults={
            'booking': b1,
            'diagnosis': 'Borderline TSH elevation with asymptomatic clinical presentation.',
            'medicines': [
                {'name': 'Thyronorm 25mcg', 'dosage': '1 tablet', 'timing': 'Empty stomach early morning', 'duration': '30 days'},
                {'name': 'Vitamin D3 60,000 IU', 'dosage': '1 capsule', 'timing': 'Weekly once after meal', 'duration': '8 weeks'},
            ],
            'notes': 'Repeat TSH and Serum Calcium after 6 weeks. Maintain balanced diet.',
            'follow_up_date': today + timedelta(days=45)
        }
    )

    print("Seeding completed successfully!")

if __name__ == '__main__':
    seed_database()

