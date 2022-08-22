// Load environment variables
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const { sqlToObj } = require('./util')

// Connect to database
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'recipe_book'
});
connection.connect();

const getRecipes = (limit, callback) => {
    connection.query(
        `SELECT * FROM recipes
        LEFT JOIN category ON recipes.id = category.id
        LEFT JOIN method ON recipes.id = method.id
        LEFT JOIN image ON recipes.id = image.id
        LIMIT ${limit}`,
        function (error, results) {
            if (error) throw error
            callback(sqlToObj(results))
        });
}

const getImageById = (id, callback) => {
    connection.query(
        'SELECT image FROM image WHERE id = ?', id,
        function (error, results) {
            if (error) throw error
            // Return image as Buffer to callback function
            callback(results[0].image)
        }
    )
}

const searchByName = (name, callback) => {
    connection.query(
        `SELECT * FROM recipes
        LEFT JOIN category ON recipes.id = category.id
        LEFT JOIN method ON recipes.id = method.id
        LEFT JOIN image ON recipes.id = image.id
        WHERE recipes.name REGEXP ?`, name,
        function (error, results) {
            if (error) throw error
            callback(sqlToObj(results))
        }
    )
}

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
        }
    )
}

const searchWithFilters = (filters, callback) => {
    const query = setQuery(filters)
    connection.query(
        `SELECT * FROM recipes
        LEFT JOIN category ON recipes.id = category.id
        LEFT JOIN method ON recipes.id = method.id
        LEFT JOIN image ON recipes.id = image.id
        WHERE ${query}`,
        function (error, results) {
            if (error) throw error
            callback(sqlToObj(results))
        }
    )
}

const setQuery = (filters) => {
    let query = []
    for (let key of Object.keys(filters)) {
        if (key === 'category' && filters[key].length > 0) {
            const categories = filters.category.map(cat => `${connection.escape(cat)}`).join(',')
            query.push(`category1 IN (${categories}) OR category2 IN (${categories}) OR category3 IN (${categories})`)
        }
        if (key === 'prepTime') query.push(`prepTime <= ${connection.escape(filters.prepTime)}`)
        if (key === 'servings') query.push(`servings > ${connection.escape(filters.servings)}`)
        if (key === 'ingredientMatch' && filters[key].length > 2) {
            query.push(`ingredients REGEXP ${connection.escape(filters.ingredientMatch)}`)
        }
    }
    return query.join(' AND ')

}

const insertRecipe = (recipeData, categoryData, methodData, imageData, callback) => {
    let allResults = {}
    connection.query(`INSERT INTO recipes SET ?`, recipeData, function (error, results) {
        if (error) {
            deleteRecipeById(recipeData.id)
            throw error
        }
        allResults['recipes'] = results
    });
    connection.query(`INSERT INTO category SET ?`, categoryData, function (error, results) {
        if (error) {
            deleteRecipeById(recipeData.id)
            throw error
        }
        allResults['category'] = results
    });
    connection.query(`INSERT INTO method SET ?`, methodData, function (error, results) {
        if (error) {
            deleteRecipeById(recipeData.id)
            throw error
        }
        allResults['method'] = results
    });
    connection.query(`INSERT INTO image SET ?`, imageData, function (error, results) {
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
        connection.query(`DELETE FROM ${table} WHERE id=?`, [id], function (error, results) {
            if (error) {
                console.log('couldnt delete from', table)
                throw error
            }
            console.log(table, results);
        });
    })
}

module.exports = {
    getRecipes,
    getImageById,
    searchByName,
    searchByExactName,
    searchWithFilters,
    insertRecipe,
}