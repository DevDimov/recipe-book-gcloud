import './Recipes.css'
import RecipeCard from './RecipeCard'
import { Recipe } from '../js/types'

const Recipes = ({ data }: { data: Recipe[] }) => {

    return (
        <div className="recipes">
            {
                data.length > 0 ?
                    <>
                        {
                            data.map((item) => {
                                return (
                                    <RecipeCard
                                        key={item.id}
                                        data={item}
                                    />
                                )
                            })
                        }
                    </> : <p>No recipes to display</p>
            }
        </div>
    )
}

export default Recipes