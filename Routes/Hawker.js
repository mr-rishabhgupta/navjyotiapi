const express = require('express');
const mysql = require('mysql');
const creationDate = require('node-datetime');
const router = express.Router();
const global = require('../Common/Global.js');

var objGlobal = new global();
router.get("/hawkers", (req, res) => {
    // console.log(objGlobal.getConnection());
    const connection = objGlobal.getConnection();
    //console.log(connection);
    const queryString = "SELECT H.HawkerId,H.HawkerName,H.Mobile,H.Email,H.Address,H.AreaName,H.City,H.CreationDate,H.SchemeId,S.Scheme,H.UserId FROM Hawkers H INNER JOIN Schemes S ON H.SchemeId=S.SchemeId"

    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for Hawkers: " + err)
            res.sendStatus(500)
            return
        }
        res.json(rows)
    })
    //res.end();
})

router.get("/hawkers/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "SELECT H.HawkerId,H.HawkerName,H.Mobile,H.Email,H.Address,H.AreaName,H.City,H.CreationDate,H.SchemeId,S.Scheme,H.UserId FROM Hawkers H INNER JOIN Schemes S ON H.SchemeId=S.SchemeId WHERE HawkerId=?";
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to query for Hawkers: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No hawker found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        res.send(rows);
    })
})


router.delete("/hawkers/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "DELETE FROM Hawkers WHERE HawkerId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to delete Hawker: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No hawker found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        console.log("Hawker deleted successfully with id: " + userId);
        res.sendStatus(202);
    })
})

router.post("/hawkers/add", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const hawkerName = req.body.HawkerName;
    const mobile = req.body.Mobile;
    const email = req.body.Email;
    const address = (req.body.Address==null || req.body.Address==undefined) ? '':req.body.Address;
    const areaname = req.body.AreaName;
    const schemeId = req.body.SchemeId;
    const city = req.body.City;
    var dt = creationDate.create();
    // console.log(dt);
    // console.log(dt._now);
    // console.log( dt.format('Y-m-d H:M:S'));
    // var formatted = dt.format('Y-m-d H:M:S');
    const userId = req.body.UserId;
    const queryString = "INSERT INTO Hawkers(HawkerName,Mobile,Email,Address,AreaName,City,CreationDate,SchemeId,UserId) VALUES (?,?,?,?,?,?,?,?,?)";
    connection.query(queryString, [hawkerName, mobile, email, address, areaname, city, dt._now, schemeId, userId], (err, results, fields) => {
        if (err) {
            console.log("failed to query for Hawkers: " + err);
            resp.sendStatus(500);
            return;
        }
        console.log("Inserted hawker id: " + results.insertId);
        resp.sendStatus(201);
    })
})

router.post("/hawkers/edit", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const hawkerId = req.body.HawkerId;
    const hawkerName = req.body.HawkerName;
    const mobile = req.body.Mobile;
    const email = req.body.Email;
    const address = (req.body.Address==null || req.body.Address==undefined) ? '':req.body.Address;
    const areaname = req.body.AreaName;
    const schemeId = req.body.SchemeId;
    const city = req.body.City;
    var dt = creationDate.create();
    // console.log(dt);
    // console.log(dt._now);
    // console.log( dt.format('Y-m-d H:M:S'));
    // var formatted = dt.format('Y-m-d H:M:S');
    const userId = req.body.UserId;
    const queryString = "UPDATE Hawkers SET HawkerName=?,Mobile=?,Email=?,Address=?,AreaName=?,City=?,SchemeId=? WHERE HawkerId=?";
    connection.query(queryString, [hawkerName, mobile, email, address, areaname, city, schemeId, hawkerId], (err, results, fields) => {
        if (err) {
            console.log("failed to query for Hawkers: " + err);
            resp.sendStatus(500);
            return;
        }
        console.log("Edited hawker id: " + results.insertId);
        resp.sendStatus(202);
    })
})

module.exports = router;