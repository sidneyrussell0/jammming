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



    return (
        <div className="Playlist">
            <form>
            <input 
                type="text"
                onChange={handleNameChange} 
                defaultValue={"New Playlist"} />
            </form>
            <Tracklist tracks={props.playlistTracks} />
            <button>
                Save To Spotify
            </button>
        
        </div>
    );
};

export default Playlist;