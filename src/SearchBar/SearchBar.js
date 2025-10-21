import React, { useState, useCallback } from "react";

function SearchBar(props) {
    const [term, setTerm] = useState("");

    const handleTermChange = useCallback();

    const search = useCallback();

    return (
        <div className="SearchBar">
            <input 
                type="text"
                placeholder="What's Jammming?!?"/>
            <button className="SearchButton">
                Search
            </button>
        </div>
    );
};

export default SearchBar;