# Dr. Adonis - Medical Forms

This project contains two Angular-based medical forms:
1. **Vitamins Prescription Form** (`/vitamins-prescription`) - For requesting vitamin protocols.
2. **Men's Wellness Evaluation Form** (`/men-wellness`) - For assessing suitability for Tadalafil (Cialis).

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

### Men's Wellness Evaluation Form (Tadalafil)
- **Route**: `/men-wellness`
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
│   │       ├── tadalafil-evaluation/  # Men's Wellness form (route: /men-wellness)
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

### Men's Wellness Evaluation Form
- 3-section flow:
  1. **Contact Info** — Name + Email + security message (Meta Pixel `Lead` fires here)
  2. **Medical Questions** — Stepper with personal info + 8 medical questions
  3. **Payment** — Contact details + Clover payment (Meta Pixel `Purchase` fires here)
- Cardiovascular risk assessment
- Payment integration (Clover)
- EmailJS integration for notifications
- Bilingual support (English/Spanish)

## 🔒 Meta Pixel Integration

- **Global pixel** (`index.html`): Fires `PageView` on all pages **except** `/men-wellness` and `/vitamins-prescription`
- **Men's Wellness form**: Pixel is dynamically injected in Section 1 only (fires `Lead`). Section 3 fires `Purchase` on Clover payment.
- **Vitamins form**: No pixel tracking
- **Facebook Domain Verification**: Meta tag added to `<head>` in `index.html`

## 📝 Notes

- Both forms use EmailJS for email notifications
- Ensure EmailJS is properly configured before deploying
- Forms support both English and Spanish languages
