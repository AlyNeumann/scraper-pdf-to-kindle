'use strict';
const express = require('express');
const app = express();
const dayjs = require('dayjs');
const conversionService = require('./conversion-service');
require('dotenv').config();

const port = process.env.PORT || 3006;
app.use(express.json());
app.use(express.text());

app.listen(port);

app.get('/', async function (req, res, next){
    const cookieData = {
        secret: process.env.SECRET
    }
    res.cookie("secureCookie", JSON.stringify(cookieData), {
        httpOnly: true,
        expires: dayjs().add(1, "days").toDate()
    })
    res.send("hi")
})

app.post('/', async function (req, res, next) {
    try {
        let result = await conversionService.createPdfFromUrl(req.body.url, req.body.email);
        res.send(result);
    }

    catch (error) {
        console.log(error);
    }
})