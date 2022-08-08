const fs = require("fs");

const deleteMulterImage = async (filePath) => {
    fs.unlink(filePath, (err => {
        if (err) console.log(err);
        else {
            console.log("Deleted file from:" + filePath);
        }
    }));
}

module.exports = {
    deleteMulterImage
}