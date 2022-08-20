import React from "react"
import searchIcon from '../../icons/search.svg'

type SearchButtonProps = {
    handleClick(event: React.MouseEvent<HTMLButtonElement>): void,
}

const SearchButton = ({ handleClick }: SearchButtonProps) => {

    return (
        <button
            type="button"
            id="searchButton"
            className="button IconButton"
            onClick={handleClick}
            data-testid='searchButton'
        >
            <img
                id="searchIcon"
                src={searchIcon}
                alt=""
            />
        </button>
    )
}

export default SearchButton