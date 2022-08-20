import { useRef } from 'react'
import './ImageUpload.css'
import ButtonOutlined from './buttons/ButtonOutlined'
import uploadIcon from '../icons/file_upload.svg'
import ImagePreview from './ImagePreview'

const ImageUpload = ({ image, setImage }) => {

    const imageRef = useRef()

    const handleClick = () => {
        imageRef.current.click()
    }

    const selectImage = async (e) => {
        e.preventDefault();

        const file = imageRef.current.files
        let newImage = null

        if (file.length > 0) {
            if (file[0].type.startsWith('image/')) {
                newImage = file[0]
            }
            else {
                console.log('Please upload an image file in jpg format.')
            }
        }
        setImage(newImage)
    }

    const onClosePreview = (e) => {
        e.preventDefault();
        setImage(null)
    }

    return (
        <div className="image-upload">
            {
                image !== null ?
                    <ImagePreview
                        src={URL.createObjectURL(image)}
                        handleOnClose={onClosePreview}
                    />
                    :
                    <div className="button--image-upload">
                        <ButtonOutlined
                            text="Upload image"
                            iconPath={uploadIcon}
                            handleClick={handleClick}
                        />
                        <input
                            ref={imageRef}
                            type="file"
                            name="filename"
                            className="custom-file-input"
                            accept=".jpg,.jpeg"
                            onChange={selectImage}
                        />
                    </div>
            }
        </div>
    )
}

export default ImageUpload

