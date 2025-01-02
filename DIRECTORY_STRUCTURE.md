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
```
---

## App Directory (Parking_App)
```
└── parking_app/
    ├── README.md
    ├── analysis_options.yaml
    ├── pubspec.lock
    ├── pubspec.yaml
    ├── .gitignore
    ├── .metadata
    ├── android/
    │   ├── gradle.properties
    │   ├── app/
    │   │   └── src/
    │   │       ├── debug/
    │   │       │   └── AndroidManifest.xml
    │   │       ├── main/
    │   │       │   ├── AndroidManifest.xml
    │   │       │   ├── kotlin/
    │   │       │   │   └── com/
    │   │       │   │       └── example/
    │   │       │   │           └── parking_app/
    │   │       │   │               └── MainActivity.kt
    │   │       │   └── res/
    │   │           ├── drawable/
    │   │           │   └── launch_background.xml
    │   │           └── values/
    │   │               └── styles.xml
    │   └── gradle/
    │       └── wrapper/
    │           └── gradle-wrapper.properties
    ├── ios/
    │   ├── Runner/
    │   │   ├── AppDelegate.swift
    │   │   ├── Info.plist
    │   │   ├── Assets.xcassets/
    │   │   │   └── AppIcon.appiconset/
    │   │   │       └── Contents.json
    │   │   └── Base.lproj/
    │   │       ├── LaunchScreen.storyboard
    │   │       └── Main.storyboard
    ├── lib/
    │   ├── main.dart
    │   ├── data/
    │   │   ├── categories.dart
    │   │   └── dummy_data.dart
    │   ├── models/
    │   │   ├── booking.dart
    │   │   └── user.dart
    │   ├── screens/
    │   │   ├── admin_dashboard_screen.dart
    │   │   ├── booking_form_screen.dart
    │   │   └── splash_screen.dart
    │   ├── services/
    │   │   ├── auth_service.dart
    │   │   └── booking_service.dart
    │   └── widgets/
    │       ├── category_card.dart
    │       ├── custom_button.dart
    │       └── parking_spot_card.dart
```
