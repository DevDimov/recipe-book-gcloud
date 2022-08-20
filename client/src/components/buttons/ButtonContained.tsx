type ButtonContainedProps = {
    text: string,
    handleClick(event: React.MouseEvent<HTMLButtonElement>): void;
}

const ButtonContained = ({ text, handleClick }: ButtonContainedProps) => {

    return (
        <button
            type="button"
            className="button button--contained"
            onClick={handleClick}
        >
            {text}
        </button>
    )
}

export default ButtonContained