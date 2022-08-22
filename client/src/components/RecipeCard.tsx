import { useState } from 'react'
import './RecipeCard.css'
import Recipe from './Recipe'
import ImagePreview from './ImagePreview'
import { Recipe as RecipeType } from '../js/types'

const RecipeCard = ({ data }: { data: RecipeType }) => {

    const [showRecipe, setShowRecipe] = useState(false)

    const handleRecipeClose = () => setShowRecipe(false)
    const handleCardClick = () => setShowRecipe(true)

    return (
        <>
            <div className="card card--recipe">
                <button
                    className="button button--card"
                    onClick={handleCardClick}
                >
                    <ImagePreview src={data.image} />
                    <h2 className="card-recipe__title">{data.name}</h2>
                    <p className="card-recipe__supporting-text">{data.description}</p>
                    <div className="card-recipe__tags">
                        <h3>{data.category[0].toUpperCase()}</h3>
                        <h3>{`${data.prepTime} MINS`}</h3>
                        <h3>{`SERVES ${data.servings}`}</h3>
                    </div>
                </button>
            </div>
            {showRecipe ?
                <Recipe
                    handleClose={handleRecipeClose}
                    data={data}
                />
                : null
            }
        </>
    )
}

export default RecipeCard