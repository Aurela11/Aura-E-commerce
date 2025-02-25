# Aura - E-Commerce Platform

**Author: Aurela Gashi**

Aura is a modern e-commerce platform designed to provide a seamless and secure experience for both buyers and sellers online. Built with cutting-edge technologies, it is optimized for scalability and performance.

## 🚀 Key Features
- **Online Buying and Selling** – Users can easily list, sell, and purchase products.
- **Advanced Product Management** – Create, update, and categorize products effortlessly.
- **Secure Payments** – Integrated with **Stripe** for fast and secure transactions.
- **Secure Authentication** – Utilizing **JWT (JSON Web Token)** for enhanced security.
- **Analytics & Reports** – Track sales performance and analyze user data.
- **Multi-User Support** – Manage accounts for both buyers and sellers.

## 🏗️ Technologies Used
- **State Management:** Redux & RTK Query
- **Frontend:** React.js (Vite) & Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose), PostgreSQL (planned)
- **Authentication:** JWT
- **Payments:** Stripe
- **Deployment:** AWS

## 📦 Installation and Setup
1. **Clone the project**
   ```bash
   git clone https://github.com/Aurela11/Aura-E-commerce.git
   cd aura
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure the environment**
   Create a `.env` file and add the necessary configurations:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET=your_stripe_secret
   ```
4. **Start the backend server**
   ```bash
   npm run start:dev
   ```
5. **Start the frontend**
   ```bash
   npm run dev
   ```


## 📜 License
This project is licensed under the [MIT License](LICENSE).

---
For any inquiries, feel free to contact me at [aurelagashi4@gmail.com].
