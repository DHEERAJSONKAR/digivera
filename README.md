# DIGIVERA - Digital Identity & Footprint Monitoring Platform

Complete MERN stack SaaS application for monitoring digital footprint, data breaches, and online reputation.

---

## 🚀 Features

### Core Features
- **User Authentication**
  - Email/Password registration and login
  - Google OAuth integration
  - Phone OTP authentication
  - Magic link authentication
  - Password reset with email
  - JWT-based authentication

- **Digital Footprint Scanning**
  - Scan by email or name
  - Data breach detection
  - Public mentions tracking
  - Exposed accounts discovery
  - Risk score calculation (0-100)
  - Automated monthly scans for Pro users

- **Real-time Alerts**
  - Security breach notifications
  - Exposure alerts
  - Severity-based filtering (High/Medium/Low)
  - Mark as read functionality
  - Alert history

- **User Dashboard**
  - Risk score overview
  - Latest scan results
  - Quick actions
  - Recent alerts
  - Plan status

- **Subscription Plans**
  - **Free Plan**: 1 scan per month
  - **Pro Plan** (₹299/month): Unlimited scans + Auto-monitoring
  - Razorpay integration (India)
  - Stripe integration (Global)

- **Profile Management**
  - Update name and email
  - Change password
  - View subscription details
  - Account deletion

---

## 📁 Project Structure

```
digivera/
├── server/               # Backend Node.js/Express API
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & error middleware
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Helper functions
│   │   ├── config/       # Configuration
│   │   └── app.js        # Express app setup
│   ├── server.js         # Entry point
│   ├── package.json
│   └── .env              # Environment variables
│
└── client/               # Frontend React/Vite app
    ├── src/
    │   ├── pages/        # Page components
    │   │   ├── auth/     # Authentication pages
    │   │   ├── Dashboard.jsx
    │   │   ├── Scan.jsx
    │   │   ├── Alerts.jsx
    │   │   ├── History.jsx
    │   │   ├── Profile.jsx
    │   │   └── LandingPage.jsx
    │   ├── components/   # Reusable components
    │   │   ├── auth/     # Auth components
    │   │   └── dashboard/ # Dashboard components
    │   ├── utils/        # API & helpers
    │   ├── App.jsx       # Main app component
    │   └── main.jsx      # Entry point
    ├── package.json
    └── .env              # Environment variables
```

---

## 🛠️ Tech Stack

### Backend
- **Node.js** v18+
- **Express.js** - Web framework
- **MongoDB** - Database (Mongoose ODM)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Razorpay** - Payment gateway (India)
- **Stripe** - Payment gateway (Global)
- **Google Auth Library** - OAuth
- **Node-cron** - Scheduled tasks

### Frontend
- **React** 18.2.0
- **Vite** 5.x - Build tool
- **React Router** 6.x - Routing
- **Tailwind CSS** 3.4.1 - Styling
- **Axios** - HTTP client
- **@react-oauth/google** - Google OAuth
- **Heroicons** - Icons

---

## 📦 Installation

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local or Atlas cloud)
- **npm** or **yarn**
- **Git**

### 1. Clone Repository
```bash
git clone <repository-url>
cd digivera
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure `server/.env`:**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/digivera?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_change_this
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Razorpay (India)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Stripe (Global)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

**Important Notes:**
- **MongoDB**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Gmail App Password**: Enable 2FA and generate app-specific password
- **Razorpay**: Get test keys from [Razorpay Dashboard](https://dashboard.razorpay.com/)
- **Stripe**: Get test keys from [Stripe Dashboard](https://dashboard.stripe.com/)

### 3. Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure `client/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Production Mode

**Build Frontend:**
```bash
cd client
npm run build
```

**Start Backend:**
```bash
cd server
npm start
```

---

## 🔑 Google OAuth Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google+ API**

### 2. Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth Client ID**
3. Choose **Web Application**
4. Add Authorized JavaScript Origins:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
5. Add Authorized Redirect URIs:
   - `http://localhost:5173`
   - `https://yourdomain.com`
6. Copy **Client ID** to both `.env` files

**Detailed Guide:** See `client/GOOGLE_OAUTH_SETUP.md`

---

## 📧 Email Setup (Gmail)

### 1. Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**

### 2. Generate App Password
1. Go to **App Passwords** section
2. Select **Mail** and **Other (Custom name)**
3. Enter "DIGIVERA" as the name
4. Copy the 16-character password
5. Use this in `server/.env` as `EMAIL_PASS`

---

## 💳 Payment Gateway Setup

### Razorpay (Indian Users)
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get **Test Key ID** and **Test Key Secret** from Dashboard
3. Add to `server/.env`
4. Plan: **Pro Plan - ₹299/month**

### Stripe (Global Users)
1. Sign up at [Stripe](https://stripe.com/)
2. Get **Test Secret Key** from Dashboard
3. Add to `server/.env`
4. Plan: **Pro Plan - $5/month**

---

## 📱 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password/:token - Reset password
POST   /api/auth/google            - Google OAuth login
POST   /api/auth/phone/send-otp    - Send OTP
POST   /api/auth/phone/verify-otp  - Verify OTP
POST   /api/auth/magic-link/send   - Send magic link
GET    /api/auth/magic-link/verify/:token - Verify magic link
```

### Profile
```
GET    /api/me                     - Get user profile
PUT    /api/me                     - Update profile
DELETE /api/me                     - Delete account
```

### Scanning
```
POST   /api/scan                   - Run new scan
GET    /api/scan/latest            - Get latest scan
GET    /api/scan/history           - Get scan history
```

### Alerts
```
GET    /api/alerts                 - Get all alerts
PATCH  /api/alerts/:id/read        - Mark alert as read
DELETE /api/alerts/:id             - Delete alert
```

### Subscription
```
POST   /api/subscribe/razorpay/create - Create Razorpay order
POST   /api/subscribe/razorpay/verify - Verify Razorpay payment
POST   /api/subscribe/stripe/create   - Create Stripe checkout
POST   /api/subscribe/stripe/webhook  - Stripe webhook
GET    /api/subscribe/status          - Get subscription status
```

---

## 🎨 Frontend Routes

### Public Routes
```
/                   - Landing page
/register           - Registration
/login              - Login
/forgot-password    - Forgot password
/reset-password/:token - Reset password
```

### Protected Routes (Require Login)
```
/dashboard          - Main dashboard
/scan               - Run new scan
/history            - Scan history
/alerts             - Security alerts
/profile            - User profile settings
```

---

## 🧪 Testing

### Test User Accounts
Create test accounts and verify:
- Email/password registration
- Login and JWT token storage
- Dashboard data loading
- Scan functionality
- Alert notifications

### Test Payments
Use test card numbers:
- **Razorpay**: 4111 1111 1111 1111 (Any CVV, Future date)
- **Stripe**: 4242 4242 4242 4242 (Any CVV, Future date)

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```bash
# Check MongoDB URI format
mongodb+srv://username:password@cluster.mongodb.net/digivera

# Ensure IP whitelist (0.0.0.0/0 for testing)
```

**Port Already in Use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in server/.env
```

**Email Not Sending:**
- Verify Gmail App Password (not regular password)
- Check 2FA is enabled
- Try different SMTP settings

### Frontend Issues

**CORS Errors:**
- Ensure backend `FRONTEND_URL` matches frontend URL
- Check `cors()` is configured in `server/src/app.js`

**Google OAuth origin_mismatch:**
- Add `http://localhost:5173` to Google Cloud Console
- See `client/GOOGLE_OAUTH_SETUP.md`

**Dark Mode Not Working:**
- Ensure Tailwind config has `darkMode: 'class'`
- Check DarkModeToggle component

---

## 📈 Features to Add (Future)

- [ ] Social media account linking
- [ ] Advanced breach database integration
- [ ] Real-time dark web monitoring
- [ ] Export reports as PDF
- [ ] Email notifications for new alerts
- [ ] Two-factor authentication (2FA)
- [ ] API rate limiting
- [ ] Admin dashboard
- [ ] Multi-language support

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to Git
2. Use **strong JWT secrets** (min 32 characters)
3. Enable **HTTPS** in production
4. Use **Helmet.js** for security headers
5. Implement **rate limiting** on auth routes
6. **Sanitize** user inputs
7. Keep **dependencies updated**
8. Use **prepared statements** for database queries

---

## 📄 License

This project is proprietary and confidential.

---

## 👨‍💻 Developer

**Dheeraj Sonkar**  
Email: dheerajsonkarmy@gmail.com

---

## 🆘 Support

For issues or questions:
1. Check this README
2. Review `GOOGLE_OAUTH_SETUP.md` for OAuth issues
3. Check console errors in browser/terminal
4. Contact developer

---

## 🎯 Quick Start Commands

```bash
# Clone and install
git clone <repo-url> && cd digivera
cd server && npm install && cd ../client && npm install

# Configure environment
# Edit server/.env and client/.env with your credentials

# Run both servers (in separate terminals)
cd server && npm run dev
cd client && npm run dev

# Open browser
http://localhost:5173
```

---

## ✅ Deployment Checklist

### Backend
- [ ] Update MongoDB URI to production cluster
- [ ] Set strong JWT_SECRET
- [ ] Configure production email settings
- [ ] Update FRONTEND_URL to production domain
- [ ] Set up payment webhook URLs
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging

### Frontend
- [ ] Update VITE_API_URL to production API
- [ ] Configure Google OAuth for production domain
- [ ] Build production bundle (`npm run build`)
- [ ] Deploy to Vercel/Netlify
- [ ] Set up custom domain
- [ ] Enable CDN

---

**Version:** 1.0.0  
**Last Updated:** February 2026
