import './InputWord.css'
import { MutableRefObject } from 'react'

type InputWordProps = {
    headerName: string,
    labelName: string,
    accessRef: MutableRefObject<string>
}

const InputWord = ({ headerName, labelName, accessRef }: InputWordProps) => {

    return (
        <div className="InputWord">
            <h2>{headerName}</h2>
            <label>
                <span>{labelName}</span>
                <input
                    type="text"
                    maxLength={40}
                    onChange={(e) => accessRef.current = e.currentTarget.value}
                />
            </label>
        </div>
    )
}

export default InputWord