const checkDuplicateName = async (query) => {
    return fetch('/searchByExactName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Duplicate name check:', data);
            return data
        })
        .catch((error) => {
            console.error('Error checking for duplicate name:', error);
            return error
        })
}

const insertDocument = async (formData) => {
    return fetch('/insert', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Successfully inserted SQL data:', data);
            return data
        })
        .catch((error) => {
            console.error('Error inserting SQL data:', error);
            return error
        })
}

// const sqlGetImage = async (recipeId) => {
//     return fetch(`/images/${recipeId}`, {
//         method: 'GET',
//     })
//         .then(response => response.blob())
//         .then(data => {
//             console.log('Success:', data);
//             // return data
//             return URL.createObjectURL(data);
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//             return { error }
//         })
// }

export {
    checkDuplicateName,
    insertDocument,
    // sqlGetImage
}