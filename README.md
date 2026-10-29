WANDERLUST 🌍
==============

WanderLust is a full-stack web application inspired by platforms like Airbnb.
It allows users to browse, create, and manage travel listings with image uploads,
user authentication, and persistent data storage.

The primary goal of this project was to move beyond basic CRUD demos and gain
hands-on experience with real-world full-stack development, deployment, and
cloud service integration.

--------------------------------------------------
LIVE DEMO
--------------------------------------------------

Deployed on Render:
https://wanderlust-project-or96.onrender.com/listings

GitHub Repository:
https://github.com/VinayakRastogi16/WanderLust-Major-Project

--------------------------------------------------
TECH STACK
--------------------------------------------------

Frontend:
- EJS
- HTML
- CSS
- Bootstrap

Backend:
- Node.js
- Express.js

Database:
- MongoDB (Mongoose)

Tools & Services:
- Cloudinary (image upload and storage)
- Render (deployment)
- Passport.js (authentication)
- Express-session

--------------------------------------------------
FEATURES
--------------------------------------------------

- User authentication and authorization
- Create, edit, and delete travel listings
- Image upload and management using Cloudinary
- Secure, protected routes
- RESTful API design
- MVC architecture for clean and scalable code
- Environment variable–based configuration
- Production deployment on Render

--------------------------------------------------
PROJECT STRUCTURE
--------------------------------------------------

WanderLust/
│
├── models/        -> Mongoose schemas
├── routes/        -> Express routes
├── controllers/   -> Business logic
├── views/         -> EJS templates
├── public/        -> Static assets (CSS, JS)
├── utils/         -> Helper utilities
├── app.js         -> Application entry point
└── package.json

--------------------------------------------------
ENVIRONMENT VARIABLES
--------------------------------------------------

Create a `.env` file in the root directory with the following values:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

MONGODB_URL=your_mongodb_connection_string
SESSION_SECRET=your_session_secret

IMPORTANT:
- Do NOT commit the .env file
- Make sure .env is listed in .gitignore

--------------------------------------------------
LOCAL SETUP INSTRUCTIONS
--------------------------------------------------

1. Clone the repository:
   git clone https://github.com/VinayakRastogi16/WanderLust-Major-Project.git

2. Navigate to the project directory:
   cd WanderLust-Major-Project

3. Install dependencies:
   npm install

4. Add environment variables (see above).

5. Start the server:
   npm start

6. Open in browser:
   http://localhost:3000

--------------------------------------------------
WHAT I LEARNED
--------------------------------------------------

- Building and structuring a full-stack application using MVC
- Implementing authentication and route protection
- Integrating third-party services like Cloudinary
- Handling production deployment issues
- Managing environment variables securely
- Debugging real-world backend and deployment problems
- Writing cleaner, more maintainable server-side code

--------------------------------------------------
FUTURE IMPROVEMENTS
--------------------------------------------------

- Search and filtering for listings
- Pagination for large datasets
- Reviews and ratings system
- Role-based access control (admin / user)
- UI improvements and performance optimizations

--------------------------------------------------
AUTHOR
--------------------------------------------------

Vinayak Rastogi
GitHub: https://github.com/VinayakRastogi16

--------------------------------------------------
LICENSE
--------------------------------------------------

This project is intended for learning and demonstration purposes.
