# 💊 PillMate Backend

Spring Boot REST API for PillMate – Smart Medication Reminder System.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.x

### 1. Create Database
```sql
mysql -u root -p < schema.sql
```
Or manually run `schema.sql` in MySQL Workbench.

### 2. Configure
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD

# For email notifications (optional):
spring.mail.username=your-email@gmail.com
spring.mail.password=your-gmail-app-password

# For Firebase push notifications:
firebase.project-id=pillmate-b20b8
firebase.service-account-path=file:/absolute/path/to/pillmate-b20b8-service-account.json
```

Important: the Firebase Admin service account must come from the same Firebase project as the frontend app. If the frontend uses `pillmate-b20b8`, the backend must also use a `pillmate-b20b8` service account JSON.

### 3. Run
```bash
mvn spring-boot:run
```

API runs at **http://localhost:8080**

## 📁 Structure

```
src/main/java/com/pillmate/
├── controller/     AuthController, MedicineController, HistoryController,
│                   PrescriptionController, UserController, PharmacyController
├── model/          User, Medicine, IntakeHistory, Prescription
├── repository/     JPA Repositories
├── service/        EmailNotificationService, ReminderScheduler
├── security/       JwtUtils, JwtAuthFilter, UserDetailsServiceImpl
├── config/         SecurityConfig
└── dto/            LoginRequest, RegisterRequest, JwtResponse, ApiResponse
```

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → returns JWT |

### Medicines
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/medicines?userId={id}` | List user's medicines |
| POST | `/api/medicines` | Add medicine |
| PUT | `/api/medicines/{id}` | Update medicine |
| DELETE | `/api/medicines/{id}` | Delete medicine |
| GET | `/api/medicines/active?userId={id}` | Active medicines |

### History
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/history?userId={id}` | Get history |
| POST | `/api/history` | Log intake |
| GET | `/api/history/stats?userId={id}` | Taken/Missed/Skipped counts |

### Prescriptions
`GET/POST /api/prescriptions` · `PUT/DELETE /api/prescriptions/{id}`

### Users (Admin only)
`GET /api/users` · `GET/PUT /api/users/{id}` · `DELETE /api/users/{id}`

### Pharmacies
`GET /api/pharmacies?location={loc}` — Public endpoint

## 🔐 Security

- JWT Bearer token authentication
- BCrypt password encoding
- Role-based access: `USER` / `ADMIN`
- CORS enabled for `http://localhost:3000`

## 🗄️ Database

Run `schema.sql` to create:
- `pillmate_db` database
- `users`, `medicines`, `medicine_intake_times`, `intake_history`, `prescriptions` tables
- Default admin: `admin@pillmate.com` / `password` (BCrypt hash of `password`)

## ⏰ Scheduled Tasks

`ReminderScheduler` runs daily at 11:59 PM to auto-mark unlogged medicines as **MISSED**.

## 🛠️ Tech Stack

- Spring Boot 3.2
- Spring Security + JWT (jjwt 0.11.5)
- Spring Data JPA + Hibernate
- MySQL 8
- Java Mail Sender (Gmail SMTP)
- Maven
