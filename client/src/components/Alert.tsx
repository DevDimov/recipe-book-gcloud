import './Alert.css'

const Alert = ({ text }: { text: string }) => {
    return (
        <div className="alert">
            <p>{text}</p>
        </div>
    )
}

export default Alert