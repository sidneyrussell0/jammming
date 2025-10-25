import React from "react";

import "./SearchResults.module.css"
import Tracklist from "../Tracklist/Tracklist";


function SearchResults(props) {
    return (
        <div className="SearchResults">
            <h2>Results</h2>
            <Tracklist tracks={props.searchResults} onAdd={props.onAdd} isRemoval={false} />
        </div>
    );
}

export default SearchResults;