# Dr. Adonis - Medical Forms

This project contains two Angular-based medical forms:
1. **Vitamins Prescription Form** - For requesting vitamin protocols.
2. **Tadalafil Evaluation Form** - For assessing suitability for Tadalafil (Cialis).

## 📋 Prerequisites

- **Node.js** (v18 or higher recommended)
- **Angular CLI** (`npm install -g @angular/cli`)
- **EmailJS Account** (for email notifications)

## 🚀 Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dradonis-SPA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure EmailJS**
   - Create an account at [EmailJS](https://www.emailjs.com/)
   - Add your email service and template
   - Update the following values in the components:
     - `serviceId`
     - `templateId`
     - `publicKey`

## 🛠️ Configuration

### Vitamins Prescription Form
- **File**: `src/app/pages/authentication/vitamins-prescription/vitamins-prescription.component.ts`
- **EmailJS Config**: Lines 375-377

### Tadalafil Evaluation Form
- **File**: `src/app/pages/authentication/tadalafil-evaluation/tadalafil-evaluation.component.ts`
- **EmailJS Config**: Lines 235-237

## 🏃 Running the App

```bash
# Development mode
ng serve

# Build for production
ng build --configuration production
```

## 📂 Project Structure

```
src/
├── app/
│   ├── pages/
│   │   └── authentication/
│   │       ├── tadalafil-evaluation/  # Tadalafil evaluation form
│   │       └── vitamins-prescription/   # Vitamins prescription form
│   └── ...
└── assets/
    └── images/
        ├── tadalafil-banner.png
        └── vitamins-banner.png
```

## 🎨 Features

### Vitamins Prescription Form
- Multi-step form with 5 steps
- Symptom and allergy selection
- EmailJS integration for notifications
- Bilingual support (English/Spanish)

### Tadalafil Evaluation Form
- Multi-step form with 5 steps
- Cardiovascular risk assessment
- Payment integration (PayPal/Clover)
- EmailJS integration for notifications
- Bilingual support (English/Spanish)

## 📝 Notes

- Both forms use EmailJS for email notifications
- Ensure EmailJS is properly configured before deploying
- Forms support both English and Spanish languages
