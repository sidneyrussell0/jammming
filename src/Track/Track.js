import React, { useCallback } from 'react';
import "./Track.css";

function Track(props) {
    const addTrack = useCallback(() => {
            props.onAdd(props.track);
        }, [props]);
//this function should trigger when the user presses the "add"
//button (add to css)

    const removeTrack = useCallback(() => {
            props.onRemove(props.track);
        }, [props]);
//this function should trigger when the user presses the "remove"
//button (add to css)

    const renderAction = () => {
        if (props.isRemoval) {
            return <button className="Track-action" onClick={removeTrack}>-</button>;
        }
        return <button className="Track-action" onClick={addTrack}>+</button>;
    };

    return (
        <div className="Track">
            <div className="Track-information">
                <h3>{props.track.name}</h3>
                <p>{props.track.artist} | {props.track.album}</p>
            </div>
            {renderAction()}
        </div>
    );
}

export default Track;