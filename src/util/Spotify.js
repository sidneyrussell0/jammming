let accessToken;
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID || 'd21d75df48fa44789360a68f8ff275b6';
const redirectUri = 'https://violety-hee-inaptly.ngrok-free.dev'; 


// PKCE HELPER FUNCTIONS
async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(x => possible[x % possible.length])
    .join('');
}

// SPOTIFY API METHODS
const Spotify = {
  async getAccessToken() {
    if (accessToken) return accessToken;

    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
      accessToken = storedToken;
      return accessToken;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      const codeVerifier = generateRandomString(128);
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      localStorage.setItem('spotify_code_verifier', codeVerifier);

      const scope = 'playlist-modify-public playlist-modify-private user-read-email';
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

      console.log("Redirecting to Spotify Auth:", authUrl);
      window.location = authUrl;
      return;
    }

    //If redirected back with a code, exchange it for an access token
    const codeVerifier = localStorage.getItem('spotify_code_verifier');
    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const data = await response.json();
    if (data.access_token) {
      accessToken = data.access_token;
      //Save token into localStorage
      localStorage.setItem('spotify_access_token', accessToken);
      //Clean up URL
      window.history.replaceState({}, document.title, '/');
      return accessToken;
    } else {
      console.error("Failed to get token:", data);
    }
  },

  async search(term) {
    const token = await Spotify.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      console.error("Spotify search error:", await response.text());
      return [];
    }

    const jsonResponse = await response.json();
    if (!jsonResponse.tracks) return [];
    return jsonResponse.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

  async savePlaylist(name, tracks) {
    if (!name || !tracks.length) return;

    const token = await Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    //Get user's Spotify ID
    const response = await fetch('https://api.spotify.com/v1/me', { headers });
    const user = await response.json();

    //Create new playlist
    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    const playlist = await playlistResponse.json();

    //Add tracks to playlist
    const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ uris: tracks.map(track => track.uri) }),
    });

    if (!addTracksResponse.ok) {
      console.error('Failed to add tracks:', await addTracksResponse.text());
    }

    return playlist.id;
  },
};

export default Spotify;