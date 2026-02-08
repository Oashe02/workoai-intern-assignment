# WorkoAI Referral Management System 🚀

I built this with a focus on a clean user interface and smooth interactions using **React** and **Tailwind CSS**, backed by a robust **Node.js/Express** API.

## ✨ Features

*   **📊 Interactive Dashboard**: Get a quick overview of your total referrals and their current status (Pending, Reviewed, Hired).
*   **📈 Analytics Page**: Visual charts (built with Recharts) to track referral trends over time and see the pipeline distribution.
*   **👥 Candidate Management**: You can easily add new referrals, update their status, or delete them. I added a custom modal for deleting to prevent accidental clicks!
*   **🔐 Authentication**: Secure User Registration and Login using JWT.
*   **📱 Responsive**: Fully responsive design that works on different screen sizes.

---

## 🚀 Getting Started

Want to run this locally? Here's how:

### 1. Clone the Code
First, functionality clone this repo to your machine.

```bash
git clone https://github.com/Oashe02/workoai-intern-assignment.git
cd workoai-intern-assignment
```

### 2. Backend Setup 🔙

Navigate to the backend folder:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

**Configuration**:
Create a `.env` file in the `backend` folder and add your specific keys:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_key
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup 🎨

Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

Create a `.env` file in the `frontend` folder and add your specific keys:
```env
VITE_API_URL=http://localhost:5000
```

Install dependencies:
```bash
npm install
```

Start the app:
```bash
npm run dev
```
---

Thanks for checking it out!
**- Oashe**
