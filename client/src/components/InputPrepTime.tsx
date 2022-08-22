import { useRef, useEffect, MutableRefObject } from 'react'
import './InputNumber.css'

const InputPrepTime = ({ accessRef }: { accessRef: MutableRefObject<HTMLInputElement> }) => {

    const inputRef = useRef<HTMLInputElement>(null!)

    useEffect(() => {
        accessRef.current = inputRef.current
    }, [inputRef])

    return (
        <label>
            <h2>Preparation time</h2>
            <div className="input-number">
                <input
                    ref={inputRef}
                    type="number"
                    id="prep-time"
                    name="prep-time"
                    min="5"
                    max="90"
                    step="5"
                    defaultValue="90"
                />
                <span>minutes or less</span>
            </div>
        </label>
    )
}

export default InputPrepTime