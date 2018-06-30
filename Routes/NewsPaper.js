const express = require('express');
const mysql = require('mysql');
const creationDate = require('node-datetime');
const router = express.Router();
const global = require('../Common/Global.js');

var objGlobal = new global();
router.get("/newspapers", (req, res) => {
    // console.log(objGlobal.getConnection());
    const connection = objGlobal.getConnection();
    //console.log(connection);
    const queryString = "SELECT * FROM NewsPapers"

    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for NewsPapers: " + err)
            res.sendStatus(500)
            return
        }
        res.json(rows)
    })
    //res.end();
})

router.get("/newspapers/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "SELECT * FROM NewsPapers WHERE NewsPaperId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to query for NewsPapers: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No newspaper found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        res.json(rows)
    })
})


router.delete("/newspapers/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "DELETE FROM NewsPapers WHERE NewsPaperId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to delete NewsPaper: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No newspaper found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        console.log("Newspaper deleted successfully with id: " + userId);
    res.sendStatus(202);
    })
})

router.post("/newspapers/add", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const newspaperName = req.body.NewsPaper;
    const userId = req.body.UserId;
    const queryString = "INSERT INTO NewsPapers(NewsPaper,UserId) VALUES (?,?)";
    connection.query(queryString, [newspaperName, userId], (err, results, fields) => {
        if (err) {
            console.log("failed to query for NewsPapers: " + err);
            resp.sendStatus(500);
            return;
        }
        console.log("Inserted newspaper id: " + results.insertId);
        resp.sendStatus(201);
    })
})

router.post("/newspapers/edit", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const NewsPaperId = req.body.NewsPaperId;
    const NewsPaper = req.body.NewsPaper;
    
    const queryString = "UPDATE NewsPapers SET NewsPaper=? WHERE NewsPaperId=?";
    connection.query(queryString, [NewsPaper, NewsPaperId], (err, results, fields) => {
      if (err) {
        console.log("failed to query for NewsPaper: " + err);
        resp.sendStatus(500);
        return;
      }
      console.log("Edited NewsPaperId : " + results.insertId);
      resp.sendStatus(202);
    })
  })

module.exports = router;