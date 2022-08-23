import { MysqlError, OkPacket } from "mysql";
import {
    RecipeTableRecord,
    CategoryTableRecord,
    MethodTableRecord,
    ImageTableRecord,
    RecipeJSON,
    RecipeSQL,
    SearchFilters
} from "./types";

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

const getRecipes = (limit: number, callback: (results: RecipeJSON[]) => void) => {
    connection.query(
        `SELECT * FROM recipes
        LEFT JOIN category ON recipes.id = category.id
        LEFT JOIN method ON recipes.id = method.id
        LEFT JOIN image ON recipes.id = image.id
        LIMIT ${limit}`,
        function (error: MysqlError, results: RecipeSQL[]) {
            if (error) throw error
            callback(sqlToObj(results))
        });
}

const getImageById = (id: string, callback: (image: string) => void) => {
    connection.query(
        'SELECT image FROM image WHERE id = ?', id,
        function (error: MysqlError, results: RecipeSQL[]) {
            if (error) throw error
            // Return image as Buffer to callback function
            callback(results[0].image)
        }
    )
}

const searchByName = (name: string, callback: (results: RecipeSQL[]) => void) => {
    connection.query(
        `SELECT * FROM recipes
        LEFT JOIN category ON recipes.id = category.id
        LEFT JOIN method ON recipes.id = method.id
        LEFT JOIN image ON recipes.id = image.id
        WHERE recipes.name REGEXP ?`, name,
        function (error: MysqlError, results: RecipeSQL[]) {
            if (error) throw error
            callback(sqlToObj(results))
        }
    )
}

type RowDataPacket = {
    'COUNT(name)': number
}
const searchByExactName = (name: string, callback: ({ match, count }: { match: boolean, count: number }) => void) => {
    connection.query(
        'SELECT COUNT(name) FROM recipes WHERE name = ?', name,
        function (error: MysqlError, results: RowDataPacket[]) {
            if (error) throw error
            let match = false
            const count: number = results[0]['COUNT(name)']
            if (count > 0) {
                match = true
            }
            // console.log({ match, count })
            callback({ match, count })
        }
    )
}

const searchWithFilters = (filters: SearchFilters, callback: (results: RecipeJSON[]) => void) => {
    const query = setQuery(filters)
    connection.query(
        `SELECT * FROM recipes
        LEFT JOIN category ON recipes.id = category.id
        LEFT JOIN method ON recipes.id = method.id
        LEFT JOIN image ON recipes.id = image.id
        WHERE ${query}`,
        function (error: MysqlError, results: RecipeSQL[]) {
            if (error) throw error
            callback(sqlToObj(results))
        }
    )
}

const setQuery = (filters: SearchFilters): string => {
    let query: string[] = []
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

type InsertRecipeResults = {
    recipes: OkPacket,
    category: OkPacket,
    method: OkPacket,
    image: OkPacket
}

const insertRecipe = (
    recipeData: RecipeTableRecord,
    categoryData: CategoryTableRecord,
    methodData: MethodTableRecord,
    imageData: ImageTableRecord,
    callback: (allResults: InsertRecipeResults) => void) => {

    let allResults = {
        recipes: {},
        category: {},
        method: {},
        image: {}
    } as InsertRecipeResults

    connection.query(`INSERT INTO recipes SET ?`, recipeData, function (error: MysqlError, results: OkPacket) {
        if (error) {
            deleteRecipeById(recipeData.id)
            throw error
        }
        allResults['recipes'] = results
    });
    connection.query(`INSERT INTO category SET ?`, categoryData, function (error: MysqlError, results: OkPacket) {
        if (error) {
            deleteRecipeById(recipeData.id)
            throw error
        }
        allResults['category'] = results
    });
    connection.query(`INSERT INTO method SET ?`, methodData, function (error: MysqlError, results: OkPacket) {
        if (error) {
            deleteRecipeById(recipeData.id)
            throw error
        }
        allResults['method'] = results
    });
    connection.query(`INSERT INTO image SET ?`, imageData, function (error: MysqlError, results: OkPacket) {
        if (error) {
            deleteRecipeById(recipeData.id)
            throw error
        }
        allResults['image'] = results
        callback(allResults)
    });
}

const deleteRecipeById = (id: string) => {
    const tables = ['image', 'method', 'category', 'recipes']
    tables.forEach(table => {
        connection.query(`DELETE FROM ${table} WHERE id=?`, [id], function (error: MysqlError, results: OkPacket) {
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