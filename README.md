# SE3040 – Application Frameworks: Lab 06

**Name**: H.M.T.S.M.DISSANAYAKE  
**Registration Number**: IT23294066  
**Repository**: [https://github.com/sithummadhuranga/LAB06](https://github.com/sithummadhuranga/LAB06)

## Project Overview

This repository contains the implementation for Lab 06 of the Application Frameworks (SE3040) module. The objective of this assignment is to develop a robust, server-side backend for a mock social media platform using Node.js and Express.js. 

The application demonstrates the core principles of building RESTful web services, handling middleware, and serving dynamic templates.

## Implemented Features

As per the laboratory guidelines, the following core features have been successfully implemented:

- **Express Server Configuration:** A fully functional Express.js server listening for incoming HTTP requests, complete with necessary body parsing middleware.
- **RESTful API Design:** A complete suite of CRUD (Create, Read, Update, Delete) endpoints for managing social media posts.
- **Data Persistence:** In-memory variables are utilized to store and manage application state without the need for an external database.
- **Authentication:** Custom JWT (JSON Web Token) middleware is implemented to secure sensitive endpoints and handle user authentication.
- **Dynamic Rendering:** The Handlebars view engine is used to deliver server-side rendered, dynamic HTML pages.
- **File Uploads:** Integration with `multer` to handle `multipart/form-data` and securely store image uploads locally.
- **Pagination:** Query parameter handling to support result pagination on the primary dataset.

## Architecture & Code Quality

The codebase has been structured with a focus on maintainability and separation of concerns:
- **Modular Directory Structure:** Separation of logic into `/controllers`, `/routes`, `/middlewares`, and `/views`.
- **Modern JavaScript:** Utilization of ES6+ features such as destructuring, arrow functions, and async/await constructs.
- **Standardized Responses:** API payloads strictly follow predetermined JSON structures mapping standard HTTP status codes.

## How to Run

1. Ensure Node.js is installed on your machine.
2. Clone the repository and navigate to the root directory.
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Start the server (runs on port 3000 by default):
   ```bash
   npm start
   ```
5. Access the application via a web browser at `http://localhost:3000/feed`.
