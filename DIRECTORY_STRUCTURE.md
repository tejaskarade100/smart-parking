# DIRECTORY_STRUCTURE

---

## Website Directory (Client and Server)
```
└── tejaskarade100-smart-parking/
    ├── README.md
    ├── client/
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── tailwind.config.js
    │   ├── vite.config.js
    │   ├── .gitignore
    │   ├── public/
    │   │   └── images/
    │   └── src/
    │       ├── App.css
    │       ├── App.jsx
    │       ├── index.css
    │       ├── main.jsx
    │       ├── api/
    │       │   └── axios.js
    │       ├── assets/
    │       ├── components/
    │       │   ├── AnimatedSection.jsx
    │       │   ├── BookNow.jsx
    │       │   ├── BookingConfirmation.jsx
    │       │   ├── BookingForm.jsx
    │       │   ├── Footer.jsx
    │       │   ├── Header.jsx
    │       │   ├── HowItWorks.jsx
    │       │   ├── LoginPage.jsx
    │       │   ├── ParkingLocationCard.jsx
    │       │   ├── ParkingMap.jsx
    │       │   ├── Profile.jsx
    │       │   ├── SearchForm.jsx
    │       │   ├── SplashScreen.jsx
    │       │   ├── AboutUs/
    │       │   │   ├── CtaSection.jsx
    │       │   │   ├── FeaturesSection.jsx
    │       │   │   ├── HeroSection.jsx
    │       │   │   ├── ProblemSection.jsx
    │       │   │   ├── SolutionSection.jsx
    │       │   │   └── VisionSection.jsx
    │       │   ├── Admin/
    │       │   │   ├── AdminHeader.jsx
    │       │   │   ├── AdminLayout.jsx
    │       │   │   ├── AdminProfile.jsx
    │       │   │   ├── BookingsList.jsx
    │       │   │   ├── MainContent.jsx
    │       │   │   ├── OfflineBooking.jsx
    │       │   │   ├── ParkingStatusVisualization.jsx
    │       │   │   ├── Sidebar.jsx
    │       │   │   └── StatCard.jsx
    │       │   ├── AdminRegistration/
    │       │   │   ├── Credentials.jsx
    │       │   │   ├── ParkingDetails.jsx
    │       │   │   ├── PersonalInformation.jsx
    │       │   │   ├── ReviewAndSubmit.jsx
    │       │   │   ├── SecurityAndAccess.jsx
    │       │   │   └── VerificationDetails.jsx
    │       │   └── ParkingCategories/
    │       │       ├── CategoryCard.jsx
    │       │       ├── DetailModal.jsx
    │       │       ├── Footer.jsx
    │       │       ├── Header.jsx
    │       │       └── data/
    │       │           └── categories.js
    │       ├── context/
    │       │   └── AuthContext.jsx
    │       └── pages/
    │           ├── AdminBookings.jsx
    │           ├── AdminDashboard.jsx
    │           ├── Dashboard.jsx
    │           ├── Home.jsx
    │           ├── LoginPage.jsx
    │           ├── ParkingAdminRegistrationForm.jsx
    │           ├── ParkingCategoriesPage.jsx
    │           └── about-us.jsx
    │──server/
        ├── index.js
        ├── package-lock.json
        ├── package.json
        ├── server.js
        ├── .env.sample
        ├── .gitignore
        ├── config/
        │   └── db.js
        ├── controllers/
        │   └── authController.js
        ├── middleware/
        │   ├── auth.js
        │   └── authMiddleware.js
        ├── models/
        │   ├── Admin.js
        │   ├── Booking.js
        │   ├── Stats.js
        │   ├── User.js
        │   └── Vehicle.js
        └── routes/
            ├── admin.js
            ├── auth.js
            ├── authRoutes.js
            └── user.js
```
---

## App Directory (Parking_App)
```
 ├── parking_app/
    │   ├── README.md
    │   ├── analysis_options.yaml
    │   ├── pubspec.lock
    │   ├── pubspec.yaml
    │   ├── .gitignore
    │   ├── .metadata
    │   ├── android/
    │   ├── ios/
    │   ├── lib/
    │   │   ├── main.dart
    │   │   ├── data/
    │   │   │   ├── categories.dart
    │   │   │   └── dummy_data.dart
    │   │   ├── models/
    │   │   │   ├── booking.dart
    │   │   │   ├── category_model.dart
    │   │   │   ├── parking_spot.dart
    │   │   │   └── user.dart
    │   │   ├── screens/
    │   │   │   ├── admin_dashboard_screen.dart
    │   │   │   ├── admin_registration_screen.dart
    │   │   │   ├── booking_confirmation_screen.dart
    │   │   │   ├── booking_form_screen.dart
    │   │   │   ├── booking_screen.dart
    │   │   │   ├── home_screen.dart
    │   │   │   ├── login_screen.dart
    │   │   │   ├── map_screen.dart
    │   │   │   ├── parking_category_screen.dart
    │   │   │   ├── splash_screen.dart
    │   │   │   ├── user_dashboard.dart
    │   │   │   ├── user_dashboard_screen.dart
    │   │   │   └── user_registration_screen.dart
    │   │   ├── services/
    │   │   │   ├── auth_service.dart
    │   │   │   └── booking_service.dart
    │   │   └── widgets/
    │   │       ├── category_card.dart
    │   │       ├── custom_button.dart
    │   │       ├── detail_modal.dart
    │   │       ├── footer.dart
    │   │       ├── header.dart
    │   │       └── parking_spot_card.dart
    │   ├── linux/
    │   ├── macos/
    │   ├── test/
    │   ├── web/
    │   └── windows/
   


```
