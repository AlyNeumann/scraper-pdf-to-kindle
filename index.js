'use strict';
const express = require('express');
const app = express();
const dayjs = require('dayjs');
const conversionService = require('./conversion-service');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const port = process.env.PORT || 3006;
app.use(express.json());
app.use(express.text());
app.use(cookieParser());

app.listen(port);

app.get('/', async function (req, res, next){
    const cookieData = {
        secret: process.env.SECRET
    }
    res.cookie("secureCookie", JSON.stringify(cookieData), {
        secure: true,
        httpOnly: true,
        expires: dayjs().add(1, "days").toDate()
    })
    res.send("hi, here is your fresh cookie")
})

app.post('/', async function (req, res, next) {
    if(!req.cookies || req.secureCookie){
        return "session expired"
    }
    try {
        const cookieData = {
            secret: process.env.SECRET
        }
        res.cookie("secureCookie", JSON.stringify(cookieData), {
            secure: true,
            httpOnly: true,
            expires: dayjs().add(1, "days").toDate()
        })
        let result = await conversionService.createPdfFromUrl(req.body.url, req.body.email);
        res.send(result);
    }

    catch (error) {
        console.log(error);
    }
})