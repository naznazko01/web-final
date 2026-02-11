# Movie Platform 

A full-stack movie platform where users can explore popular and top-rated movies, search for their favorites, and maintain a personalized watchlist.

##  Features
- **User Authentication**: Secure Register and Login using JWT and Password Hashing (bcrypt).
- **Movie Discovery**: Fetches real-time movie data from TMDB API.
- **Search**: Robust search functionality for finding specific titles.
- **Watchlist (CRUD)**: Create, Read, Update, and Delete movies in your personal watchlist.
- **Watch Options**: Real-time information on legal streaming platforms (Netflix, Apple TV, etc.) via TMDB.
- **Integrated Movie Player**: Watch full movies directly on the site with a cinematic in-page player.
- **Video Trailers**: Navigation and playback of YouTube trailers.
- **Modern UI**: Polished dark theme with glassmorphism, responsive design, and animations.

##  Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Validation**: Joi (Schema-based validation).
- **External API**: The Movie Database (TMDB).

##  Setup & Installation

### Prerequisites
- Node.js installed on your machine.
- MongoDB connection URI.
- TMDB API Key.

### Installation Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd movie-platform
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   TMDB_API_KEY=your_tmdb_key
   ```
   Start the server:
   ```bash
   npm start
   ```

3. **Frontend Setup**:
   Open `frontend/js/api.js` and ensure `API_BASE_URL` matches your backend port (default: `http://localhost:5000/api`).
   Open `frontend/index.html` in your browser.

##  API Documentation

### Authentication (Public)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user. |
| `POST` | `/api/auth/login` | Log in and receive a JWT. |

### Users (Private)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Get the logged-in user's profile. |
| `PUT` | `/api/users/profile` | Update user profile details. |

### Watchlist/Favorites (Private)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/favorites` | Get all movies in the user's watchlist. |
| `GET` | `/api/favorites/:id` | Get details of a specific watchlist item. |
| `POST` | `/api/favorites` | Add a movie to the watchlist. |
| `PUT` | `/api/favorites/:id` | Update status (planned, watching, watched). |
| `DELETE` | `/api/favorites/:id` | Remove a movie from the watchlist. |

### Movies (Public)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/movies/popular` | Get trending movies. |
| `GET` | `/api/movies/top_rated` | Get highest-rated movies. |
| `GET` | `/api/movies/:id` | Get detailed movie info and trailers. |
| `GET` | `/api/movies/search` | Search for movies by title. |
