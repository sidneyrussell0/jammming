import React, { useCallback } from 'react';

const Track = (props) => {
    const addTrack = useCallback(
        (event) => {
            props.onAdd(props.track);
        },
        [props.onAdd, props.track]
    );
//this function should trigger when the user presses the "add"
//button (add to css)
    const removeTrack = useCallback(
        (event) => {
            props.onRemove(props.track);
        },
        [props.onRemove, props.track]
    );
//this function should trigger when the user presses the "remove"
//button (add to css)
    const renderAction = () => {};

    return (
        <div>
            <p id='name'>Song Name:</p>
            <input/>
            <p id='artist'>Artist:</p>
            <input/>
            <p id='album'>Album:</p>
            <input/>
        </div>
    );
};

export default Track;