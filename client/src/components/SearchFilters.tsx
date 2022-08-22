import { useRef } from 'react'
import InputPrepTime from './InputPrepTime'
import InputServings from './InputServings'
import './SearchFilters.css'
import LabelButtonsSelectable from './LabelButtonsSelectable'
import InputWord from './InputWord'
import ButtonContained from './buttons/ButtonContained'
import ButtonText from './buttons/ButtonText'
import { searchWithFilters } from '../js/mysql'
import { Recipe } from '../js/types'

type SearchFiltersProps = {
    toggleSearchFilters(): void,
    setRecipes(data: Recipe[]): void
}

const SearchFilters = ({ toggleSearchFilters, setRecipes }: SearchFiltersProps) => {

    const categoryRef = useRef<string[]>([]!)
    const prepTimeRef = useRef<HTMLInputElement>(null!)
    const servingsRef = useRef<HTMLInputElement>(null!)
    const ingredientRef = useRef('')

    const onSearch = async () => {
        const filters = {
            category: categoryRef.current,
            prepTime: parseInt(prepTimeRef.current.value),
            servings: parseInt(servingsRef.current.value),
            ingredientMatch: ingredientRef.current.trim()
        }
        // console.log(filters) // for debugging
        const newData = await searchWithFilters(filters)
        if (!newData.error) setRecipes(newData)
        toggleSearchFilters()
    }

    return (
        <div className="centered">
            <form
                id="search-filters"
                className="popup-container"
                name="search-filters"
            >
                <LabelButtonsSelectable
                    headerName="Category"
                    accessRef={categoryRef}
                />
                <InputPrepTime accessRef={prepTimeRef} />
                <InputServings accessRef={servingsRef} />
                <InputWord
                    headerName="Ingredient"
                    labelName="Must contain"
                    accessRef={ingredientRef}
                />
                <ButtonContained
                    text="Search"
                    handleClick={onSearch}
                />
                <ButtonText
                    text="Close"
                    handleClick={toggleSearchFilters}
                />
            </form>
        </div>
    )
}

export default SearchFilters