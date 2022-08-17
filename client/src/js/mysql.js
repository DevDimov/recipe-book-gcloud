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

const searchByName = async (nameObj) => {
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

const searchWithFilters = async (query) => {
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