import './InputSuggestions.css'

type InputSuggestionsProps = {
    filteredSuggestions: string[],
    activeSuggestion: number,
    setState({ }: InputCategoryState): void,
    inputRef: React.MutableRefObject<HTMLInputElement>
}

type InputCategoryState = {
    userInput: string,
    filteredSuggestions: string[],
    activeSuggestion: number,
    showSuggestions: boolean
}

const InputSuggestions = ({ filteredSuggestions, activeSuggestion, setState, inputRef }: InputSuggestionsProps) => {

    const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
        setState({
            userInput: e.currentTarget.innerHTML,
            filteredSuggestions: [],
            activeSuggestion: -1,
            showSuggestions: false,
        } as InputCategoryState)
        inputRef.current.focus()
    }

    return (
        <ul id="InputSuggestions">
            {
                filteredSuggestions.map((suggestion) => {
                    return (
                        <li
                            key={suggestion}
                            onClick={handleClick}
                        >
                            {suggestion}
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default InputSuggestions