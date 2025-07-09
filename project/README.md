# Quản lý Giảng Đường - Equipment Management System

A comprehensive equipment management system built with React, TypeScript, Node.js, and PostgreSQL.

## 🚀 Features

### Frontend
- **Modern React Application** with TypeScript
- **Responsive Design** with Tailwind CSS
- **Multi-language Support** (English, Vietnamese, Khmer)
- **Dark/Light Theme** toggle
- **Role-based Access Control** (Admin, Teacher, User)
- **Real-time Dashboard** with statistics and charts
- **Equipment Management** with CRUD operations
- **Borrow/Return System** with approval workflow
- **Schedule Management** for classrooms
- **User Management** with role assignments
- **Notification System**
- **Reports and Analytics**

### Backend
- **RESTful API** built with Express.js
- **PostgreSQL Database** with proper schema design
- **JWT Authentication** with role-based authorization
- **Input Validation** and error handling
- **Rate Limiting** and security middleware
- **Activity Logging** for audit trails
- **Database Migrations** and seeding

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- React Router for navigation
- Context API for state management

### Backend
- Node.js with Express.js
- PostgreSQL database
- JWT for authentication
- bcryptjs for password hashing
- Helmet for security
- CORS for cross-origin requests

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd quan-ly-giang-duong
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database
```sql
CREATE DATABASE quan_ly_giang_duong;
```

#### Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/quan_ly_giang_duong
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quan_ly_giang_duong
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Initialize Database Schema
Run the SQL script to create tables and initial data:
```bash
psql -U your_username -d quan_ly_giang_duong -f server/config/init-db.sql
```

### 4. Start the Application

#### Development Mode (Both Frontend & Backend)
```bash
npm run dev:full
```

#### Or run separately:

**Backend only:**
```bash
npm run server:dev
```

**Frontend only:**
```bash
npm run dev
```

## 🔐 Default Login Credentials

### Admin Account
- **Email:** admin@eduequip.com
- **Password:** admin123
- **Role:** Admin

### Teacher Account
- **Email:** teacher@eduequip.com
- **Password:** teacher123
- **Role:** Teacher

### User Account
- **Email:** user@eduequip.com
- **Password:** user123
- **Role:** User

## 📊 Database Schema

### Main Tables
- **users** - User accounts with roles and permissions
- **equipment** - Equipment inventory with status tracking
- **borrow_requests** - Borrow/return request management
- **schedules** - Classroom scheduling system
- **notifications** - System notifications
- **activity_logs** - Audit trail for all actions

### Key Features
- **Foreign Key Constraints** for data integrity
- **Indexes** for optimal query performance
- **Triggers** for automatic timestamp updates
- **Check Constraints** for data validation

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Equipment
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `GET /api/equipment/stats/overview` - Get equipment statistics

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PATCH /api/users/:id/status` - Update user status
- `DELETE /api/users/:id` - Delete user

### Borrow Requests
- `GET /api/borrow` - Get borrow requests
- `POST /api/borrow` - Create borrow request
- `PATCH /api/borrow/:id/status` - Approve/reject request
- `PATCH /api/borrow/:id/return` - Return equipment

### Schedules
- `GET /api/schedules` - Get schedules
- `POST /api/schedules` - Create schedule
- `PATCH /api/schedules/:id/status` - Update schedule status
- `DELETE /api/schedules/:id` - Delete schedule

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for secure cross-origin requests
- **Helmet** for security headers
- **Input Validation** and sanitization
- **SQL Injection Prevention** with parameterized queries

## 🎨 UI/UX Features

- **Responsive Design** that works on all devices
- **Dark/Light Theme** with system preference detection
- **Multi-language Support** with easy language switching
- **Loading States** and error handling
- **Toast Notifications** for user feedback
- **Smooth Animations** and transitions
- **Accessible Design** following WCAG guidelines

## 📱 Role-based Access Control

### Admin
- Full system access
- User management
- Equipment management
- Approve/reject requests
- View all reports
- System settings

### Teacher
- Equipment management
- Create/manage schedules
- Approve/reject borrow requests
- View relevant reports

### User
- View equipment
- Submit borrow requests
- View own schedules
- Receive notifications

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
Update your `.env` file with production values:
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=your_production_frontend_url
```

### Database Migration
Ensure your production database is set up with the schema:
```bash
psql -U username -d production_db -f server/config/init-db.sql
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added multi-language support
- **v1.2.0** - Enhanced dashboard and reporting
- **v1.3.0** - Database integration and API implementation

---

**Built with ❤️ for educational institutions**