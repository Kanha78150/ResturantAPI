
# Restaurant API

This is a Node.js-based REST API for managing restaurant-related data. The API allows for user authentication and managing restaurant information.

## Project Structure

- `.env`: Environment variables for the project.
- `.env.example`: Example environment variables for the project.
- `.gitignore`: Files and directories to be ignored by git.
- `Dockerfile`: Configuration file for building the Docker container.
- `package.json`: Lists the project's dependencies and scripts.
- `package-lock.json`: Locks the dependency versions.
- `server.js`: Entry point for the Node.js application.
- `.vscode/settings.json`: VSCode-specific settings for the project.
- `middleware/auth.js`: Middleware for handling authentication.
- `models/Restaurant.js`: Mongoose schema and model for restaurant data.
- `models/User.js`: Mongoose schema and model for user data.
- `routes/auth.js`: Routes for user authentication.
- `routes/restaurants.js`: Routes for managing restaurant data.

## Prerequisites

- Docker: Ensure Docker is installed and running on your machine.
- Node.js and npm: If you prefer running the app without Docker.

## Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd restaurant-api
   ```

2. **Environment Variables**:

   Create a `.env` file in the root of the project by copying the contents of `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file to include your environment-specific variables.

3. **Build and Run the Docker Container**:

   ```bash
   docker build -t restaurant-api .
   docker run -p 5000:5000 --env-file .env restaurant-api
   ```

   The API will be accessible at `http://localhost:5000`.

4. **Install Dependencies (Optional)**:

   If you want to run the app without Docker:

   ```bash
   npm install
   npm start
   ```

## API Endpoints

- **User Authentication**:
  - `POST /auth/signup`: Register a new user.
  - `POST /auth/login`: Login a user.

- **Restaurant Management**:
  - `GET /restaurants`: Get a list of restaurants.
  - `POST /restaurants`: Add a new restaurant.
  - `GET /restaurants/:id`: Get details of a specific restaurant.
  - `PUT /restaurants/:id`: Update a restaurant's details.
  - `DELETE /restaurants/:id`: Delete a restaurant.

## License

This project is licensed under the MIT License.
