'use strict';
const express = require('express');
const app = express();
const conversionService = require('./conversion-service');

const port = process.env.PORT || 3006;
app.use(express.json());
app.use(express.text());

app.listen(port);

app.post('/', async function (req, res, next) {
    try {
        let result = await conversionService.createPdfFromUrl(req.body.url, req.body.email);
        res.send(result);
    }

    catch (error) {
        console.log(error);
    }
})