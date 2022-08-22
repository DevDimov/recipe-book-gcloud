type ButtonOutlinedProps = {
    text: string,
    iconPath?: string,
    handleClick(event: React.MouseEvent<HTMLButtonElement>): void;
}

const ButtonOutlined = ({ text, iconPath, handleClick }: ButtonOutlinedProps) => {

    return (
        <button
            type="button"
            className="button button--outlined"
            onClick={handleClick}
        >
            {text}
            {iconPath && <img src={iconPath} alt="" />}
        </button>
    )
}

export default ButtonOutlined