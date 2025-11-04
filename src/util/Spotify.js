const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID || 'd21d75df48fa44789360a68f8ff275b6';
const redirectUri = 'https://violety-hee-inaptly.ngrok-free.dev'; 
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = "", expiresIn * 1000);
      window.history.replaceState({}, document.title, window.location.pathname);
      return accessToken;
    } else {
      const scope = 'playlist-modify-public playlist-modify-private';
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
      console.log("Redirecting to Spotify Auth:", accessUrl);
      window.location = accessUrl;
    }
  },

  //Do I need this?
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
      name:track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

  async savePlaylist(name, tracks) {
    if (!name || !tracks.length) return;
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

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
