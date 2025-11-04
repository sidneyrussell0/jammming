import React, { useState, useCallback } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
    const [term, setTerm] = useState("");

    const handleTermChange = useCallback((event) => {
        setTerm(event.target.value);
    }, []);

    const search = useCallback(() => {
        onSearch(term); //triggers search from App.js
    }, [onSearch, term]);

    //Allows users to simply press "ENTER" to search
    const handleKeyPress = useCallback((event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            search();
        }
    }, [search]);

    return (
        <div className="SearchBar">
            <input 
                placeholder="Enter A Song, Album, or Artist"
                value={term}
                onChange={handleTermChange}
                onKeyDown={handleKeyPress}
            />
            <button type="button" className="SearchButton" onClick={search}>
                SEARCH
            </button>
        </div>
    );
}

export default SearchBar;