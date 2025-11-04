import React, { useCallback } from "react";
import "./Playlist.css"
import Tracklist from "../Tracklist/Tracklist";

function Playlist({ playlistName, playlistTracks, onNameChange, onRemove, onSave }) {
    const handleNameChange = useCallback(
        (event) => {
            onNameChange(event.target.value);
        },
        [onNameChange]
    );

    const handleSave = useCallback(() => {
        onSave(); //call the savePlaylist() from App.js
    }, [onSave]);


    return (
        <div className="Playlist">
            <input 
                type="text"
                onChange={handleNameChange} 
                defaultValue={playlistName || "New Playlist"} 
            />
            <Tracklist 
                tracks={playlistTracks}
                onRemove={onRemove}
                isRemoval={true} 
            />
            <button type="button" onClick={handleSave}> Save To Spotify </button>
        </div>
    );
}

export default Playlist;