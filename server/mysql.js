// Load environment variables
const path = require('path')
const fs = require("fs");
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// Connect to database
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'recipe_book'
});

const testConnection = () => {
    connection.connect();
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    });
    connection.end();
}

// const { MongoClient } = require('mongodb')
// const client = new MongoClient(process.env.MONGODB_URI)

// const deleteDocument = async (query) => {
//     try {
//         await client.connect()
//         const result = await client.db("recipe_book").collection("vd_recipes").deleteOne(query)
//         if (result.deletedCount === 1) {
//             console.log("Successfully deleted one document.");
//         } else {
//             console.log("No documents matched the query. Deleted 0 documents.");
//         }
//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }

// const searchByName = async (query) => {
//     let result = []
//     try {
//         await client.connect()
//         const cursor = client.db("recipe_book").collection("vd_recipes").find({ name: { $regex: query.name, $options: 'i' } })
//         await cursor.forEach(item => result.push(item))
//         return result
//     } catch (e) {
//         console.error(e);
//         return result
//     } finally {
//         await client.close();
//     }
// }

// const searchByExactName = async (name) => {
//     let result = []
//     try {
//         await client.connect()
//         result = await client.db("recipe_book").collection("vd_recipes").findOne({ name }, { projection: { _id: 1 } })
//         return result
//     } catch (e) {
//         console.error(e);
//         return result
//     } finally {
//         await client.close();
//     }
// }

// const searchWithFilters = async (filters) => {
//     let result = []
//     try {
//         await client.connect()
//         const query = setQuery(filters)
//         console.log(query)
//         const cursor = client.db("recipe_book").collection("vd_recipes").find(query)
//         await cursor.forEach(item => result.push(item))
//         return result
//     } catch (e) {
//         console.error(e);
//         return result
//     } finally {
//         await client.close();
//     }
// }

// const setQuery = (filters) => {
//     let query = {}
//     for (let key of Object.keys(filters)) {
//         if (key === 'category' && filters[key].length > 0) query[key] = { $all: filters.category }
//         if (key === 'prepTime' && filters[key] < 90) query[key] = { $lte: filters.prepTime }
//         if (key === 'servings' && filters[key] > 2) query[key] = { $gte: filters.servings }
//         if (key === 'ingredientMatch' && filters[key].length > 2) query['ingredients'] = { $regex: filters.ingredientMatch, $options: 'i' }
//     }
//     return query
// }

// const getLatestDocuments = async (limit) => {
//     try {
//         await client.connect()
//         const cursor = client.db("recipe_book").collection("vd_recipes").find({}, { limit })
//         return await cursor.toArray()
//     } catch (e) {
//         console.error(e);
//         return []
//     } finally {
//         await client.close();
//     }
// }

const insertRecipe = (newRecipe) => {
    connection.connect();

    var query = connection.query('INSERT INTO recipes SET ?', newRecipe, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        console.log(fields)
    });

    connection.end();
}

const insertCategory = (categoryData) => {
    connection.connect();

    var query = connection.query('INSERT INTO category SET ?', categoryData, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        console.log(fields)
    });

    connection.end();
}

const insertMethod = (methodData) => {
    connection.connect();

    var query = connection.query('INSERT INTO method SET ?', methodData, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        console.log(fields)
    });

    connection.end();
}

const insertImage = (imageData) => {
    connection.connect();

    var query = connection.query('INSERT INTO image SET ?', imageData, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        console.log(fields)
    });

    connection.end();
}


// const testRecipe = {
//     id: nanoid(10),
//     name: 'req.body.name',
//     description: 'req.body.description',
//     ingredients: 'req.body.ingredients',
//     prepTime: 35,
//     servings: 2
// }
// insertRecipe(testRecipe)

const deleteRecipeById = async (id, filePath) => {
    connection.connect();

    connection.query('DELETE FROM recipes WHERE id=?', [id], function (error, results, fields) {
        if (error) throw error;
        console.log(results);
    });

    connection.query('DELETE FROM category WHERE id=?', [id], function (error, results, fields) {
        if (error) throw error;
        console.log(results);
    });

    connection.query('DELETE FROM method WHERE id=?', [id], function (error, results, fields) {
        if (error) throw error;
        console.log(results);
    });

    connection.query('DELETE FROM image WHERE id=?', [id], function (error, results, fields) {
        if (error) throw error;
        console.log(results);
    });

    connection.end();

    deleteMulterImage(filePath)
}

const deleteMulterImage = async (filePath) => {
    fs.unlink(filePath, (err => {
        if (err) console.log(err);
        else {
            console.log("Deleted file from:" + filePath);
        }
    }));
}

module.exports = {
    testConnection,
    // searchByName,
    // searchByExactName,
    // searchWithFilters,
    // getLatestDocuments,
    insertRecipe,
    insertCategory,
    insertMethod,
    insertImage,
    deleteRecipeById
}