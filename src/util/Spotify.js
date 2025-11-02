const clientId = 'd21d75df48fa44789360a68f8ff275b6'; // Insert client ID here.
const redirectUri = 'https://violety-hee-inaptly.ngrok-free.dev/'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
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
      window.history.pushState("Access Token", null, redirectUri);
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`; //For private playlist support "scope=playlist-modify-public%20playlist-modify-private"
      console.log("Redirecting to Spotify Auth:", accessUrl);
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
    console.log("Access Token:", token);
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      console.error("Spotify search error:", await response.text());
      return [];
    }
    //const jsonResponse = await response.json();

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

  async savePlaylist(name, tracks) {
    if (!name || !tracks.length) return;
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    
    //Only keep Spotify URIs
    const trackUris = tracks.map(track => track.uri);
    if (!trackUris.length) return;

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
    await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      headers,
      method: 'POST',
      body: JSON.stringigy({ uris: trackUris }),
    });

    return playlist.id;
  },
};

export default Spotify;
