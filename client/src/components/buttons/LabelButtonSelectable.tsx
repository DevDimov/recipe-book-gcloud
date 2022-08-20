import './LabelButtonSelectable.css'

type LabelButtonSelectableProps = {
    text: string,
    disabled: boolean,
    handleChange(event: React.ChangeEvent<HTMLInputElement>): void,
}

const LabelButtonSelectable = ({ text, handleChange, disabled }: LabelButtonSelectableProps) => {

    return (
        <div className="labelButtonContainer">
            <input
                type="checkbox"
                id={text}
                value={text}
                onChange={handleChange}
                disabled={disabled}
            >
            </input >
            <label
                htmlFor={text}
                className="LabelButtonSelectable"
            >
                {text}
            </label>
        </div>
    )
}

export default LabelButtonSelectable