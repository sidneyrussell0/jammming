import React, { useState, useCallback } from "react";
import "./App.css";

import Playlist from "./Playlist/Playlist";
import SearchBar from "./SearchBar/SearchBar";
import SearchResults from "./SearchResults/SearchResults";
import Tracklist from "./Tracklist/Tracklist";
//get rid of Tracklist at end and replace w spotify util
//import Spotify from "../../util/Spotify";


function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const search = useCallback((term) => {
    TrackDataArray.search(term).then(setSearchResults);
  }, []);

  const addTrack = useCallback(
    (track) => {
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;
      setPlaylistTracks((prevTrack) => [...prevTrack, track]);
    }, [playlistTracks]
  );

  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTrack) =>
      prevTrack.filter((currentTrack) => currentTrack.id !== track.id)
    );
  }, []);

  const updatePlaylistName = useCallback((name) => {
    playlistName(name);
  }, []);

  const savePlaylist = useCallback(() => {

  }, []);

  return (
    <div>
      <hi>Ja<span>mmm</span>ing</hi>
      <div className="App">
        <SearchBar />
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          <Playlist 
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={updatePlaylistName}
            onRemove={removeTrack} />
        </div>
      </div> 
    </div>
  );
};

export default App;
