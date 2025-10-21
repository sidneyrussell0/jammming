import React, { useState } from 'react';

const TrackDataArray = [{
    song: "Never With You Again",
    artist: "Chri$tian Gate$",
    album: "Single"
  },
  {
    song: "I'm Not A Vampire",
    artist: "Falling In Reverse",
    album: "The Drug In Me Is You"  
  },
  {
    song: "Gasoline",
    artist: "I Prevail",
    album: "TRAUMA"
  }];


function Tracklist() {
const [searchResults, setSearchResults] = useState([]);
    const search = () => {
        const track = TrackDataArray.map((track) => {
          return track;
        });
        setSearchResults(track);
      }

    return (
        <div>
            <ul>
              {searchResults.map((track) => (
                <li key={track.id}>
                  <strong>Song:</strong> {track.song} <br />
                  <strong>Artist:</strong> {track.artist} <br />
                  <strong>Album:</strong> {track.album}
                </li>
              ))}
            </ul>
        </div>
    );
}

export default Tracklist;