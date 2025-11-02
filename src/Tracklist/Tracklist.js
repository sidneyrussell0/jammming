import React from 'react';
import "./Tracklist.css";
import Track from "../Track/Track";

function Tracklist({ tracks = [], onAdd, onRemove, isRemoval }) {
  return (
    <div className="Tracklist">
      {tracks.length > 0 ? (
        tracks.map((track) => (
          <Track 
            key={track.id}
            track={track}
            onAdd={props.onAdd}
            onRemove={props.onRemove}
            isRemoval={props.isRemoval}
          />
        ))
      ) : (
        <p className='no-tracks'>No tracks to display.</p>
      )}
    </div>
  );
}

export default Tracklist;