# Sahad AI v2.5 // Architect Core

A production-ready, full-stack personal AI assistant built with **Node.js**, **Gemini 2.5 Flash**, and **JWT Authentication**. Optimized for senior engineers, this system features multimodal image analysis and a high-performance cyberpunk UI.

## 🚀 Key Features

- **Multimodal Vision:** Upload screenshots or images for instant code debugging and visual analysis.
- **Cyberpunk UI:** High-contrast, dark-mode interface with `JetBrains Mono` typography.
- **Code Workbench:** Automatic syntax highlighting with one-click **COPY** buttons for code blocks.
- **Secure Sessions:** JWT-based authentication ensuring 7-day persistent access via encrypted tokens.
- **Developer Protocol:** Pre-configured with senior-level system instructions for modular, scalable code generation.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **AI Engine:** Google Generative AI (Gemini 2.5 Flash)
- **Security:** JSON Web Tokens (JWT) & `dotenv`
- **Frontend:** Tailwind CSS & Vanilla JavaScript
- **Database:** Lowdb (JSON Persistence)

## ⚙️ Configuration (Environment Variables)

Since this project is designed for cloud deployment, ensure the following variables are set in your hosting provider (e.g., Render) or `.env` file:

```env
API_KEY=your_google_gemini_api_key
JWT_SECRET=your_custom_secret_string
MY_PASSWORD=******
PORT=3000 ```


##📦 Local Installation

# Clone the repo
git clone [https://github.com/Dev-Sahad/Clone-Gemini-Project.git](https://github.com/Dev-Sahad/Clone-Gemini-Project.git)

# Install dependencies
npm install

# Start the engine
node server.js


🌐 Cloud Deployment (Render.com)
Connect your GitHub repository to Render.
Set Runtime to Node.
Build Command: npm install
Start Command: node server.js
Add your secrets to the Environment tab.
Architect: Muhammad Sahad (https://github.com/Dev-Sahad)
Version: 2.5.0
License: MIT