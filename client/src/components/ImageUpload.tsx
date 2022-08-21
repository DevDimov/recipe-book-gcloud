import { useRef } from 'react'
import './ImageUpload.css'
import ButtonOutlined from './buttons/ButtonOutlined'
import uploadIcon from '../icons/file_upload.svg'
import ImagePreview from './ImagePreview'

type ImageUploadProps = {
    image: Blob | MediaSource,
    setImage(image: File | null): void,
}

const ImageUpload = ({ image, setImage }: ImageUploadProps) => {

    const imageRef = useRef<HTMLInputElement>(null!)

    const handleClick = () => {
        imageRef.current.click()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const fileList = imageRef.current.files
        let newImage: File | null = null

        if (fileList !== null && fileList.length > 0) {
            if (fileList[0].type.startsWith('image/')) {
                newImage = fileList[0]
            }
            else {
                console.log('Please upload an image file in jpg format.')
            }
        }
        setImage(newImage)
    }

    const handleClosePreview = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setImage(null)
    }

    return (
        <div className="image-upload">
            {
                image !== null ?
                    <ImagePreview
                        src={URL.createObjectURL(image)}
                        handleClose={handleClosePreview}
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
                            onChange={handleChange}
                        />
                    </div>
            }
        </div>
    )
}

export default ImageUpload

