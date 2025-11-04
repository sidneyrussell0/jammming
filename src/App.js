import React, { useState, useCallback, useEffect } from "react";
import "./App.css"; 

import Playlist from "./Playlist/Playlist";
import SearchBar from "./SearchBar/SearchBar";
import SearchResults from "./SearchResults/SearchResults";
import Spotify from "./util/Spotify";


function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  useEffect(() => {
    console.log("Getting access token");
    Spotify.getAccessToken();
  }, []);

  const search = useCallback((term) => {
    Spotify.search(term)
    .then(setSearchResults)
    .catch((err) => console.error("Search failed:", err));
  }, []);

  const addTrack = useCallback((track) => {
      setPlaylistTracks((prevTracks) => {
        if (prevTracks.some((savedTrack) => savedTrack.id === track.id)) return prevTracks;
        return [...prevTracks, track];
    });
  }, []);

  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTrack) =>
      prevTrack.filter((currentTrack) => currentTrack.id !== track.id)
    );
  }, []);

  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);

  const savePlaylist = useCallback(() => {
    if (!playlistTracks.length) return;
    const trackUris = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackUris).then(() => {
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    });
  }, [playlistName, playlistTracks]);

  return (
    <div>
      <header className="App-header">
        <img 
          src={`${process.env.PUBLIC_URL}/favicon.ico`} 
          alt="Jammming Logo" 
          className="App-logo" 
        />
      </header>
      
      <div className="App">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          <Playlist 
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={updatePlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist} 
          />
        </div>
      </div> 
    </div>
  );
};

export default App;
