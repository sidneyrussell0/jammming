import React, { useState, useCallback } from "react";
import "./SearchBar.module.css";

function SearchBar(props) {
    const [term, setTerm] = useState("");

    const handleTermChange = useCallback((event) => {
        setTerm(event.target.value);
    }, []);

    const search = useCallback(() => {
        props.onSearch(term); //triggers search from App.js
    }, [props.onSearch, term]);

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
            <button className="SearchButton" onClick={search}>
                SEARCH
            </button>
        </div>
    );
}

export default SearchBar;