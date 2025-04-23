# WanderLust - Travel Listing Application

A full-stack web application for sharing and discovering travel destinations, built with Node.js, Express, and MongoDB.

## 🌟 Features

- User Authentication (Sign up, Login, Logout)
- Create, Read, Update, and Delete travel listings
- Image upload functionality using Cloudinary
- Review and rating system for listings
- Responsive design with modern UI
- Session-based authentication
- Flash messages for user feedback

## 🛠️ Technologies Used

- **Backend:**

  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - Passport.js for authentication
  - Cloudinary for image storage

- **Frontend:**
  - EJS (Embedded JavaScript)
  - EJS Mate for template inheritance
  - CSS for styling
  - JavaScript for client-side functionality

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB
- npm (Node Package Manager)

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/bhavin522/WanderLust.git
cd WanderLust
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

4. Start the application:

```bash
npm start
```

## 📁 Project Structure

```
WanderLust/
├── controllers/     # Route controllers
├── models/         # Database models
├── public/         # Static files (CSS, JS, images)
├── routes/         # Application routes
├── views/          # EJS templates
├── middleware.js   # Custom middleware
├── app.js          # Main application file
└── package.json    # Project dependencies
```

## 🔑 Key Features Implementation

### Authentication

- User registration and login system
- Password hashing using Passport Local Mongoose
- Session management with Express Session

### Listings Management

- CRUD operations for travel listings
- Image upload functionality
- Search and filter capabilities

### Reviews System

- User reviews and ratings
- Average rating calculation
- Review validation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

- **Bhavin Kapadiya**
  - GitHub: [@bhavin522](https://github.com/bhavin522)
  - Twitter: [@bhawin522](https://twitter.com/bhawin522)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries used in this project
