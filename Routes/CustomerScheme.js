const express = require('express');
const mysql = require('mysql');
const creationDate = require('node-datetime');
const router = express.Router();
const global = require('../Common/Global.js');

var objGlobal = new global();
router.get("/customerschemes", (req, res) => {
    // console.log(objGlobal.getConnection());
    const connection = objGlobal.getConnection();
    //console.log(connection);
    const queryString = "SELECT * FROM CustomerSchemes"

    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for CustomerSchemes: " + err)
            res.sendStatus(500)
            return
        }
        res.json(rows)
    })
    //res.end();
})

router.get("/customerschemes/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "SELECT * FROM CustomerSchemes WHERE CustomerSchemeId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to query for CustomerSchemes: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No scheme found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        res.send(rows)
    })
})


router.delete("/customerschemes/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "DELETE FROM CustomerSchemes WHERE CustomerSchemeId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to delete CustomerScheme: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No scheme found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        console.log("New CustomerScheme deleted successfully with id: " + userId);
        res.sendStatus(202);
    })
})

router.post("/customerschemes/add", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const scheme = req.body.CustomerScheme;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    //var dt = creationDate.create();
    // console.log(dt);
    // console.log(dt._now);
    // console.log( dt.format('Y-m-d H:M:S'));
    // var formatted = dt.format('Y-m-d H:M:S');
    const userId = req.body.UserId;
    const queryString = "INSERT INTO CustomerSchemes(CustomerScheme,StartDate,EndDate,UserId) VALUES (?,?,?,?)";
    connection.query(queryString, [scheme, startDate, endDate, userId], (err, results, fields) => {
        if (err) {
            console.log("failed to query for CustomerSchemes: " + err);
            resp.sendStatus(500);
            return;
        }
        console.log("Inserted customer scheme id: " + results.insertId);
        resp.sendStatus(201);
    })
})

router.post("/customerschemes/edit", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const schemeid = req.body.CustomerSchemeId;
    const scheme = req.body.CustomerScheme;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    // console.log(dt);
    // console.log(dt._now);
    // console.log( dt.format('Y-m-d H:M:S'));
    // var formatted = dt.format('Y-m-d H:M:S');
    const userId = req.body.UserId;
    
    const queryString = "UPDATE CustomerSchemes SET CustomerScheme=?,StartDate=?,EndDate=? WHERE CustomerSchemeId=?";
    connection.query(queryString, [scheme,startDate,endDate,schemeid], (err, results, fields) => {
      if (err) {
        console.log("failed to query for CustomerScheme: " + err);
        resp.sendStatus(500);
        return;
      }
      console.log("Edited CustomerSchemeId : " + results.insertId);
      resp.sendStatus(202);
    })
  })

module.exports = router;