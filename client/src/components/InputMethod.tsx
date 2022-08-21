import React, { useState, useEffect } from 'react'
import './InputMethod.css'
import InputMethodStep from './InputMethodStep'
import ButtonOutlined from './buttons/ButtonOutlined'
import addIcon from '../icons/add.svg'
import closeIcon from '../icons/close.svg'
import { accessRefArrayStringType } from '../js/types'

const InputMethod = ({ accessRef }: accessRefArrayStringType) => {

    const [value, setValue] = useState('')
    const [showPlaceholder, setShowPlaceholder] = useState(true)
    const [method, setMethod] = useState<string[]>([])

    useEffect(() => {
        let bool = true
        if (value) {
            bool = false
        }
        setShowPlaceholder(bool)
    }, [value])

    useEffect(() => {
        accessRef.current = method
    }, [method])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value)
    }

    const addMethodStep = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        let input = ''
        if (value) {
            input = value.trim()
            if (input.length > 1) {
                const newMethod = [...method, input]
                setMethod(newMethod)
                setValue('')
            }
        }
    }

    const removeMethodStep = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        let newMethod = method.slice(0, method.length - 1)
        setMethod(newMethod)
    }

    return (
        <div id="MethodInput">

            <label>

                <h2>Method</h2>

                <div id="instruction-container">
                    {method.length > 0 && method.map((data, index) => {
                        return (<InputMethodStep
                            key={data.slice(0, 10)}
                            step={index + 1}
                            text={data}
                        />)
                    })}
                </div>

                <div className="textarea-container" >
                    <textarea
                        name="method-textarea"
                        rows={5}
                        maxLength={500}
                        onChange={handleChange}
                        value={value}
                        required={method.length === 0 ? true : false}
                    />

                    {showPlaceholder && <div><h2>{method.length + 1 + '.'}</h2></div>}

                </div >

            </label>

            <div id="buttons-container">

                <ButtonOutlined
                    text="Add"
                    iconPath={addIcon}
                    handleClick={addMethodStep}
                />

                {method.length > 0 &&
                    <ButtonOutlined
                        text='Remove last'
                        iconPath={closeIcon}
                        handleClick={removeMethodStep}
                    />
                }

            </div>

        </div>
    )
}

export default InputMethod