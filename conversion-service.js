const scrape = require('website-scraper');
const PhantomPlugin = require('website-scraper-phantom');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile)
const emailService = require('./email-service');

module.exports.createPdfFromUrl = async (url, email) => {
    let { source, title } = getFileName(url);

    let options = {};
    let folderId = uuid();
    options.urls = { url: url, filename: `${source}.html` };
    options.directory = folderId;
    options.plugins = [new PhantomPlugin()];

    await scrapeUrl(options);
    await generatePdf(folderId, source);
    return `your file ${source} - ${title}has been send to ${email}`;
}

const scrapeUrl = async (options) => {
    await scrape(options);
    //then - parse out what is not needed with REGEX - images, buttons, & adds
}

const getFileName = (url) => {
    let urlSplitter = new URL(url);
    let webSource = urlSplitter.hostname;
    let source = webSource.replace(/.com.*$/, "")
    let title = urlSplitter.pathname;
    return { source, title };
}

const getHtml = async (folderId, source) => {
    console.log('html loading');
    try {
        const htmlPath = path.resolve(`./${folderId}/${source}.html`);
        return await readFile(htmlPath, 'utf8');
    }
    catch (err) {
        return Promise.reject('could not load html');
    }
}

const generatePdf = async (folderId, source) => {
    let data = {};
    getHtml(folderId, source).then(async (res) => {
        console.log(res);
        console.log("compiling the template with handlebars");
        const template = hb.compile(res, { strict: true });
        const result = template(data);
        const html = result;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        await page.pdf({ path: `./${folderId}/${source}.pdf`, format: 'A4' })
        await browser.close();
        console.log("PDF Generated")
        await emailService.sendToKindle(folderId, source);
    }).catch(err => {
        console.error(err)
    })
}

