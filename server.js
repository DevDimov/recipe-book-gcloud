// Load environment variables
const path = require('path')
const fs = require("fs");
require('dotenv')

// Import database CRUD actions
const mysql = require('./server/mysql.js')

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

app.post('/insert', upload.single('file'), async (req, res) => {
    
    try {
        const newRecipe = {
            id: nanoid(10),
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            prepTime: parseInt(req.body.prepTime),
            servings: parseInt(req.body.servings) 
        }
        const recipeResponse = mysql.insertRecipe(newRecipe)
        console.log(recipeResponse)

        const categories = req.body.category.split(',')
        const categoryData = {
            id: newRecipe.id,
            category1: categories[0],
            category2: categories[1],
            category3: categories[2],
        }
        const categoryResponse = mysql.insertCategory(categoryData)
        console.log(categoryResponse)

        const method = req.body.method.split(',')
        const methodData = {
            id: newRecipe.id,
            method1: method[0],
            method2: method[1],
            method3: method[2],
            method4: method[3],
            method5: method[4],
            method6: method[5],
            method7: method[6],
            method8: method[7],
        }
        const methodResponse = mysql.insertMethod(methodData)
        console.log(methodResponse)

        const imageData = {
            id: newRecipe.id,
            image: fs.createReadStream(req.file.path)
        }
        const imageResponse = mysql.insertImage(imageData)
        console.log(imageResponse)
        
        // const docId = mongoResponse.insertedId

        // s3Response = await s3UploadObject(req.file, docId)
        // if (s3Response.error) {
        //     mongodb.deleteDocumentById(docId)
        //     return res.status(404).json({ error: 'Unable to upload image' })
        // }
        // mysql.deleteRecipeById(newRecipe.id, req.file.path)

        return res.status(200).json({ insertedId: newRecipe.id, recipe: recipeResponse, image: imageResponse })

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

app.get('/images/:key', async (req, res) => {
    const objectKey = req.params.key
    // console.log(objectKey)
    try {
        const image = await s3GetObject(objectKey)
        // res.writeHead(200, { 'Content-Type': 'image/jpeg' })
        res.end(image) // Send the file data to the browser.
        // return res.send(response)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

app.get('/recipes/:limit', async (req, res) => {
    try {
        const limit = parseInt(req.params.limit)
        const response = await mongodb.getLatestDocuments(limit)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

app.post('/searchByName', async (req, res) => {
    try {
        const response = await mongodb.searchByName(req.body)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

app.post('/searchByExactName', async (req, res) => {
    try {
        const mongoResponse = await mongodb.searchByExactName(req.body.name)
        const response = { _id: mongoResponse ? mongoResponse._id.toString() : '' }
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

app.post('/searchWithFilters', async (req, res) => {
    try {
        const response = await mongodb.searchWithFilters(req.body)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

app.post('/upsert', async (req, res) => {
    try {
        const response = await mongodb.upsertDocument(req.body)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// app.get('/test', async (req, res) => {
//     const fs = require("fs");

//     try {
//         const image = fs.readFileSync("D:\\Visual Studio Code\\recipe-book\\server\\test\\pending-image")
//         res.writeHead(200, { 'Content-Type': 'image/jpeg' })
//         res.end(image) // Send the file data to the browser.
//         // return image
//     } catch (err) {
//         return res.status(500).json({ error: err.message })
//     }
// })

app.listen(port, () => {
    console.log('Server started at http://localhost:' + port)
})