const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const EXTENSION_HTML = '.html';
const EXTENSION_PDF = '.pdf';

//will run every day at 12:00 AM to clear any left over files
cron.schedule('0 0 0 * * *', function () {
    let folder = './';
    let filePaths = [];
    let results;
    fs.readdirSync(folder).forEach(file => {
        console.log(file);
        results.push(file);
    });
    results.filter(file => {
        if (path.extname(file).toLowerCase() === EXTENSION_HTML || path.extname(file).toLowerCase() === EXTENSION_PDF) {
            filePaths.push(file);
        }
    })
    if (filePaths.length) {
        filePaths.map(filePath => {
            return fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                    return console.log("files removed");
                }
            })
        })

    }

})
