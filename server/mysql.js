// Load environment variables
const path = require('path')
const fs = require("fs");
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// Connect to database
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'recipe_book'
});
connection.connect();

const testConnection = () => {
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    });
}

const test = () => {
    const imageData = {
        id: 'Xu1QWLCFdM',
        // image: fs.createReadStream('./uploads/one-pan-pasta.jpg')
        image: fs.readFileSync('./uploads/one-pan-pasta.jpg')
        // image: fs.readFileSync(filePath)
    }
    // console.log(imageData.image instanceof Buffer)
    // console.log(imageData.image)
    // connection.query('INSERT INTO image SET ?', imageData, function (error, results, fields) {
    //     if (error) throw error
    //     console.log(results);
    // });
    // connection.query('UPDATE image SET id = ?, image = ? WHERE id = ?', [imageData.id, imageData.image, imageData.id], function (error, results, fields) {
    //     if (error) throw error
    //     console.log(results);
    // });

    connection.query('SELECT image FROM image WHERE id = ?', ['Xu1QWLCFdM'], function (error, results, fields) {
        if (error) throw error
        console.log(results[0].image);
        console.log(Buffer.from(results[0].image).toString('base64'))
    });
}
// test()


const getRecipes = (limit, callback) => {
    const data = []
    connection.query(
        `SELECT * FROM recipes
        LEFT JOIN category ON recipes.id = category.id
        LEFT JOIN method ON recipes.id = method.id
        LEFT JOIN image ON recipes.id = image.id
        LIMIT ${limit}`,

        function (error, results) {
            if (error) throw error
            results.forEach(recipe => {
                var recipeData = {
                    'id': recipe.id,
                    'name': recipe.name,
                    'description': recipe.description,
                    'ingredients': recipe.ingredients,
                    'prepTime': recipe.prepTime,
                    'servings': recipe.servings,
                    'category': [
                        recipe.category1,
                        recipe.category2,
                        recipe.category3
                    ],
                    'method': [
                        recipe.step1,
                        recipe.step2,
                        recipe.step3,
                        recipe.step4,
                        recipe.step5,
                        recipe.step6,
                        recipe.step7,
                        recipe.step8,
                    ],
                    'image': 'data:image/jpg;base64,' + Buffer.from(recipe.image).toString('base64')
                }
                data.push(recipeData)
            })
            callback(data)
        });
}

const getImageById = (id, callback) => {
    connection.query(
        'SELECT image FROM image WHERE id = ?', [id],
        function (error, results) {
            if (error) throw error
            // console.log(results[0]) // RowDataPacket { image: <Buffer 5b 6f 62 6a 65 63 74 20 4f 62 6a 65 63 74 5d> }
            // console.log(results[0].image) // <Buffer 5b 6f 62 6a 65 63 74 20 4f 62 6a 65 63 74 5d>
            callback(results[0].image)
        }
    )
}

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

const searchByExactName = (name, callback) => {
    connection.query(
        'SELECT COUNT(name) FROM recipes WHERE name = ?', name,
        function (error, results) {
            if (error) throw error
            let match = false
            const count = results[0]['COUNT(name)']
            if (count > 0) {
                match = true
            }
            // console.log({ match, count })
            callback({ match, count })
        });
}

// searchByExactName('Easy Chicken Biryan', function callback(result) {
//     console.log(result)
// })

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

const insertRecipe = (recipeData, categoryData, methodData, imageData, callback) => {
    // const tables = ['recipes', 'category', 'method', 'image']
    // const data = {
    //     'recipes': recipeData,
    //     'category': categoryData,
    //     'method': methodData,
    //     'image': imageData
    // }

    let allResults = {}
    connection.query(`INSERT INTO recipes SET ?`, recipeData, function (error, results, fields) {
        if (error) {
            deleteRecipeById(recipeData.id)
            throw error
        }
        allResults['recipes'] = results
    });
    connection.query(`INSERT INTO category SET ?`, categoryData, function (error, results, fields) {
        if (error) {
            deleteRecipeById(recipeData.id)
            throw error
        }
        allResults['category'] = results
    });
    connection.query(`INSERT INTO method SET ?`, methodData, function (error, results, fields) {
        if (error) {
            deleteRecipeById(recipeData.id)
            throw error
        }
        allResults['method'] = results
    });
    connection.query(`INSERT INTO image SET ?`, imageData, function (error, results, fields) {
        if (error) {
            deleteRecipeById(recipeData.id)
            throw error
        }
        allResults['image'] = results
        callback(allResults)
    });
}

const deleteRecipeById = (id) => {
    const tables = ['image', 'method', 'category', 'recipes']
    tables.forEach(table => {
        connection.query(`DELETE FROM ${table} WHERE id=?`, [id], function (error, results, fields) {
            if (error) {
                console.log('couldnt delete from', table)
                throw error
            }
            console.log(table, results, fields);
        });
    })
}

// deleteRecipeById('VNx-W9TVSt')

module.exports = {
    testConnection,
    getRecipes,
    getImageById,
    // searchByName,
    searchByExactName,
    // searchWithFilters,
    // getLatestDocuments,
    insertRecipe,
    deleteRecipeById
}