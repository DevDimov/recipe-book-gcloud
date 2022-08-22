import { useRef, useEffect } from 'react'
import './InputNumber.css'
import { AccessRefInputType } from '../js/types'

const InputServings = ({ accessRef }: AccessRefInputType) => {

    const inputRef = useRef<HTMLInputElement>(null!)

    useEffect(() => {
        accessRef.current = inputRef.current
    }, [inputRef])

    return (
        <label>
            <h2>Servings</h2>
            <div className="input-number">
                <input
                    ref={inputRef}
                    type="number"
                    id="servings"
                    name="servings"
                    min="1"
                    max="8"
                    step="1"
                    defaultValue="2"
                    required
                />
                <span>people or more</span>
            </div>
        </label>
    )
}

export default InputServings