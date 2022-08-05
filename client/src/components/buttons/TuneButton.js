import tuneIcon from '../../icons/tune.svg'

const TuneButton = ({ handleOnClick }) => {

    return (
        <button
            type="button"
            id="tuneButton"
            className="ButtonIconClear"
            onClick={handleOnClick}
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