# Electronic Security Post-Sales CRM & Service Order Module

A full-stack Post-Sales CRM and Service Order Management module designed for electronic security companies.

This system was conceived based on real operational demands from an electronic security business. Instead of replacing the company's existing systems (sales, financial, or inventory), this solution was designed as a complementary post-sales module.

---

##  Concept

Many electronic security companies operate with internal sales and financial systems but lack structured post-sale monitoring and analytical visibility.

This project acts as an isolated CRM layer focused on:

- Client retention  
- Service order tracking  
- Operational monitoring  
- Analytical dashboards  
- Role-based visibility  

The system was architected to interact with an existing company database structure, ensuring compatibility and minimal adaptation effort.

---

##  Integration Model

The CRM operates as a modular and independent system that:

- Uses a database structure compatible with existing enterprise systems  
- Consumes product and client-related data  
- Registers service orders linked to post-sale operations  
- Displays order status (e.g., paid, pending, in progress) based on synchronized data  
- Sends relevant updates back to the main system when required  

Financial and sales decisions remain under the responsibility of the company’s primary systems.

This design keeps the CRM focused strictly on post-sale management.

---

#  Operational Flow

The system follows a structured post-sale workflow centered around CPF/CNPJ validation and database integrity.

## 1️ Client Contact

The client initiates contact via:

- Email  
- Phone  
- WhatsApp  

An employee registers the request inside the CRM.

---

## 2️ Initial Service Registration

The employee:

- Selects a predefined service reason (checkbox-based)  
- Or uses a custom description field  
- Inputs the client’s CPF or CNPJ  

The system automatically validates the identifier against the database.

### If the client does NOT exist:
- The system blocks continuation  
- Displays a validation message  
- Requires client registration  

### If the client exists:
- Client data is automatically loaded  
- The process continues  

---

## 3️ Client Registration (If Necessary)

If the client is not found:

- A new client record is created  
- The system ensures data consistency  
- No associated data can be deleted once linked to a client  

This guarantees the integrity of service orders and operational records.

---

## 4️ Service Order Creation

The employee:

- Accesses the orders section  
- Inserts CPF/CNPJ (validated automatically)  
- Associates the order with the existing client  
- Registers the requested service  

The order is then stored in the database.

---

## 5️ External System Interaction

After creation:

- The service order becomes available to the company’s primary system (sales/financial)  
- The main system processes financial or operational decisions  
- Status updates (e.g., paid, pending, in progress) are reflected in the database  

The CRM:

- Reads the updated status  
- Displays it visually  
- Updates dashboards accordingly  

The CRM does not manage financial decisions — it consumes and visualizes status information.

---

#  Core Features

### Client Management
- Create, edit, delete, search and list clients  
- Detailed client view  
- PDF export per client  

### Service Order Management
- Create and manage service orders  
- Order status tracking (visual representation)  
- Link service orders to clients  
- PDF export per order  

### Operational Records
- Create and manage technical records  
- Individual PDF export  

### Dashboard & Analytics

Three analytical levels:

- Weekly  
- Monthly  
- Annual  

Each level provides structured visualization through charts and tabular data for business monitoring and decision support.

---

##  Role-Based Access Control

Access levels are structured as:

**Operational**
- Weekly dashboard only  

**Managerial**
- Weekly + Monthly dashboards  

**Executive**
- Full access (Weekly, Monthly, Annual)  

Authentication and access validation are handled through Supabase with token-based route protection.

All routes require authentication.

---

##  Architecture

### Frontend
- React (Vite)  
- Tailwind CSS  
- React Router  
- Chart.js  
- Axios  
- Framer Motion  

Fully responsive:
- Desktop  
- Tablet  
- Smartphone  

PWA enabled.

---

### Backend
- Laravel (REST API)  
- Sanctum middleware  
- DOMPDF for server-side PDF generation  

Handles:

- Business logic  
- Role validation  
- Secure API communication  
- Data processing  

---

### Database & Authentication
- Supabase (authentication + database layer)

---

##  Deployment

Frontend → Vercel  
Backend API → Railway  
Database & Auth → Supabase  

---

##  Target Industry

Designed for:

- CCTV installers  
- Alarm system providers  
- Access control companies  
- Monitoring service providers  

Adaptable to other service-based industries with similar workflows.

---

#  Installation & Setup

##  Requirements

Make sure you have installed:

- PHP ^8.2
- Composer
- Node.js (LTS recommended)
- NPM or Yarn
- Git
- Supabase project (for authentication and database)

---

#  Backend Setup (Laravel API)

#  Installation & Setup

##  Requirements

Make sure you have installed:

- PHP ^8.2  
- Composer  
- Node.js (LTS recommended)  
- NPM or Yarn  
- Git  
- Supabase account (for authentication and database)  

---

#  Backend Setup (Laravel API)

## 1️ Clone the repository

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository/backend
```

## 2️ Install PHP dependencies

```bash
composer install
```

## 3️ Create environment file

```bash
cp .env.example .env
```

## 4️ Generate application key

```bash
php artisan key:generate
```

## 5️ Configure environment variables

Edit the `.env` file and configure:

```env
APP_NAME=CRM
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=your_database_connection
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

>  The database must be compatible with the company’s existing system structure.

## 6️ Run migrations (if applicable)

```bash
php artisan migrate
```

## 7️ Start backend server

```bash
php artisan serve
```

Backend will run at:

http://localhost:8000

---

#  Frontend Setup (React + Vite)

Open a new terminal.

## 1️ Navigate to frontend directory

```bash
cd your-repository/frontend
```

## 2️ Install dependencies

```bash
npm install
```

or

```bash
yarn install
```

## 3️ Configure environment variables

Create a `.env` file:

```bash
touch .env
```

Add:

```env
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4️ Run development server

```bash
npm run dev
```

Frontend will run at:

http://localhost:5173

---

#  Supabase Setup

1. Create a new project at https://supabase.com  
2. Enable Authentication (Email/Password or preferred method)  
3. Configure database tables compatible with the system structure  
4. Copy the Project URL and Anon Public Key  
5. Add them to both frontend and backend `.env` files  

---

#  Production Build

## Frontend

```bash
npm run build
```

## Backend Optimization (optional)

```bash
php artisan config:cache
php artisan route:cache
php artisan optimize
```
