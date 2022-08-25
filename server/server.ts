import {
    RecipeTableRecord,
    CategoryTableRecord,
    ImageTableRecord,
    MethodTableRecord,
    RecipeJSON
} from './types'

// Load types
import { Request, Response, Application } from 'express'

// Load environment variables
const path = require('path')
const fs = require("fs");
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// Import database CRUD actions
const mysql = require('./mysql')
const { deleteMulterImage } = require('./util')

const { nanoid } = require('nanoid')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// Set up express
const express = require('express')
const app: Application = express()
const port = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, '../client/build'), { extensions: ['html', 'css', 'js', 'svg'] }))

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

app.get('/recipes/:limit', async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.params.limit)
        mysql.getRecipes(limit, function callback(results: RecipeJSON[]) {
            return res.status(200).json(results)
        })
    } catch (err: any) {
        return res.status(500).json({ error: err.message })
    }
})

app.get('/images/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        mysql.getImageById(id, function callback(result: (image: string) => void) {
            return res.end(result)
        })
    } catch (err: any) {
        return res.status(500).json({ error: err.message })
    }
})

app.post('/insert', upload.single('file'), async (req: any, res: any) => {
    const filePath = req.file.path
    try {
        const recipeData: RecipeTableRecord = {
            id: nanoid(10),
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            prepTime: parseInt(req.body.prepTime),
            servings: parseInt(req.body.servings)
        }

        const categories: string = req.body.category.split(' && ')
        const categoryData: CategoryTableRecord = {
            id: recipeData.id,
            category1: categories[0],
            category2: categories[1],
            category3: categories[2],
        }

        const methodData: MethodTableRecord = {
            id: recipeData.id,
            step1: req.body.step1,
            step2: req.body.step2 || null,
            step3: req.body.step3 || null,
            step4: req.body.step4 || null,
            step5: req.body.step5 || null,
            step6: req.body.step6 || null,
            step7: req.body.step7 || null,
            step8: req.body.step8 || null,
        }
        // console.log('Method data', methodData) // for dev

        const imageData: ImageTableRecord = {
            id: recipeData.id,
            image: fs.readFileSync(filePath)
        }

        mysql.insertRecipe(recipeData, categoryData, methodData, imageData, function callback(results: RecipeJSON[]) {
            return res.status(200).json({ insertedId: recipeData.id, results: results })
        })

    } catch (err: any) {
        return res.status(500).json({ error: err.message })
    } finally {
        deleteMulterImage(filePath)
    }
})

app.post('/searchByName', async (req: any, res: any) => {
    try {
        mysql.searchByName(req.body.name, function callback(result: RecipeJSON[]) {
            return res.status(200).json(result)
        })
    } catch (err: any) {
        return res.status(500).json({ error: err.message })
    }

})

app.post('/searchByExactName', (req: any, res: any) => {
    try {
        mysql.searchByExactName(req.body.name, function callback(result: { match: boolean, count: number }) {
            return res.status(200).json(result)
        })
    } catch (err: any) {
        return res.status(500).json({ error: err.message })
    }
})

app.post('/searchWithFilters', (req: any, res: any) => {
    // console.log(req.body) // For dev
    try {
        mysql.searchWithFilters(req.body, function callback(result: RecipeJSON[]) {
            return res.status(200).json(result)
        })
    } catch (err: any) {
        return res.status(500).json({ error: err.message })
    }
})

app.listen(port, () => {
    console.log('Server is listening on port ' + port)
})