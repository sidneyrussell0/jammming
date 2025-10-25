import React, { useState, useCallback } from "react";
import "./SearchBar.module.css";

function SearchBar({ onSearch }) {
    const [term, setTerm] = useState("");

    const handleTermChange = (e) => {
        setTerm(e.target.value);
    };

    const handleSearch = () => {
        onSearch(term);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="SearchBar">
            <input 
                placeholder="What's Jammming?!?"
                value={term}
                onChange={handleTermChange}
                onKeyDown={handleKeyPress}
                
            />
            <button className="SearchButton" onClick={handleSearch}>
                SEARCH
            </button>
        </div>
    );
}

export default SearchBar;