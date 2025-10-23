# Customer Support Ticketing System with Laravel Backend & React Frontend


A comprehensive customer support ticketing system built with Laravel backend, React frontend, MySQL database, and Pusher for real-time chat functionality.

## Live Demo

1. Frontend URL: https://customer-support-system-client.vercel.app
2. Backend API: https://customer.support.creativeappbd.com
3. Admin Demo: user: admin@gmail.com / password: 123456
4. Customer Demo: suruj@gmail.com / 123456

## Features

### Authentication & Authorization

1. JWT-based authentication with Laravel Sanctum
2. Role-based access control (Customer & Admin)
3. User registration, login, and logout functionality
4. Protected routes and API endpoints

### Ticket Management

1. Create tickets with subject, description, category, priority
2. View ticket lists with
3. Update ticket status (Open, In Progress, Resolved, Closed)
4. Role-based ticket visibility: Customers see only their tickets, Admins see all
5. Priority levels: Low, Medium, High, Urgent
6. Ticket categories for better organization
7. customers and admins can comment on tickets.

### Real-time Chat System

1. Pusher-based real-time messaging
2. Ticket-linked conversations between customers and admins
3. Instant message delivery without page refresh
4. Message history persistence
5. Online/offline status indicators

### User Interface

1. Responsive design that works on desktop, table and mobile 
2. interface design with Tailwind CSS
3. Form Validation and error handling
4. message show with toast messages
5. use loading states

## Technology Stack
### Backend
1. php framwork Laravel 12
2. relational database - Mysql
3. api authentication - laravel sanctum
4. real time chat - pusher.js
5. cross-origin-resource-sharing

### Frontend

1. javascript frontend-library React-19
2. client- side routing with - React-router
3. client api call - axios
4. real-time communication - pusher
5. Notification - React Hot Toast

### Prerequisites
1. PHP 8.2 or higher
2. Composer
3. Node-20
4. MySql
5. pusher account

### Installation
1. Clone The Repository
```bash
# Clone backend and frontend repository
git clone https://github.com/surujmiah6896/customer-support-ticket-system.git
```
### Change directory into the project
```bash
cd ticket-system
```

2. Backend Setup

```bash
#Change directory into backend
cd support-ticket-backend
```

### install composer
```bash
composer install
```

### create .env file
```bash
cp .env.example .env
```

# Generate application key
```bash
php artisan key:generate
```

3. Database Configuration
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ticket_system
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Run migrations:
```bash
php artisan migrate
```

4. Pusher Configuration
1. Create a Pusher account and update .env:

2. .env

```bash
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=1699146
PUSHER_APP_KEY=8fd8fbea7eb3495717e5
PUSHER_APP_SECRET=4fade3d1868c57fbbf64
PUSHER_APP_CLUSTER=ap2
```

5. Add CORS setup:
#### In config/cors.php
1. 'paths' => ['api/*', 'sanctum/csrf-cookie'],
2. 'allowed_origins' => ['http://localhost:3000'],
2. Frontend setup

### Navigate to frontend directory
```bash
cd support-ticket-frontend
```
### Install dependencies
```bash
npm install
```

### Create environment file
```bash
cp .env.example .env
```
##Update frontend .env:
```bash

VITE_API_URL=your-app-url/api/v1/
VITE_APP_API_URL=your-app-url
VITE_APP_PUSHER_KEY=your_pusher_app_key
VITE_APP_PUSHER_CLUSTER=ap2
VITE_APP_PUSHER_FORCE_TLS=true
NODE_ENV=development
```

## Running the Application

### Start Backend Server
```bash
##### cd support-ticket-backend
php artisan serve
```

    Backend will run on http://localhost:8000

    
### Start Frontend Server
```bash
##### cd support-ticket-frontend
npm run dev
```

#### Frontend will run on http://localhost:3000

### Access the Application

1. Open http://localhost:3000 in your browser

2. Register a new account or use demo credentials

3. Start creating and managing tickets!

# API Documentation
## Authentication Endpoints
### POST /api/v1/register

### Request Body:
```bash
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
}
```

### Response:
```bash
{
    "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer",
        "updated_at": "2025-10-23T07:21:53.000000Z",
        "created_at": "2025-10-23T07:21:53.000000Z",
        "id": 8
    },
    "token": "62|ZxCJQxWa0ic0uswG37YiBb4TrfSgNX9JMSWVqK9Qe8d90790",
    "token_type": "Bearer",
    "status": true,
    "message": "successfull register"
}
```
### POST /api/v1/login

### Request Body:
```bash
{
  "email": "john@example.com",
  "password": "password123"
}
```
### Response:
```bash
{
    "user": {
        "id": 5,
        "name": "John Doe",
        "email": "john@example.com",
        "email_verified_at": null,
        "role": "customer",
        "created_at": "2025-10-19T13:42:25.000000Z",
        "updated_at": "2025-10-19T13:42:25.000000Z"
    },
    "token": "sanctum_token",
    "token_type": "Bearer",
    "status": true,
    "message": "successfull login"
}
```
### POST /api/v1/logout

### Logout user.:
#### Authorization: Bearer <token>

### Response:
```bash
{
    "status": true,
    "message": "Logged out successfully"
}
```

## Ticket Endpoints
### GET /api/v1/tickets

### Get all tickets:
#### Authorization: Bearer <token>

### Response:
```bash
{
    "status": true,
    "tickets": [...],
    "message": "get all tickets"
}
```
### POST /api/v1/tickets

### Create a new ticket.:
#### Authorization: Bearer <token>

### Request Body:
```bash
{
  "subject": "Login Issue",
  "description": "Unable to login to account",
  "category": "Technical",
  "priority": "high"
}
```

### Response:
```bash
{
    "status": true,
    "ticket": {...},
    "message": "create ticket"
}
```
###GET /api/v1/tickets/{id}
#### Get specific ticket details.

### POST /api/v1/tickets/{id}
#### Authorization: Bearer <token>
### Request Body:
```bash
{
  "status": "in_progress",
  "ticket_id": 2
}
```
### POST /api/v1/tickets/2/comments
#### Authorization: Bearer <token>
### Request Body:
```bash
{
  "content": "Hello, I need help with this issue"
}
```
### POST /api/v1/tickets/2/comments/1
#### Authorization: Bearer <token>
### Request Body:
```bash
{
  "content": "Hello, I need help with this issue"
}
```