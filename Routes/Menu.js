const express = require('express');
const mysql = require('mysql');
const creationDate = require('node-datetime');
const router = express.Router();
const global = require('../Common/Global.js');

var objGlobal = new global();
router.get("/menus", (req, res) => {
    const connection = objGlobal.getConnection();
    const queryString = "SELECT * FROM Menus"

    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for Menus: " + err)
            res.sendStatus(500)
            return
        }
        res.json(rows)
    })
    //res.end();
})

module.exports = router;