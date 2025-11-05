# Jammming
Jammming is a React web application that lets users search the Spotify library for songs, create custom playlists, and save them directly to their personal Spotify account.

Built with **React**, **Spotify Web API**, and **PKCE Authorization Flow** for secure OAuth authentication.

---

## Features
- **Search Spotify** by song, artist, or album  
- **Add / remove tracks** to a custom playlist  
- **Save playlists** directly to your Spotify account  
- **PKCE Authorization Flow** for secure login  
- **Responsive design** styled with CSS Flexbox 

---

## Tech Stack
- **React (Create React App)**
- **Spotify Web API**
- **JavaScript (ES6+)**
- **CSS (custom styles)**
- **ngrok** (for temporary HTTPS redirect URI during local development)

---

## Setup & Installation
### 1. Clone this repository
`bash`
git clone https://github.com/sidneyrussell0/jammming.git
cd jammming
### 2. Install dependencies
`npm install`
### 3. Create your Spotify app
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add your Redirect URI (must match your app's redirect):
https://<your-ngrok-subdomain>.ngrok-free.dev
4. Copy your Client ID
### 4. Add environment variables
Create a `.env` file in the root of your project:
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
REACT_APP_REDIRECT_URI=https://<your-ngrok-subdomain>.ngrok-free.dev
### 5. Start the app
`npm start`

Your app should open at http://localhost:3000
The first time you search, you'll be redirected to Spotify to log in and approve the app.

---

## How It Works
### 1. Authorization:
Jammming uses the Spotify PKCE flow to securely authenticate users.
### 2. Search:
The app fetches tracks via https://api.spotify.com/v1/search.
### 3. Playlist Management:
Users build a custom list of tracks in React state.
### 4. Save to Spotify:
The playlist is created via POST /v1/users/{user_id}/playlists and tracks are added with POST /v1/playlists/{playlist_id}/tracks.

---

## Future Improvements
- Add preview audio clips for tracks
- Display user’s Spotify username
- Refresh tokens automatically when they expire
- Add dark/light mode toggle
- Improve mobile responsiveness

---

## Preview
![Jammming Screenshot](/Jammming_Screenshot.jpg)

---

## Author
Sidney Russell

Frontend Developer

[GitHub](https://github.com/sidneyrussell0)
 • [LinkedIn](https://www.linkedin.com/in/sidney-russell-0445422b3)

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.