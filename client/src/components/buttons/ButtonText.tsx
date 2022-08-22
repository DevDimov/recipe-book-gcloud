type ButtonTextProps = {
    customId?: string,
    text: string,
    imagePath?: string,
    handleClick(event: React.MouseEvent<HTMLButtonElement>): void;
}

const ButtonText = ({ customId, text, handleClick, imagePath }: ButtonTextProps) => {

    return (
        <button
            type="button"
            id={customId}
            className="button button--text"
            onClick={handleClick}
        >
            {imagePath && <img
                src={imagePath}
                alt=""
            />}
            {text}
        </button>
    )
}

export default ButtonText