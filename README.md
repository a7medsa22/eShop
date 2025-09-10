# E-Shop API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<p align="center">
  <a href="https://github.com/a7medsa22/eShop"><img src="https://img.shields.io/github/stars/a7medsa22/eShop?style=social" alt="GitHub Stars" /></a>
  <a href="https://github.com/a7medsa22/eShop"><img src="https://img.shields.io/github/forks/a7medsa22/eShop?style=social" alt="GitHub Forks" /></a>
  <a href="https://github.com/a7medsa22/eShop/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
</p>

---

E-Shop is a **training project** built with **NestJS** and **TypeORM**.  
It provides a RESTful API for a simple e-commerce system, including products, users, and reviews.  
The project also integrates authentication, authorization, mailing, file uploads, and API documentation using Swagger.

---

## 🚀 Tech Stack

- **NestJS** — Node.js framework with TypeScript  
- **TypeORM** — ORM for database integration  
- **JWT Authentication** — Secure login & authorization  
- **Swagger** — Interactive API documentation  
- **Class-Validator** — DTO validation  
- **Mailer** — Email integration (account verification, notifications, etc.)  
- **File Uploads** — Handling product/user images  
- **Utils** — Shared helpers and utilities  

---

## 📂 Features

### 🔑 Authentication & Authorization
- Register & Login with JWT
- Role-based authorization (admin, user, etc.)
- Guards for securing endpoints

### 👤 Users
- CRUD operations for users
- Profile management
- Authentication & authorization applied

### 📦 Products
- CRUD operations for products
- Filtering & searching (title, minPrice, maxPrice)
- File upload for product images

### ⭐ Reviews
- Add and manage product reviews
- Link reviews to users and products

### 📧 Mail
- Send emails for account actions (verification, notifications)

### 📁 Uploads
- Handle file storage for images or documents

---

## ⚙️ Installation

```bash
# Clone repository
git clone https://github.com/a7medsa22/eShop.git
cd eShop

# Install dependencies
npm install


## ▶️ Running the App

# Development
npm run start:dev

# Production
npm run start:prod

#By default, the API runs at:
http://localhost:3000


 ##  🌍 API Documentation
Swagger is enabled for this project.
Once the app is running, open:

http://localhost:3000/api


## 🔑 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Application
BASE_URL=http://localhost:3000
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=eshop

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRED_IN=3600s

# Mailer
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM="E-Shop <no-reply@eshop.com>"


