const fs = require("fs");

const deleteMulterImage = async (filePath) => {
    fs.unlink(filePath, (err => {
        if (err) console.log(err);
        else {
            console.log("Deleted file from:" + filePath);
        }
    }));
}

const sqlToObj = (array) => {
    const data = []
    array.forEach(recipe => {
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
    return data
}

module.exports = {
    deleteMulterImage,
    sqlToObj,
}