const checkDuplicateName = async (nameObj: { name: string }) => {
    return fetch('/searchByExactName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nameObj),
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

const insertDocument = async (formData: FormData) => {
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

const searchByName = async (nameObj: { name: string }) => {
    return fetch('/searchByName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nameObj),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            return data
        })
        .catch((error) => {
            console.error('Error:', error);
            return []
        })
}

type SearchWithFilters = {
    category: string[],
    prepTime: number,
    servings: number,
    ingredientMatch: string
}

const searchWithFilters = async (query: SearchWithFilters) => {
    return fetch('/searchWithFilters', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            return data
        })
        .catch((error) => {
            console.error('Error:', error);
            return error
        })
}

export {
    checkDuplicateName,
    insertDocument,
    searchByName,
    searchWithFilters,
}