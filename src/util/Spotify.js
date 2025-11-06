const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = 'https://violety-hee-inaptly.ngrok-free.dev';
const scope = 'playlist-modify-public playlist-modify-private';

let accessToken;

// SPOTIFY API //
const Spotify = {
  async getAccessToken() {
    if (accessToken) {
      console.log("Using existing access token");
      return accessToken;
    }

    // Check URL for code
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // If we have code_verifier stored — or can recover from URL
    if (!sessionStorage.getItem("spotify_code_verifier")) {
      const state = urlParams.get("state");
      if (state) {
        try {
          const recoveredVerifier = atob(state);
          sessionStorage.setItem("spotify_code_verifier", recoveredVerifier);
          console.log("Recovered code_verifier from state param");
        } catch (e) {
          console.warn("Failed to decode state param:", e);
        }
      }
    }

    // If no code, start auth flow
    if (!code) {
      console.log("No code found — starting authorization flow...");
      const codeVerifier = generateCodeVerifier(128);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Save verifier to sessionStorage
      sessionStorage.setItem("spotify_code_verifier", codeVerifier);

      // Also encode as base64 and attach as state backup
      const state = btoa(codeVerifier);

      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=${encodeURIComponent(
        scope
      )}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

      window.location = authUrl;
      return;
    }

    // If we do have a code — exchange it for a token
    const codeVerifier = sessionStorage.getItem("spotify_code_verifier");
    if (!codeVerifier) {
      console.error("Missing code_verifier - please restart the authorization process.");
      return null;
    }

    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    });

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Token exchange failed:", data);
        return null;
      }

      accessToken = data.access_token;
      console.log("Access token acquired!");

      // Clean up URL
      window.history.pushState({}, null, "/");

      return accessToken;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  async search(term) {
    const token = await this.getAccessToken();
    if (!token) {
      console.error("No valid Spotify token available for search.");
      return [];
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      console.error("Spotify search error:", await response.json());
      return [];
    }

    const jsonResponse = await response.json();
    if (!jsonResponse.tracks) return [];

    return jsonResponse.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) return;
  
    const token = await this.getAccessToken();
    if (!token) {
      console.error("No Spotify token available for saving playlist.");
      return;
    }
  
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  
    try {
      // Get user ID
      const userResponse = await fetch("https://api.spotify.com/v1/me", {
        headers,
      });
      const userData = await userResponse.json();
      const userId = userData.id;
  
      // Create a new playlist
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ name }),
        }
      );
      const playlistData = await playlistResponse.json();
  
      // Add tracks to the playlist
      await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ uris: trackUris }),
        }
      );
  
      console.log(`Playlist "${name}" saved successfully!`);
    } catch (error) {
      console.error("Error saving playlist:", error);
    }
  },
};

// PKCE HELPERS
function generateCodeVerifier(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default Spotify;
