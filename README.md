# Employee Management System - Frontend

This is the frontend application for the **Employee Management System**, developed as a **Single-Page Application (SPA)** using **Angular**. It provides a user-friendly interface to manage employee records by interacting with a .NET Core RESTful API.



## 🔗 Backend Integration

This frontend is designed to consume the Employee Management Backend API built with **.NET 8** and Clean Architecture.  

**Backend Repository:** [Employee Management Backend](https://github.com/AnasAltobasi/employee-management-backend)


## 🚀 Key Features

- **Full CRUD Support:** Create, Read, Update, and Delete employee entries.
- **Material Design:** Built using **Angular Material** for professional and intuitive UI components.
- **Reactive Forms:** Includes robust validation for required fields and email formats.
- **Client-Side Routing:** Seamless navigation between the Employee List and Add/Edit views.


## 🛠 Tech Stack

- **Framework:** Angular  
- **UI Library:** Angular Material  
- **Language:** TypeScript  
- **API Communication:** HttpClient for RESTful service consumption  


## ⚙️ Setup & Installation

1. **Clone the repository**

```bash
git clone https://github.com/AnasAltobasi/employee-management-frontend.git
cd employee-management-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API Endpoint**

Open src/environments/environment.ts and set the apiUrl to match your running .NET API:

export const environment = {
  production: false,
  apiUrl: 'https://localhost:7161/api' // Change to your backend URL
};

4. **Run the application**
```bash
ng serve
