# Commander Deck Tuner

Commander Deck Tuner is a full-stack web application designed to help Magic: The Gathering players optimize, manage, and analyze their Commander (EDH) decks. The app provides deck statistics, card suggestions, and easy deck editing features.

---

## Features

- **Deck Management:** Create, view, edit, and delete Commander decks.
- **Card Management:** Add, remove, and clear cards from your decks.
- **Card Images:** Automatically fetches card images from Scryfall.
- **Deck Analysis:** View deck composition and statistics.
- **User-Friendly UI:** Modern interface with notifications and confirmation dialogs.
- **REST API:** Backend built with Node.js and Express, using MongoDB for storage.
- **Dockerized:** Easily run the entire stack (client, server, database) in containers.

---

## Installation (Manual)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/CommanderDeckTuner.git
```

### 2. Navigate to the project directory

```bash
cd CommanderDeckTuner
```

### 3. Install server dependencies

```bash
cd server
npm install
```

### 4. Install client dependencies

```bash
cd ../client
npm install
```

---

## Usage (Manual)

### 1. Start the backend server

```bash
cd server
node server.js
```

By default, the backend runs on [http://localhost:5001](http://localhost:5001).

### 2. Start the frontend client

```bash
cd ../client
npm run dev
```

The frontend runs on [http://localhost:5173](http://localhost:5173).

---

## Docker Instructions

You can run the entire stack (client, server, and MongoDB) using Docker and Docker Compose.

### 1. Build and Start All Containers

From the project root (where `docker-compose.yml` is located):

```bash
docker-compose up --build
```

- This will build and start the client, server, and MongoDB containers.
- The client will be available at [http://localhost:5173](http://localhost:5173).
- The server API will be available at [http://localhost:5001](http://localhost:5001).

### 2. Run in the Background

```bash
docker-compose up -d
```

### 3. View Logs

```bash
docker-compose logs -f
```

### 4. Stop and Remove Containers

```bash
docker-compose down
```

### 5. Remove Containers and Volumes (including database data)

```bash
docker-compose down -v
```

---

## Technologies Used

- **Frontend:** React, Vite, Axios, React Toastify
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **APIs:** Scryfall (for card data and images)
- **Containerization:** Docker, Docker Compose

---

## Development

- **Testing:**
  - Client: Jest, React Testing Library
  - Server: Jest, Supertest

- **Code Quality:**
  - ESLint, Prettier

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- [Scryfall](https://scryfall.com/) for card data and images.
- [React Toastify](https://fkhadra.github.io/react-toastify/) for notifications.

---


