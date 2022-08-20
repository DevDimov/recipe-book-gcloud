import tuneIcon from '../../icons/tune.svg'

type TuneButtonProps = {
    handleClick(event: React.MouseEvent<HTMLButtonElement>): void,
}

const TuneButton = ({ handleClick }: TuneButtonProps) => {

    return (
        <button
            type="button"
            id="tuneButton"
            className="ButtonIconClear"
            onClick={handleClick}
            data-testid="tuneButton"
        >
            <img
                id="tuneIcon"
                src={tuneIcon}
                alt=""
            />
        </button>
    )
}

export default TuneButton