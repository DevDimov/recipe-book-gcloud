import './ImagePreview.css'
import IconButton from './buttons/IconButton'
import closeIcon from '../icons/close.svg'

type ImagePreviewProps = {
    src: string,
    handleClose?(event: React.MouseEvent<HTMLButtonElement>): void;
}

const ImagePreview = ({ src, handleClose }: ImagePreviewProps) => {

    const style: React.CSSProperties = {
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
    }

    return (
        <div className="image-preview">
            <div style={style} />
            {
                handleClose && <IconButton
                    iconPath={closeIcon}
                    handleClick={handleClose}
                />
            }
        </div>
    )
}

export default ImagePreview