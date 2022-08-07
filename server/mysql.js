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

const getRecipes = (limit) => {
    const data = []
    recipe = {}

    connection.connect();
    connection.query(
        `SELECT * FROM recipes
        LEFT JOIN category ON recipes.id = category.id
        LEFT JOIN method ON recipes.id = method.id
        LEFT JOIN image ON recipes.id = image.id
        LIMIT ${limit}`,
        
        function (error, results, fields) {
            if (error) throw error
            console.log(results, fields);
            results.forEach(recipe => {
                var recipeData = {
                    id: recipe.id,
                    name: recipe.name,
                    description: recipe.description,
                    ingredients: recipe.ingredients,
                    prepTime: recipe.prepTime,
                    servings: recipe.servings,
                    category: [
                        recipe.category1,
                        recipe.category2,
                        recipe.category3
                    ],
                    method: [
                        recipe.step1,
                        recipe.step2,
                        recipe.step3,
                        recipe.step4,
                        recipe.step5,
                        recipe.step6,
                        recipe.step7,
                        recipe.step8,
                    ],
                    image: recipe.image
                }
                data.push(recipeData)
            })
        });
    connection.end();
    return data
}

const insertRecipe = (recipeData, categoryData, methodData, imageData) => {
    const tables = ['recipes', 'category', 'method', 'image']
    const data = {
        'recipes': recipeData,
        'category': categoryData,
        'method': methodData,
        'image': imageData
    }

    connection.connect();

    for (const table of tables) {
        connection.query(`INSERT INTO ${table} SET ?`, data[table], function (error, results, fields) {
            if (error) {
                deleteRecipeById(recipeData.id)
                throw error
            }
            console.log(table, results, fields);
        });
    }

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

const deleteRecipeById = async (id) => {
    const tables = ['recipes', 'category', 'method', 'image']
    connection.connect();

    for (const table of tables) {
        connection.query(`DELETE FROM ${table} WHERE id=?`, [id], function (error, results, fields) {
            if (error) {
                console.log('couldnt delete from', table)
                throw error
            }
            console.log(table, results, fields);
        });
    }

    connection.end();
}

module.exports = {
    testConnection,
    getRecipes,
    // searchByName,
    // searchByExactName,
    // searchWithFilters,
    // getLatestDocuments,
    insertRecipe,
    deleteRecipeById
}