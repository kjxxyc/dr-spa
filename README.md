# Dradonis Landing Page + System

A modern marketing website and integrated telemedicine platform for Dradonis. This project combines a high-converting landing page with a full-featured patient portal and provider dashboard using Angular.

## ✨ Features

### Marketing Site (dradonis.com)
- **Homepage:** Eye-catching hero section, features, and clear CTAs
- **Prescription Refills:** Fast-track refills for existing patients
- **Tadalafil Page:** Educational content and online evaluation
- **About Page:** Information about the clinic and brand story
- **Contact Page:** Contact form and location details

### Patient Portal
- **Appointment Booking:** Schedule consultations with available providers
- **Prescription Management:** Track active prescriptions and request refills
- **Consultation Chat:** Real-time messaging with healthcare providers
- **Medical History:** Complete patient records and treatment history
- **Profile Management:** Personal information and notification preferences

### Provider Dashboard
- **Appointment Management:** View and manage patient appointments
- **Patient Management:** Detailed patient records and information
- **Consultation Management:** Handle patient chat and treatment plans
- **Medical Records:** Comprehensive treatment history
- **Clinical Tools:** Clinical notes and documentation tools

## 🚀 Tech Stack

### Frontend
- **Framework:** Angular 21
- **UI Components:** Angular Material
- **Styling:** SCSS with modern design system
- **State Management:** Angular Services + RxJS
- **Forms:** Reactive Forms with validation
- **Testing:** Karma, Jasmine, Protractor

### Backend
- **Framework:** Node.js + Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT + bcrypt.js
- **Security:** CORS, Helmet, rate limiting
- **Validation:** Joi schemas
- **Utilities:** date-fns, validator.js

## 📂 Project Structure

```
/dradonis-SPA              # Angular Frontend
  ├── src/
  │   ├── app/
  │   │   ├── pages/
  │   │   │   ├── landing/
  │   │   │   ├── patient-portal/
  │   │   │   └── provider-dashboard/
  │   │   ├── services/
  │   │   ├── components/
  │   │   ├── models/
  │   │   └── ...
  │   └── ...
  │
  ├── public/
  │   ├── landing-page.html      # Marketing site entry
  │   └── ...
  │
  └── server.js               # Express backend
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB (local or cloud)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/dradonis-webapp.git
cd dradonis-webapp
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd dradonis-SPA
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/dradonis

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1h

# Server Configuration
PORT=3000

# Frontend Public URL (for CORS)
FRONTEND_URL=http://localhost:4200
```

### 4. Run the Application
```bash
# Start backend
npm run start:dev

# Start frontend in parallel
npm run start:frontend
```

The application will be available at:
- Marketing Site: `http://localhost:4200`
- Backend API: `http://localhost:3000`
- Patient Portal: `http://localhost:4200/patient`
- Provider Dashboard: `http://localhost:4200/provider`

### 5. Test Credentials

**Admin/Provider:**
```
Email: [EMAIL_ADDRESS]
Password: password123
```

**Patient:**
```
Email: [EMAIL_ADDRESS]
Password: password123
```

## 🎯 Development

### Frontend Development
```bash
# Serve frontend with hot-reload
npm run start:frontend

# Build for production
npm run build:frontend

# Run tests
npm run test:frontend
```

### Backend Development
```bash
# Start development server
npm run start:dev

# Run tests
npm run test:backend

# View MongoDB connection status
npm run db:check
```

### Full Stack Development
```bash
# Start both frontend and backend
npm run dev

# Production build
npm run build:production

# Production server
npm run start:production
```

## 📁 Component Organization

### Landing Page Components
```
dradonis-SPA/src/app/pages/landing/
  ├── home/
  ├── prescription-refills/
  ├── tadalafil/
  ├── about/
  └── contact/
```

### Patient Portal Components
```
dradonis-SPA/src/app/pages/patient-portal/
  ├── dashboard/
  ├── appointments/
  ├── prescriptions/
  ├── chat/
  └── profile/
```

### Provider Dashboard Components
```
dradonis-SPA/src/app/pages/provider-dashboard/
  ├── dashboard/
  ├── appointments/
  ├── patients/
  ├── chat/
  ├── records/
  └── profile/
```

### Common Services
```
dradonis-SPA/src/app/services/
  ├── api.service.ts            # HTTP client
  ├── auth.service.ts           # Authentication
  ├── appointment.service.ts    # Appointments
  ├── prescription.service.ts   # Prescriptions
  ├── chat.service.ts           # Real-time chat
  ├── error.service.ts          # Error handling
  └── ...
```

## 🔒 Security

### Security Features
- **Authentication:** JWT-based authentication with proper token storage
- **Authorization:** Role-based access control (patient, provider, admin)
- **Input Validation:** Joi schemas on the backend
- **CORS:** Proper cross-origin resource sharing configuration
- **Security Headers:** Helmet middleware for production
- **Rate Limiting:** Protect against brute-force attacks
- **Password Hashing:** bcrypt.js with 10 salt rounds
- **HTTPS:** SSL/TLS support in production

## 📦 Deployment

### Production Build
```bash
# Build frontend for production
npm run build:frontend

# Start production server
npm run start:production
```

### Deployment Options
- **Vercel:** Deploy frontend as static site + serverless backend
- **Heroku:** Deploy backend with Node.js buildpack + static frontend
- **AWS:** S3 for frontend, EC2/ECS for backend, RDS for database
- **DigitalOcean:** Droplet for backend + S3 storage

## 🧪 Testing

### Angular Unit Tests
```bash
cd dradonis-SPA
npm run test:frontend
```

### Backend Unit Tests
```bash
npm run test:backend
```

### E2E Tests (Protractor)
```bash
npm run e2e:frontend
```

## 📄 License

Private project - All rights reserved

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Submit a pull request
4. Ensure tests pass
5. Follow Angular and backend coding standards

## 📞 Support

For issues or questions:
- Check the [issues tracker](https://github.com/yourusername/dradonis-webapp/issues)
- Review the [documentation](docs/)
- Contact the development team at [EMAIL_ADDRESS]`

## 🔗 Links

- [Project Website](https://www.dradonis.com)
- [Patient Portal](https://www.
