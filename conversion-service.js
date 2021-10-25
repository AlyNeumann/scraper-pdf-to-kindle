const fs = require('fs');
const path = require('path');
const utils = require('util');
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const hb = require('handlebars');
const readFile = utils.promisify(fs.readFile);
const emailService = require('./email-service');
const mercury = require('@postlight/mercury-parser');
const { v4: uuidv4 } = require('uuid');

//TODO: add format (A5) & light/dark mode to request body & make notes for all security & cloud plan


module.exports.createPdfFromUrl = async (url, email) => {
    let result = await parseHtml(url);

    let html = buildHtml(result.title, result.content, result.date_published, result.domain)
    let fileId = uuidv4();
    fs.writeFile(`./file-${fileId}.html`, html, function (err) {
        if (err) return console.log(err);
    });
    await generatePdf(result.title, fileId, email);
    return `your file ${result.domain} - ${result.title} has been sent to ${email}`;
}

const getHtml = async (fileId) => {
    console.log('html loading');
    try {
        const htmlPath = path.resolve(`./file-${fileId}.html`);
        return await readFile(htmlPath, 'utf8');
    }
    catch (err) {
        return Promise.reject('could not load html');
    }
}

const generatePdf = async (title, fileId, email) => {
    let data = {};
    getHtml(fileId).then(async (res) => {
        console.log("compiling the template with handlebars");
        const template = hb.compile(res, { strict: true });
        const result = template(data);
        const html = result;

        puppeteer.use(AdblockerPlugin());
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        await page.pdf({ path: `./${title}.pdf`, format: 'A4' });
        await browser.close();
        console.log("PDF generated")

        let results = await emailService.sendToKindle(title, email);
        if(!results){
            console.log('email was not sent')
        }
        return removeFiles(title, fileId);
    }).catch(err => {
        console.error(err)
    })
}

const parseHtml = async (url) => {
    return await mercury.parse(url).then(result => {
        return result;
    });
}

const buildHtml = (title, body, date, domain) => {
    let datePublished = date ? date : '';
    let domainName = domain ? domain : '';
    let someCSS = `
    <style>
    body {
        color: red;
    }
    </style>
    `;
    return '<!DOCTYPE html>'
        + '<html><head>' + domainName + someCSS + '</head><h1>' + title + '</h1><h5>' + datePublished + '</h5><body>' + body + '</body></html>';
};

const removeFiles = (title, fileId) => {
    let filePaths = [`./${title}.pdf`, `./file-${fileId}.html`];
    filePaths.map(filePath => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return console.log("files removed");
            }
        })
    })
}
