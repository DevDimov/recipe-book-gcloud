import React, { useState, useRef } from 'react'
import './RecipeForm.css'
import InputMethod from './InputMethod'
import ImageUpload from './ImageUpload'
import { insertDocument, checkDuplicateName } from '../js/mysql'
import Alert from './Alert'
import InputPrepTime from './InputPrepTime'
import InputServings from './InputServings'
import InputCategory from './InputCategory'
import ButtonContained from './buttons/ButtonContained'
import ButtonText from './buttons/ButtonText'
import arrowBack from '../icons/arrow_back.svg'
import { InsertResponse } from '../js/types'

const RecipeForm = ({ toggleForm }: { toggleForm(): void }) => {

    const [image, setImage] = useState<File | null>()
    const [submitStatus, setSubmitStatus] = useState('')

    const nameRef = useRef<HTMLInputElement>(null!)
    const descriptionRef = useRef<HTMLTextAreaElement>(null!)
    const categoryRef = useRef<string[]>([])
    const prepTimeRef = useRef<HTMLInputElement>(null!)
    const servingsRef = useRef<HTMLInputElement>(null!)
    const ingredientsRef = useRef<HTMLTextAreaElement>(null!)
    const methodRef = useRef<string[]>([])

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const formData = new FormData()
        formData.append('file', image ? image : 'none')
        formData.append('image', image ? image.name : '')
        formData.append('name', nameRef.current ? nameRef.current.value.trim() : '')
        formData.append('description', descriptionRef.current ? descriptionRef.current.value.trim() : '')
        formData.append('category', categoryRef.current.join(' && '))
        formData.append('prepTime', prepTimeRef.current.value || '')
        formData.append('servings', servingsRef.current.value || '')
        formData.append('ingredients', ingredientsRef.current ? ingredientsRef.current.value.trim() : '')
        formData.append('step1', methodRef.current[0] || '')
        formData.append('step2', methodRef.current[1] || '')
        formData.append('step3', methodRef.current[2] || '')
        formData.append('step4', methodRef.current[3] || '')
        formData.append('step5', methodRef.current[4] || '')
        formData.append('step6', methodRef.current[5] || '')
        formData.append('step7', methodRef.current[6] || '')
        formData.append('step8', methodRef.current[7] || '')

        const inputValid = await validateInput(formData)
        if (inputValid) {
            setSubmitStatus('Saving recipe...')
            const response = await insertDocument(formData)
            console.log(response)
            handleInsertResponse(response)
        }
    }

    const validateInput = async (formData: FormData) => {

        if (formData.get('file') === 'none') {
            setSubmitStatus('Please upload an image')
            return false
        }

        const name = formData.get('name')
        if (!name) {
            setSubmitStatus('Please add a recipe name')
            return false
        }

        if (formData.get('description') === '') {
            setSubmitStatus('Please add a recipe description')
            return false
        }
        if (formData.get('category') === '') {
            setSubmitStatus('Please add at least one recipe category')
            return false
        }
        if (formData.get('ingredients') === '') {
            setSubmitStatus('Please add a few ingredients')
            return false
        }
        if (formData.get('step1') === '') {
            setSubmitStatus('Please add at least one method step')
            return false
        }

        const nameStr = name.toString()
        const result: { match: boolean, count: number } = await checkDuplicateName({ name: nameStr })
        if (result.match) {
            setSubmitStatus(`A recipe with the same name exists. Total matches ${result.count}`)
            return false
        }

        return true
    }

    const handleInsertResponse = (response: InsertResponse) => {
        let newSubRes = ''
        if (response.insertedId) {
            newSubRes = "A new recipe has been successfully added to the database"
            // resetForm() // Comment for dev
        }
        if (response.error) {
            newSubRes = `An error has occured. ${response.error}`
        }
        setSubmitStatus(newSubRes)
    }

    const resetForm = () => {
        setImage(null)
        if (nameRef.current) {
            nameRef.current.value = ''
        }
        if (descriptionRef.current) {
            descriptionRef.current.value = ''
        }
        if (categoryRef.current) {
            categoryRef.current.length = 0
        }
        if (ingredientsRef.current) {
            ingredientsRef.current.value = ''
        }
        methodRef.current.length = 0
    }

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toggleForm()
    }

    return (
        <div className="centered">
            <div className="popup-container">

                <ButtonText
                    customId="button-arrow-back"
                    text="Back"
                    handleClick={handleCancel}
                    imagePath={arrowBack}
                />

                <form id="newEntryForm" name="newEntryForm">

                    <ImageUpload image={image ? image : null} setImage={setImage} />

                    <label>
                        <h2>Name</h2>
                        <input
                            ref={nameRef}
                            type="text"
                            name="name"
                            placeholder="Enter a unique name for your recipe"
                        />
                    </label>

                    <label>
                        <h2>Description</h2>
                        <textarea
                            ref={descriptionRef}
                            name="description"
                            rows={5}
                            maxLength={500}
                            placeholder="Describe your recipe in a few sentences"
                            required
                        />
                    </label>

                    <InputCategory accessRef={categoryRef} />
                    <InputPrepTime accessRef={prepTimeRef} />
                    <InputServings accessRef={servingsRef} />

                    <label>
                        <h2>Ingredients</h2>
                        <textarea
                            ref={ingredientsRef}
                            id="ingredients"
                            name="ingredients"
                            rows={10}
                            maxLength={1000}
                        />
                    </label>

                    <InputMethod accessRef={methodRef} />
                    <ButtonContained text="Save" handleClick={handleSubmit} />
                    <ButtonText text="Cancel" handleClick={handleCancel} />
                    <Alert text={submitStatus} />

                </form>
            </div>
        </div>
    )
}

export default RecipeForm