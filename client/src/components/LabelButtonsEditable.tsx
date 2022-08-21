import InputCategoryLabel from "./InputCategoryLabel"

type LabelButtonsEditableProps = {
    array: string[],
    onRemove(text: string): void
}

const LabelButtonsEditable = ({ array, onRemove }: LabelButtonsEditableProps) => {

    return (
        <div className="categories-container">
            {array.map((name) => {
                return (
                    <InputCategoryLabel
                        key={name}
                        text={name}
                        onRemove={onRemove}
                    />
                )
            })}
        </div>
    )
}

export default LabelButtonsEditable