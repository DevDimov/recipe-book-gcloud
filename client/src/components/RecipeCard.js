import { useEffect, useState } from 'react'
import './RecipeCard.css'
import Recipe from './Recipe'
import ImagePreview from './ImagePreview'
import { sqlGetImage } from '../js/mysql'

const RecipeCard = ({ data }) => {

    const [showRecipe, setShowRecipe] = useState(false)
    const [image, setImage] = useState('')

    const handleOnClose = () => setShowRecipe(false)

    // useEffect(() => {
    //     const fetchImage = async () => {
    //         const newImage = await sqlGetImage(data.id)
    //         if (!newImage.error) setImage(newImage)
    //     }
    //     fetchImage()
    // }, [data])
    // comment the above hook when debugging

    return (
        <>
            <div className="card card--recipe">
                <button
                    className="button button--card"
                    onClick={() => setShowRecipe(true)}
                >
                    {/* <ImagePreview src={image ? image : './images/pending-image.jpg'} /> */}
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
                    handleOnClose={handleOnClose}
                    data={data}
                    // image={image}
                />
                : null
            }
        </>
    )
}

export default RecipeCard