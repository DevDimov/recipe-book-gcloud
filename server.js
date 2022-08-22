// Load environment variables
const path = require('path')
const fs = require("fs");
require('dotenv')

// Import database CRUD actions
const mysql = require('./server/mysql.js')
const { deleteMulterImage } = require('./server/util.js')

const { nanoid } = require('nanoid')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// Set up express
const express = require('express')
const app = express()
const port = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, './client/build'), { extensions: ['html', 'css', 'js', 'svg'] }))

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

app.get('/recipes/:limit', async (req, res) => {
    try {
        const limit = parseInt(req.params.limit)
        mysql.getRecipes(limit, function callback(results) {
            return res.status(200).json(results)
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

app.get('/images/:id', async (req, res) => {
    const id = req.params.id
    try {
        mysql.getImageById(id, function callback(result) {
            return res.end(result)
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

app.post('/insert', upload.single('file'), async (req, res) => {
    const filePath = req.file.path
    try {
        const recipeData = {
            id: nanoid(10),
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            prepTime: parseInt(req.body.prepTime),
            servings: parseInt(req.body.servings)
        }

        const categories = req.body.category.split(' && ')
        const categoryData = {
            id: recipeData.id,
            category1: categories[0],
            category2: categories[1],
            category3: categories[2],
        }

        const methodData = {
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
        console.log('Method data', methodData) // for dev

        const imageData = {
            id: recipeData.id,
            image: fs.readFileSync(filePath)
        }

        mysql.insertRecipe(recipeData, categoryData, methodData, imageData, function callback(results) {
            return res.status(200).json({ insertedId: recipeData.id, results: results })
        })

    } catch (err) {
        return res.status(500).json({ error: err.message })
    } finally {
        deleteMulterImage(filePath)
    }
})

app.post('/searchByName', async (req, res) => {
    try {
        mysql.searchByName(req.body.name, function callback(result) {
            return res.status(200).json(result)
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }

})

app.post('/searchByExactName', (req, res) => {
    try {
        mysql.searchByExactName(req.body.name, function callback(result) {
            return res.status(200).json(result)
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

app.post('/searchWithFilters', (req, res) => {
    // console.log(req.body) // For dev
    try {
        mysql.searchWithFilters(req.body, function callback(result) {
            return res.status(200).json(result)
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

app.listen(port, () => {
    console.log('Server started at http://localhost:' + port)
})