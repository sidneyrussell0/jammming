const clientId = 'd21d75df48fa44789360a68f8ff275b6'; // Insert client ID here.
const redirectUri = 'https://localhost:3000/'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresMatch = window.location.href.match(/expires_in=([^&]*)/);
    
    if (tokenMatch && expiresMatch) {
      accessToken = tokenMatch[1];
      const expiresIn = Number(expiresMatch[1]);
      window.setTimeout(() => accessToken = "", expiresIn * 1000);
      window.history.pushState("Access Token", null, "/"); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  async fetchWebApi(endpoint, method = 'GET', body) {
    const token = Spotify.getAccessToken();
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  },

  async search(term) {
    const token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const jsonResponse = await response.json();
    if (!jsonResponse.tracks) return [];
    return jsonResponse.tracks.items.map(track => ({
      id: track.id,
      name:track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

  async getTopTracks() {
    const response = await Spotify.fetchWebApi(
      'v1/me/top/tracks?time_range=long_term&limit=5',
      'GET'
    );
    return response.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      uri: track.uri,
    }));
  },  

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) return;
    const token = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };
    
    const meResponse = await fetch('https://api.spotify.com/v1/me', { headers });
    const meJson = await meResponse.json();
    const userId = meJson.id;

    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name }),
    });

    const playlistJson = await playlistResponse.json();
    const playlistId = playlistJson.id;

    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ uris: trackUris }),
    });
  },
};

export default Spotify;
