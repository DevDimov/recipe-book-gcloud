type IconButtonProps = {
    customId?: string,
    iconPath: string,
    handleClick(event: React.MouseEvent<HTMLButtonElement>): void;
}

const IconButton = ({ customId, iconPath, handleClick }: IconButtonProps) => {

    return (
        <button
            type="button"
            id={customId}
            className="button IconButton"
            onClick={handleClick}
        >
            <img
                src={iconPath}
                alt=""
            />
        </button>
    )
}

export default IconButton