# 🍔 Yukky – Food Delivery Web Application

Yukky is a modern food delivery web application inspired by **Swiggy**, built using **Next.js** and **MongoDB**. It provides a smooth customer ordering experience along with a dedicated **Delivery Partner** flow for managing orders. The application is deployed live on **Netlify**.

🌐 **Live URL:** [https://yukky.netlify.app/](https://yukky.netlify.app/)

---

## 🚀 Features Overview

### 👤 User Authentication

* **Email OTP Login**

  * Secure login using **Email-based OTP** authentication
  * Powered by **Google Email Service**
  * Environment variable used: `EMAIL_SERVICE`

* **Sign in with Google**

  * One-click authentication using **Google OAuth**
  * Environment variable used: `GOOGLE_CLIENT_ID`

---

### 🛒 Customer Features

* Swiggy-like **Homepage UI** branded as **Yukky**
* Browse restaurants and food items
* Add items to cart
* **Cart Management**

  * Add / remove items
  * Increase or decrease quantity
  * Dynamic price calculation
* Seamless checkout flow

---

### 🚚 Delivery Partner Module

* **“Delivery Partner with Us”** opens in a **new browser tab**
* Dedicated Delivery Partner login page
* Delivery partner dashboard to:

  * View assigned orders
  * Manage order status (pickup / delivered)
  * Track ongoing deliveries

---

## 🧑‍💻 Tech Stack

### Frontend

* **Next.js** (React Framework)
* JavaScript / JSX
* Responsive UI inspired by Swiggy

### Backend

* **MongoDB** (Database)
* API routes using Next.js

### Authentication & Services

* Google Email Service (OTP emails)
* Google OAuth (Sign in with Google)

### Deployment

* **Netlify** (Production Deployment)

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the following:

```env
EMAIL_SERVICE=your_google_email_service
GOOGLE_CLIENT_ID=your_google_client_id
MONGODB_URI=your_mongodb_connection_string
```

> ⚠️ Never commit your `.env` file to version control.

---

## 📦 Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/priyalgoti07/food-delivery-nextjs.git
```

2. Navigate to the project directory

```bash
cd yukky
```

3. Install dependencies

```bash
npm install
```

4. Run the development server

```bash
npm run dev
```

5. Open in browser

```text
http://localhost:3000
```

---

## 🌍 Deployment

The application is deployed on **Netlify**.

Live URL:
👉 [https://yukky.netlify.app/](https://yukky.netlify.app/)

---

## 📸 UI Inspiration

* Swiggy (Design & User Experience)

---

## 📌 Future Enhancements

* Online payment gateway integration
* Real-time order tracking
* Admin dashboard
* Push notifications
* Ratings & reviews system

---

## 🙌 Author

**Yukky** – Deliciousness Delivered 🍕

---

⭐ If you like this project, don’t forget to give it a star!
