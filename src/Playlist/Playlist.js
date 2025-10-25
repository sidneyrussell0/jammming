import React, { useCallback } from "react";
import "./Playlist.module.css"
import Tracklist from "../Tracklist/Tracklist";

function Playlist(props) {
    const handleNameChange = useCallback(
        (event) => {
            props.onNameChange(event.target.value);
        },
        [props.onNameChange]
    );

    const handleSave = useCallback(() => {
        props.onSave(); //call the savePlaylist() from App.js
    }, [props.onSave]);


    return (
        <div className="Playlist">
            <form>
                <input 
                    type="text"
                    onChange={handleNameChange} 
                    defaultValue={props.playlistName || "New Playlist"} 
                />
            </form>
            <Tracklist 
                tracks={props.playlistTracks}
                onRemove={props.onRemove}
                isRemoval={true} 
            />
            <button onClick={handleSave}> Save To Spotify </button>
        </div>
    );
}

export default Playlist;