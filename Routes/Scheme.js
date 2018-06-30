const express = require('express');
const mysql = require('mysql');
const creationDate = require('node-datetime');
const router = express.Router();
const global = require('../Common/Global.js');

var objGlobal = new global();
router.get("/schemes", (req, res) => {
    // console.log(objGlobal.getConnection());
    const connection = objGlobal.getConnection();
    //console.log(connection);
    const queryString = "SELECT * FROM Schemes"

    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for Schemes: " + err)
            res.sendStatus(500)
            return
        }
        res.json(rows)
    })
    //res.end();
})

router.get("/schemes/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "SELECT * FROM Schemes WHERE SchemeId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to query for Schemes: " + err)
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


router.delete("/schemes/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "DELETE FROM Schemes WHERE SchemeId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to delete Scheme: " + err)
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
        console.log("New Scheme deleted successfully with id: " + userId);
        res.sendStatus(202);
    })
})

router.post("/schemes/add", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const scheme = req.body.Scheme;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    //var dt = creationDate.create();
    // console.log(dt);
    // console.log(dt._now);
    // console.log( dt.format('Y-m-d H:M:S'));
    // var formatted = dt.format('Y-m-d H:M:S');
    const userId = req.body.UserId;
    const queryString = "INSERT INTO Schemes(Scheme,StartDate,EndDate,UserId) VALUES (?,?,?,?)";
    connection.query(queryString, [scheme, startDate, endDate, userId], (err, results, fields) => {
        if (err) {
            console.log("failed to query for Schemes: " + err);
            resp.sendStatus(500);
            return;
        }
        console.log("Inserted scheme id: " + results.insertId);
        resp.sendStatus(201);
    })
})

router.post("/schemes/edit", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const schemeid = req.body.SchemeId;
    const scheme = req.body.Scheme;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    // console.log(dt);
    // console.log(dt._now);
    // console.log( dt.format('Y-m-d H:M:S'));
    // var formatted = dt.format('Y-m-d H:M:S');
    const userId = req.body.UserId;
    
    const queryString = "UPDATE Schemes SET Scheme=?,StartDate=?,EndDate=? WHERE SchemeId=?";
    connection.query(queryString, [scheme,startDate,endDate,schemeid], (err, results, fields) => {
      if (err) {
        console.log("failed to query for Scheme: " + err);
        resp.sendStatus(500);
        return;
      }
      console.log("Edited SchemeId : " + results.insertId);
      resp.sendStatus(202);
    })
  })

module.exports = router;