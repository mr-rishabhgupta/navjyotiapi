const express = require('express');
const mysql = require('mysql');
const creationDate = require('node-datetime');
const router = express.Router();
const global = require('../Common/Global.js');

var objGlobal = new global();
router.get("/customers", (req, res) => {
  // console.log(objGlobal.getConnection());
  const connection = objGlobal.getConnection();
  //console.log(connection);
  const queryString = "SELECT * FROM Customers"

  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for Customers: " + err)
      res.sendStatus(500)
      return
    }
    res.json(rows)
  })
  //res.end();
})

router.get("/customers/:id", (req, res) => {
  const connection = objGlobal.getConnection();
  const userId = req.params.id;
  const queryString = "SELECT * FROM Customers WHERE CustomerId=?"
  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("failed to query for Customers: " + err)
      res.sendStatus(500)
      return
    } else if (rows == null) {
      console.log("No customer found with the id: " + userId)
      res.sendStatus(404)
      return
    }
    //   const users = rows.map((row) => {
    //     return {firstName: row.first_name, lastName: row.last_name}
    //     })
    res.json(rows)
  })
})

router.post("/customers/filter/:id", (req, res) => {
  const connection = objGlobal.getConnection();
  const userId = req.params.id;
  const startDate = req.body.StartDate;
  const endDate = req.body.EndDate;
  var queryString = "SELECT * FROM Customers WHERE 1=1"
  const queryString1 = "SELECT * FROM Users WHERE UserId=" + userId;
  console.log(userId);
  connection.query(queryString1, [], (err1, results1, fields1) => {
    console.log(queryString1);
    if (err1) {
      console.log("failed to query for Users: " + err1)
      res.sendStatus(500)
      return
    } else if (results1 == null) {
      console.log("No user found with the id: " + userId)
      res.sendStatus(404)
      return
    } else {
      console.log(results1[0]['RoleId']);
      if (results1[0]['RoleId'] != 1) {
        queryString += " AND UserId=" + userId;
      }
      if (startDate != undefined && startDate != null) {
        queryString += " AND EntryDate >= STR_TO_DATE(\'" + new Date(startDate).toLocaleDateString() + "\', \'%m/%d/%Y\')"; // server date formate: %m/%d/%Y, local: %Y-%m-%d
      }
      if (endDate != undefined && endDate != null) {
        queryString += " AND EntryDate <= STR_TO_DATE(\'" + new Date(endDate).toLocaleDateString() + "\', \'%m/%d/%Y\')";
      }
      console.log(queryString)
      connection.query(queryString, [], (err, rows, fields) => {
        if (err) {
          console.log("failed to query for Customers: " + err)
          res.sendStatus(500)
          return
        } else if (rows == null) {
          console.log("No customer found with the id: " + userId)
          res.sendStatus(404)
          return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        res.json(rows)
      })
    }
  })
})


router.delete("/customers/:id", (req, res) => {
  const connection = objGlobal.getConnection();
  const userId = req.params.id;
  const queryString = "DELETE FROM Customers WHERE CustomerId=?"
  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("failed to delete Customer: " + err)
      res.sendStatus(500)
      return
    } else if (rows == null) {
      console.log("No customer found with the id: " + userId)
      res.sendStatus(404)
      return
    }
    //   const users = rows.map((row) => {
    //     return {firstName: row.first_name, lastName: row.last_name}
    //     })
    console.log("Customer deleted successfully with id: " + userId);
    res.sendStatus(202);
  })
})

router.post("/customers/add", (req, resp) => {
  console.log(req.body);
  const connection = objGlobal.getConnection();
  const customerName = req.body.CustomerName;
  const mobile = req.body.Mobile;
  const email = req.body.Email;
  const address = req.body.Address;
  const areaname = req.body.AreaName;
  const city = req.body.City;
  const caller = (req.body.CallerName == null || req.body.CallerName == undefined) ? '' : req.body.CallerName;
  const entrydate = req.body.EntryDate;
  var dt = creationDate.create();
  // console.log(dt);
  // console.log(dt._now);
  // console.log( dt.format('Y-m-d H:M:S'));
  // var formatted = dt.format('Y-m-d H:M:S');
  const userId = req.body.UserId;
  // const queryString = "INSERT INTO Customers(CustomerName,Mobile,Email,Address,AreaName,City,CreationDate,UserId) VALUES (?,?,?,?,?,?,?,?)";
  // connection.query(queryString, [customerName, mobile, email, address, areaname, city,dt._now, userId], (err, results, fields) => {
  const queryString = "INSERT INTO Customers(CustomerName,Mobile,AreaName,CreationDate,UserId,CallerName,EntryDate) VALUES (?,?,?,?,?,?,?)";
  connection.query(queryString, [customerName, mobile, areaname, dt._now, userId, caller, entrydate], (err, results, fields) => {
    if (err) {
      console.log("failed to query for Customers: " + err);
      resp.sendStatus(500);
      return;
    }
    console.log("Inserted customer id: " + results.insertId);
    resp.sendStatus(201);
  })
})

router.post("/customers/edit", (req, resp) => {
  console.log(req.body);
  const connection = objGlobal.getConnection();
  const customerid = req.body.CustomerId;
  const customerName = req.body.CustomerName;
  const mobile = req.body.Mobile;
  const email = req.body.Email;
  const address = req.body.Address;
  const areaname = req.body.AreaName;
  const city = req.body.City;
  const caller = (req.body.CallerName == null || req.body.CallerName == undefined) ? '' : req.body.CallerName;
  const entrydate = req.body.EntryDate;
  var dt = creationDate.create();
  // console.log(dt);
  // console.log(dt._now);
  // console.log( dt.format('Y-m-d H:M:S'));
  // var formatted = dt.format('Y-m-d H:M:S');
  const userId = req.body.userid;
  const queryString = "UPDATE Customers SET CustomerName=?, Mobile=?, AreaName=?, CallerName=?, EntryDate=? WHERE CustomerId=?";
  connection.query(queryString, [customerName, mobile, areaname, caller, entrydate, customerid], (err, results, fields) => {
    if (err) {
      console.log("failed to query for Customers: " + err);
      resp.sendStatus(500);
      return;
    }
    console.log("Edited customer id: " + results.insertId);
    resp.sendStatus(202);
  })
})

module.exports = router;