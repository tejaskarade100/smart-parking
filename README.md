# Park-Ease : Smart Parking Solution

## 🔎 Overview

**Parkease** is a modern, user-friendly smart parking solution that simplifies the process of finding and booking parking spaces. It provides real-time availability, location details, and convenient booking options, ensuring a hassle-free experience for drivers. Parking space owners can efficiently manage their listings via the platform, making parking smarter for everyone.

## :sparkles: Features

### For Users
- 🔍 Real-time parking spot search and availability
- 📱 QR-based spot access and verification
- 💳 Secure online payments
- 🎫 Digital parking tickets
- 📍 GPS-based nearby parking locations
- 📅 Advance booking capability
- 📱 Cross-platform mobile app support

### For Parking Owners
- 📊 Dashboard for spot management
- 💰 Revenue tracking and analytics
- 🔄 Real-time booking updates
- 👥 User management system
- 📈 Occupancy statistics


## 🛠️ Tech Stack
### Website (Client & Server)
- **Frontend**: React, Vite, Tailwind CSS, JSX
- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB
- **Authentication**: JWT, OAuth

### App (Mobile)
- **Frontend**: Flutter (Dart)
- **Backend**: Firebase


## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB
- Flutter SDK
- Android Studio / Xcode

## :gear: Steps to Run Locally

### Website (Client)
1. Clone the repository:
    ```bash
    git clone https://github.com/tejaskarade100/smart-parking.git
    cd parkase
    ```
2. Navigate to the `client` folder:
    ```bash
    cd client
    ```
3. Install dependencies :
    ```bash
    npm install
    ```
    (use npm legacy peers if dependencies fail to install)

    ```bash
    npm install --legacy-peer-deps
    ```
4. Run the client:
    ```bash
    npm run dev
    ```

### Website (Server)
1. Navigate to the `server` folder:
    ```bash
    cd server
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Run the server:
    ```bash
    npm run dev
    ```

### App (Mobile : Frontend only)
1. Clone the repository:
    ```bash
    git clone https://github.com/tejaskarade100/smart-parking.git
    cd parkase
    ```
2. Navigate to the `parking_app` folder:
    ```bash
    cd parking_app
    ```
3. Install Flutter dependencies:
    ```bash
    flutter pub get
    ```
4. Run the app:
    ```bash
    flutter run
    ```

---

## :file_folder: Sample `.env` File Structure

```env
# MongoDB Connection (Local or Online)
MONGODB_URI=mongodb://localhost:27017/parkase
DB_NAME=parkase

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret

PORT=5000
```

---

## 💾 MongoDB Setup

### Local Setup
1. Install MongoDB Community Server
2. Start MongoDB service
3. Use connection string: mongodb://localhost:27017/parkease

### OR

### Cloud Setup (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Add to .env file

---

## 📸 Demo Screenshots

### Home Page
![Home Page](https://drive.google.com/file/d/1kA5R3xJ_Q-LMXp5h356hd4lmJIM9VCUv/view?usp=sharing)

### User Dashboard
![Dashboard](link_to_dashboard_screenshot)

### Booking Interface
![Booking](link_to_booking_screenshot)

### Booking Confirmation
![Confirmation](link_to_confirmation_screenshot)

### Admin Dashboard
![Admin Dashboard](link_to_admin_dashboard_screenshot)

---

## Contributors 🤝

- [Jayesh Lambdade](https://github.com/JayeshL07) (@JayeshL07)
- [Tejas Karade](https://github.com/tejaskarade100) (@tejaskarade100)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
