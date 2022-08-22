import './Recipe.css'
import ButtonOutlined from './buttons/ButtonOutlined'
import ImagePreview from './ImagePreview'
import arrowBack from '../icons/arrow_back.svg'
import Tag from './Tag'
import ButtonText from './buttons/ButtonText'
import { Recipe as RecipeType } from '../js/types'

type RecipeProps = {
    handleClose(): void,
    data: RecipeType,
}

const Recipe = ({ handleClose, data }: RecipeProps) => {

    return (
        <div className="centered">
            <div className="popup-container">
                <div className="recipe">

                    <ButtonText
                        customId="button-arrow-back"
                        text="Back"
                        handleClick={handleClose}
                        imagePath={arrowBack}
                    />

                    <ImagePreview src={data.image} />

                    <div>
                        <h1>{data.name}</h1>
                        <div className="tag-container">
                            {
                                data.category.map((name) => {
                                    if (name) {
                                        return (
                                            <Tag text={name} key={name} />
                                        )
                                    }
                                })
                            }
                            <Tag text={`${data.prepTime} mins`} key={`${data.prepTime} mins`} />
                            <Tag text={`Serves ${data.servings}`} key={`Serves ${data.servings}`} />
                        </div>
                        <p className="recipe__section-body">{data.description}</p>
                    </div>

                    <div>
                        <h2 className="recipe__section-header">Ingredients</h2>
                        <p className="recipe__section-ingredients">{data.ingredients}</p>
                    </div>

                    <div>
                        <h2 className="recipe__section-header">Method</h2>
                        {
                            data.method.map((step, index) => {
                                if (step) {
                                    return (
                                        <div key={index + 1}>
                                            <h3>{`${index + 1}.`}</h3>
                                            <p className="recipe__section-body">{step}</p>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                    <ButtonOutlined
                        text="Close"
                        handleClick={handleClose}
                    />

                </div>
            </div>
        </div>
    )
}

export default Recipe