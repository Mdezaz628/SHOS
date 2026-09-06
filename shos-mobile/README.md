# SHOS Mobile — Smart Hospital Operations System

> **"One Intelligent Platform for Complete Hospital Operations"**

SHOS Mobile is a production-grade React Native & Expo cross-platform mobile application engineered for hospital clinical, operational, and administrative workflows under NABH and Indian healthcare operational standards.

---

## 🚀 Key Highlights & Capabilities

- **15 Discrete Hospital Personas**: Tailored dashboards and workflows for:
  1. **Patient Portal**: UHID e-Card, OPD doctor search, slot booking, live token queue with ETA wait timer, active eRx prescriptions, NABL lab diagnostic reports, hospital invoicing with TPA claim settlement, admitted bed status in Ward A, 🚨 Emergency SOS trauma desk, and real-time ambulance GPS radar.
  2. **Doctor / Consultant Terminal**: Today's appointments, live queue calling, bedside vitals (BP, Pulse, SpO2, Temp), clinical examination notes, digital eRx prescription creator, lab investigation requisitions, and inter-department referral / ward admission.
  3. **Nursing Officer Station**: Inpatient ward census, telemetry vitals due alerts, medication administration schedule, and interactive bedside vitals entry modal.
  4. **Ward Boy / Patient Care Assistant (PCA)**: Wheelchair & stretcher transfers with a complete workflow pipeline (`Accept` ➔ `Start` ➔ `Complete`).
  5. **Pathology & Lab Technician**: Sample requisition queue, barcode tracking, and quantitative bio-marker findings sign-off modal.
  6. **Pharmacist**: Active eRx dispensary queue, batch number validation, automated inventory deduction, and low-stock alerts.
  7. **Ambulance Pilot / EMT**: On/Off duty toggle, GPS telemetry navigation, and 5-stage mission state machine (`Dispatched` ➔ `En Route` ➔ `At Scene` ➔ `In Transit` ➔ `Reached ER Trauma Bay`).
  8. **Housekeeping & Sanitization**: Bed turnover queue, terminal disinfection checklist, and one-tap certification releasing beds for new admissions.
  9. **Parking Staff**: Slot capacity tracking (Zone A/B, Emergency Bay), fast vehicle entry pass generator with digital QR code.
  10. **Receptionist**: Walk-in registration, fast-track UHID generator, token dispensing, and bed admission coordination.
  11. **Billing Executive**: Cash desk, POS card settlement, TPA insurance claim deduction, and GST tax invoice generation.
  12. **HR / Staff Manager**: 24x7 workforce attendance, shortage alerts, and weekly shift matrix calendar.
  13. **Department HOD**: Clinical throughput, Cath Lab cases, active faculty on duty, and quality audit exports.
  14. **Hospital Admin (Command Center)**: Executive command center with tomorrow's hospital plan, predictive surge forecasting, bed census, blood bank reserves, and biomedical oxygen plant telemetry.
  15. **Super Admin (Apex Governance)**: Multi-campus network health, immutable electronic EHR audit trail, and SIEM security surveillance.

- **⚡ Instant 1-Tap Dev Persona Switcher**:
  - Tap the **`Role`** badge in the header or use the Persona Switcher button on any screen to switch instantly between all 15 roles without repeated sign-in/sign-out.

- **🛡️ Clinical & AI Safety Guarantee**:
  - Assistive AI decision support with mandatory human verification (`Approve & Apply` / `Reject`).
  - Zero backend/database modifications. Zero exposed secret keys.
  - Complete mock data in `src/mock/` with Axios service abstraction layer in `src/services/` ready for future API integration.

---

## 📱 How to Run

### 1. Run in Web Browser (Instant Preview)
```bash
cd shos-mobile
npm run web
```
or:
```bash
npx expo start --web
```

### 2. Run on Physical Device (Android or iOS)
1. Install **Expo Go** from Google Play Store or Apple App Store.
2. In the `shos-mobile` directory, run:
```bash
npx expo start
```
3. Scan the generated QR code in your Expo Go app.

---

## 📂 Project Architecture

```
shos-mobile/
├── App.js                         # Root application provider wrapper
├── package.json
├── src/
│   ├── api/
│   │   └── client.js              # Centralized Axios client with JWT interceptor
│   ├── constants/
│   │   ├── colors.js              # Hospital Blue, Teal, Triage Red/Amber/Green
│   │   ├── roles.js               # 15 Roles definitions and demo presets
│   │   └── typography.js          # Typography scale and touch targets
│   ├── context/
│   │   ├── AuthContext.js         # Session persistence & role switcher state
│   │   ├── NotificationContext.js # Role-filtered notification stream
│   │   └── HospitalDataContext.js # Reactive clinical state (beds, queue, appointments, etc.)
│   ├── mock/                      # Centralized mock clinical & operational data
│   ├── services/                  # 15 API-ready service wrappers
│   ├── components/
│   │   ├── common/                # Button, Input, SearchBar, Card, Header, Modal, etc.
│   │   └── hospital/              # PatientCard, DoctorCard, QueueCard, BedCard, AIRecommendationCard, etc.
│   ├── navigation/
│   │   ├── AuthNavigator.js       # Stack for Splash, Welcome, Login, Register, OTP, etc.
│   │   ├── RoleNavigators.js      # Individual navigators for all 15 hospital roles
│   │   ├── RoleSwitcherModal.js   # Fast 1-tap persona switcher modal
│   │   └── RootNavigator.js       # Orchestrator
│   └── screens/
│       ├── auth/                  # 7 screens (Splash, Welcome, Login, Register, etc.)
│       ├── patient/               # 11 screens (Dashboard, Booking, Queue, Reports, SOS, etc.)
│       ├── doctor/                # 3 screens + 4 clinical modals
│       ├── nurse/                 # 2 screens + vitals modal
│       ├── wardboy/               # 1 screen (Task workflow pipeline)
│       ├── lab/                   # 1 screen + result entry modal
│       ├── pharmacy/              # 1 screen + dispensing flow
│       ├── ambulance/             # 1 screen (Live GPS state machine)
│       ├── housekeeping/          # 1 screen (Sanitization turnover)
│       ├── parking/               # 1 screen (Zone matrix & QR pass)
│       ├── reception/             # 1 screen (Walk-in UHID registration)
│       ├── billing/               # 1 screen (TPA deduction & settlement)
│       ├── hr/                    # 1 screen (Workforce & shift calendar)
│       ├── department/            # 1 screen (HOD throughput)
│       ├── admin/                 # 6 screens (Command Center, Tomorrow Plan, AI Hub, etc.)
│       ├── superadmin/            # 3 screens (Multi-campus, Audit Logs, SIEM)
│       └── common/                # NotificationsScreen & SettingsScreen
```
