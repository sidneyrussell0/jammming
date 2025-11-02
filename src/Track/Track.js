import React, { useCallback } from 'react';
import "./Track.css";

function Track({ track, onAdd, onRemove, isRemoval }) {
    const addTrack = useCallback(() => {
            onAdd(track);
        }, [onAdd, track]);
//this function should trigger when the user presses the "add"
//button (add to css)

    const removeTrack = useCallback(() => {
            onRemove(track);
        }, [onRemove, track]);
//this function should trigger when the user presses the "remove"
//button (add to css)

    const renderAction = () => {
        if (isRemoval) {
            return <button className="Track-action" onClick={removeTrack}>-</button>;
        }
        return <button className="Track-action" onClick={addTrack}>+</button>;
    };

    return (
        <div className="Track">
            <div className="Track-information">
                <h3 title={track.name}>{track.name}</h3>
                <p title={`${track.artist} | ${track.album}`}>
                    {track.artist} | {track.album}
                </p>
            </div>
            {renderAction()}
        </div>
    );
}

export default Track;