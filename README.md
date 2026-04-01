# 🗳️ CR E-Voting System

> A next-generation, secure, and AI-powered e-voting platform for Class Representative elections.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-MERN-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 🌟 Overview

The **CR E-Voting System** is a full-stack web application designed to modernize student elections. It replaces traditional paper ballots with a secure, transparent, and visually stunning digital platform. Features include real-time results, role-based access control, and **AI-powered insights** that analyze candidate manifestos to help students make informed decisions.

## ✨ Key Features

- **🎨 Premium Dark Glassmorphism UI**: A visually striking, modern interface with neon gradients, glass effects, and smooth animations.
- **🤖 AI-Powered Analysis**: Integrated **Puter.js** to provide instant summaries of candidate manifestos and election predictions directly in the browser.
- **🔐 Secure Voting**: Robust Role-Based Access Control (RBAC) ensures transparency and prevents duplicate votes.
- **👥 Role Management**: Distinct portals for **Students** (Nominate, Vote) and **Admins** (Approve Nominations, View Reports).
- **📊 Real-Time Results**: Live tracking of vote counts with dynamic progress bars and ranking.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), CSS3 (Glassmorphism), `puter.js` (AI).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas).
- **Authentication**: JWT (JSON Web Tokens).

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas Connection String
- Puter.js (No setup required, runs client-side)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/cr-evoting-system.git
    cd cr-evoting-system
    ```

2.  **Setup the Backend**
    ```bash
    cd server
    npm install
    ```
    *   Create a `.env` file in the `server` directory:
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret_key
        ```
    *   Start the server:
        ```bash
        npm run dev
        ```

3.  **Setup the Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Access the Application**
    Open your browser and navigate to `http://localhost:5173`.

## 📖 Usage Guide

### For Students
1.  **Register**: Create an account with your **Student** role and Section.
2.  **Nominate** (Optional): Submit a manifesto to run for Class Representative.
3.  **Vote**:
    *   Go to the **Vote** page.
    *   Click **✨ Get AI Summary** on any candidate to analyze their manifesto.
    *   Cast your secure vote.

### For Admins
1.  **Register**: Create an account with the **Admin** role.
2.  **Dashboard**: View live stats and **approve/reject** pending nominations.
3.  **Reports**: Click **📊 Generate Election Analysis Report** to get an AI-generated summary of the entire election.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---
*Built with ❤️ for a better democracy.*

## ✅ API Testing Status

The following API endpoints have been successfully tested and verified:

| Endpoint | Method | Status | Description |
| :--- | :--- | :--- | :--- |
| **Health Check** | `GET /` | ✅ Working | Server is responsive. |
| **User Registration** | `POST /api/auth/register` | ✅ Working | Registers new users correctly. |
| **User Login** | `POST /api/auth/login` | ✅ Working | Authenticates users and issues tokens. |
| **User Profile** | `GET /api/auth/me` | ✅ Working | Retrieves authenticated user details. |
| **Candidate List** | `GET /api/candidates` | ✅ Working | Fetches list of approved candidates. |
| **Vote Results** | `GET /api/vote/results` | ✅ Working | Retrieves current voting statistics. |
| **Admin Dashboard** | `GET /api/admin/dashboard` | ✅ Verified | Correctly restricts access (RBAC tested). |

