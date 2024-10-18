# CITS5206_Group07
CITS5206 - Information Technology Capstone Project SEM-2 2024


| UWA ID    | Name                      | GitHub Username    |
| --------- | ------------------------- | ------------------ |
| 23769386  | Yuchen Wang                | kkglovemy          |
| 23985879  | Scarlett Peng              | Scarlettzpl        |
| 23866945  | Pavan Potukuchi            | PavanPotukuchik    |
| 24095031  | Janki Prafulbhai Rangani   | jankirangani       |
| 23244793  | Kartik Bhalala             | kartikbhalala      |
| 23925667  | Jiaheng Gu                 | HendrickGu         |
	
# Summary
This project is a Client Portal developed for Rockingham Web Services (RWS) to streamline client communication and document management. The portal allows clients to upload, store, and manage project-related documents, reducing the need for back-and-forth emails. It also provides a project management feature where admins can assign tasks, track progress, and send questionnaires to clients. Built using PocketBase for the backend and Flask for API integration, the portal offers a user-friendly interface with distinct dashboards for clients and administrators, ensuring efficient project handling and document management.

# Client Portal - Flask and PocketBase

This project is a Client Portal that integrates **Flask** for the backend and **PocketBase** for managing users and data, with a dynamic frontend using **HTML**, **CSS**, and **JavaScript**.

## Features
- User authentication and login.
- Dynamic user profile picture and username display based on the logged-in user.
- Admin features, including project and client management.
- Integration with PocketBase for user data storage.

## Prerequisites
Before running the app, ensure you have the following installed:
- [Python 3.7+](https://www.python.org/downloads/)
- [Flask](https://flask.palletsprojects.com/en/2.0.x/installation/)
- [PocketBase](https://pocketbase.io/docs/) (local instance or hosted)

## Project Structure
```
/static               # Static files (CSS, JS, images)
  ├── /css            # Stylesheets
  ├── /js             # JavaScript files
/templates            # HTML files (Jinja templates)
app.py                # Flask application
README.md             # Project documentation
```

## Setup Instructions

### 1. Clone the Repository
First, clone the repository to your local machine:
```bash
git clone https://github.com/PavanPotukuchik/CITS5206_Group07/tree/main
```

### 2. Install Flask and Dependencies
Create a virtual environment and install Flask:
```bash
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # For Linux/macOS
# On Windows, use: venv\Scripts\activate

# Install Flask and required dependencies
pip install Flask requests
```

### 3. Set Up PocketBase
You need to have **PocketBase** running locally or use a hosted instance. Follow these steps to set it up:

- Download and run **PocketBase**: [Download Here](https://pocketbase.io/docs/)
- Start PocketBase:
  ```bash
  ./pocketbase serve
  ```
- Set up your **collections** in PocketBase for users, projects, and files:
  - Create a `users` collection with fields for `username`, `avatar`, etc.
  - Add a `files` collection to store user-related files.
  
Make sure to update your `app.py` with the correct PocketBase URL (e.g., `https://five206pocketbase.onrender.com`).

### 4. Run the Flask Application
Start the Flask app:
```bash
flask run
```
Flask will start running on `http://127.0.0.1:5000`.

### 5. Access the Admin Dashboard
Open a browser and navigate to `http://127.0.0.1:5000`. You should see the **Admin Dashboard**.

- If you are not logged in, you’ll be redirected to the login page.
- Once logged in, the profile picture and username will update dynamically based on the logged-in user.

### 7. User Authentication and Profile Updates
- When logging in, the user’s **auth token** and **user ID** are saved in the browser’s `localStorage`.
- The app automatically fetches the user's profile picture and name from PocketBase and displays them in the dashboard.

### 8. File Uploads and Data Management
- Users can upload their profile pictures in the settings, and the app will send the file to PocketBase.
- Admins can manage projects, clients, and view user information through the dashboard.

### 9. Stopping the Application
To stop the Flask app, press `Ctrl+C` in the terminal.

## Additional Notes
- You can customize the dashboard styles and functionality by modifying the HTML, CSS, and JavaScript files in the `/static` and `/templates` directories.

## Troubleshooting
- If the profile picture is not updating, ensure that the correct user ID and token are stored in `localStorage`.
- If there are issues with PocketBase API requests, check if the PocketBase server is running and that the API endpoint URLs are correct.

## License
This project is created by Group-7 for CITS5206


