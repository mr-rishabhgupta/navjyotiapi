const express = require('express');
const mysql = require('mysql');
const creationDate = require('node-datetime');
const router = express.Router();
const global = require('../Common/Global.js');

var objGlobal = new global();
router.get("/roles", (req, res) => {
    // console.log(objGlobal.getConnection());
    const connection = objGlobal.getConnection();
    //console.log(connection);
    const queryString = "SELECT * FROM Roles"

    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for Roles: " + err)
            res.sendStatus(500)
            return
        }
        res.json(rows)
    })
    //res.end();
})

router.get("/roles/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "SELECT * FROM Roles WHERE RoleId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to query for Roles: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No role found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        res.json(rows)
    })
})


router.delete("/roles/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "DELETE FROM Roles WHERE RoleId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to delete Role: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No role found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        console.log("Role deleted successfully with id: " + userId);
    res.sendStatus(202);
    })
})

router.post("/roles/add", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const roleName = req.body.RoleName;
    const queryString = "INSERT INTO Roles(RoleName) VALUES (?)";
    connection.query(queryString, [roleName], (err, results, fields) => {
        if (err) {
            console.log("failed to query for Roles: " + err);
            resp.sendStatus(500);
            return;
        }
        console.log("Inserted role id: " + results.insertId);
        resp.sendStatus(201);
    })
})

router.post("/roles/edit", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const RoleId = req.body.RoleId;
    const Role = req.body.RoleName;
    
    const queryString = "UPDATE Roles SET RoleName=? WHERE RoleId=?";
    connection.query(queryString, [Role, RoleId], (err, results, fields) => {
      if (err) {
        console.log("failed to query for Role: " + err);
        resp.sendStatus(500);
        return;
      }
      console.log("Edited RoleId : " + results.insertId);
      resp.sendStatus(202);
    })
  })
  
module.exports = router;