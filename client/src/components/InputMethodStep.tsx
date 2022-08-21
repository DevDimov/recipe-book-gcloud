type InputMethodStepProps = {
    step: number,
    text: string
}

const InputMethodStep = ({ step, text }: InputMethodStepProps) => {

    return (
        <div className="input-method-step">
            <h3>{step + '.'}</h3>
            <p>{text}</p>
        </div>
    )
}

export default InputMethodStep