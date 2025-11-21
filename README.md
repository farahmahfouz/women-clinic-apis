# **Women Clinic - Clinic Booking & Management System**

**Women Clinic** is a comprehensive clinic booking and management system built with the following technologies:

- **Node.js**: Runtime environment for executing JavaScript.
- **Express**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing and retrieving data.
- **Mongoose**: ODM for MongoDB, providing a schema-based solution to model data.

---

## **Features**

Women Clinic offers a robust set of features for managing clinic operations:

### 1. **User Authentication and Authorization**

   - **Sign up**: Patients can register for an account.
   - **Login**: Registered users can log in with email and password.
   - **Role-based Access Control**: Different user roles (patient, doctor, employee, admin) with specific permissions.

### 2. **User Profile Management**

   - Users can view and update their profiles.
   - Patients can view their booking history.
   - Admins can manage all users including doctors and employees.

### 3. **Service Management**

   - **Services**: Admins can create and manage clinic services (e.g., Gynecology, Dermatology).
   - **Service Options**: Each service can have multiple options with different pricing (session, package, pulse, etc.).
   - Service ratings and reviews system.

### 4. **Doctor Schedule Management**

   - Doctors can set their weekly availability schedules.
   - Configure working hours and time slots for each day.
   - Set days off for holidays or personal time.
   - Automatic validation of doctor availability when booking.

### 5. **Appointment Booking System**

   - Patients can book appointments with doctors.
   - **Multi-service Booking**: Book multiple services in a single appointment.
   - **Availability Validation**: System automatically checks doctor availability before confirming bookings.
   - **Conflict Prevention**: Prevents double-booking at the same time slot.
   - Booking status management: pending, confirmed, cancelled, completed.

### 6. **Reviews and Ratings**

   - Patients can leave reviews and ratings for services.
   - Automatic calculation of average ratings for each service.
   - One review per user per service policy.

### 7. **Clinic Settings**

   - Manage clinic information (name, email, phone).
   - Configure clinic location with Google Maps integration.
   - Set working hours.
   - Manage social media links.
   - Upload clinic logo, cover images, and gallery images.

### 8. **Statistics and Analytics**

   - **Monthly Booking Statistics**: View booking statistics by month including revenue, number of bookings, doctors, and patients.
   - **Most Booked Services**: Analytics on the most popular services with booking counts and revenue.

### 9. **CRUD Operations**

   - Perform Create, Read, Update, and Delete operations on the following models:
     - **Users**: For managing user data (patients, doctors, employees, admins).
     - **Services**: For managing available clinic services.
     - **Service Options**: For managing service variations and pricing.
     - **Bookings**: For managing appointments made by patients.
     - **Reviews**: For managing patient reviews.
     - **Doctor Schedules**: For managing doctor availability.
     - **Settings**: For managing clinic settings.

### 10. **Advanced Data Querying**

   - **Aggregation Pipelines**: Used for complex data queries and statistics.
   - **Population**: Automatic population of related data (user, doctor, services) in booking queries.
   - **Filtering**: Filter bookings by doctor, patient, date, status, etc.

### 11. **Error Handling**

   - Comprehensive error handling mechanism for capturing and displaying errors.
   - Custom error messages for better user experience.

### 12. **MVC Architecture**

   - The application follows the **Model-View-Controller (MVC)** architecture with Service layer for better separation of concerns.
   - Clean code structure with organized routes, controllers, services, and models.

---

## **Technologies Used**

- **Node.js**: Backend JavaScript runtime.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **bcryptjs**: Password hashing.
- **jsonwebtoken**: JWT authentication.
- **cookie-parser**: Cookie parsing middleware.
- **validator**: Data validation.
- **slugify**: URL slug generation.
- **morgan**: HTTP request logger.
- **dotenv**: Environment variables management.

---

## **Project Structure**

```
Women Clinic/
├── controllers/        # Request handlers
├── models/            # Database models (Mongoose schemas)
├── routes/            # API routes
├── services/          # Business logic layer
├── middlewares/       # Custom middlewares (auth, error handling)
├── utils/             # Utility functions
├── app.js             # Express app configuration
└── server.js          # Server entry point
```

---

## **Getting Started**

To get started with the Women Clinic project, follow these steps:

### 1. **Clone the repository**

```bash
git clone <https://github.com/farahmahfouz/women-clinic-apis.git>
cd "Women Clinic"
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Set up environment variables**

Create a `.env` file in the root directory and configure the following variables:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb+srv://<username>:<DATABASE_PASSWORD>@cluster.mongodb.net/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

### 4. **Run the server**

For development:
```bash
npm start
```

For production:
```bash
npm run start:prod
```

The server will start, and the API will be accessible at `http://localhost:3000`.

---

## **User Roles**

- **patient**: Can book appointments, leave reviews, manage their profile
- **doctor**: Can manage their schedule, view their bookings
- **employee**: Can book appointments for patients, view bookings
- **admin**: Full access to all features and data management

---

## **Future Features**

The following features are planned for future releases:

### 1. **Authentication & Security Enhancements**
   - Password reset functionality (forgot password)
   - Password change/update feature
   - Email verification system
   - Logout functionality with token blacklisting
   - Rate limiting to prevent brute force attacks
   - CORS configuration for better security
   - Helmet.js for additional security headers
   - Request size limiting
   - Data sanitization

### 2. **Booking System Improvements**
   - Pagination for booking lists
   - Advanced filtering (by date range, status, doctor, service)
   - Sorting options (by date, price, status)
   - Search functionality for bookings
   - Booking confirmation notifications
   - Appointment reminders (email/SMS)
   - Recurring appointments support
   - Waitlist functionality

### 3. **Notifications & Communication**
   - Email service integration (Nodemailer/SendGrid)
   - SMS service integration (Twilio)
   - In-app notification system
   - Push notifications
   - Email templates for various events

### 4. **Payment System**
   - Payment gateway integration (Stripe/PayPal)
   - Online payment processing for bookings
   - Payment history tracking
   - Invoices generation (PDF)
   - Payment receipts
   - Refund management

### 5. **File Upload & Media Management**
   - Profile picture uploads
   - Medical reports/document uploads
   - Image optimization
   - Cloud storage integration (AWS S3/Cloudinary)
   - File validation and security

### 6. **Code Quality & Testing**
   - Add `catchAsync` wrapper to all async controllers
   - Request validation with express-validator
   - Unit tests (Jest)
   - Integration tests
   - API documentation (Swagger/Postman)
   - Better error messages and validation

### 7. **Analytics & Reporting**
   - Doctor performance statistics
   - Revenue reports (daily, weekly, monthly, yearly)
   - Patient statistics and demographics
   - Service popularity analytics
   - Export data functionality (CSV, PDF, Excel)
   - Dashboard for admins

### 8. **Advanced Features**
   - Calendar integration (Google Calendar, Outlook)
   - Video consultation support
   - Patient medical history tracking
   - Prescription management
   - Lab results management
   - Multi-language support (i18n)
   - Dark mode theme
   - Mobile app (React Native/Flutter)

### 9. **Performance & Scalability**
   - Caching layer (Redis)
   - Database indexing optimization
   - API response compression
   - Lazy loading and pagination
   - Background job processing (Bull/BullMQ)
   - Load balancing support

### 10. **Admin Dashboard**
   - Real-time statistics dashboard
   - Booking management interface
   - User management interface
   - Revenue analytics charts
   - Export reports functionality

---

## **Contributors**

- **Farah Mahfouz** (@farahmahfouz): Main contributor and developer.

---

## **License**

This project is licensed under the ISC License.

---

## **Contact**

For any questions or suggestions, please feel free to reach out or open an issue in the repository.

