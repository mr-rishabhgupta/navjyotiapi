const express = require('express');
const mysql = require('mysql');
const creationDate = require('node-datetime');
const router = express.Router();
const global = require('../Common/Global.js');

var objGlobal = new global();
router.get("/neworders", (req, res) => {
    // console.log(objGlobal.getConnection());
    const connection = objGlobal.getConnection();
    //console.log(connection);
    const queryString = "SELECT * FROM NewOrders"

    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for NewOrders: " + err)
            res.sendStatus(500)
            return
        }
        res.json(rows)
    })
    //res.end();
})

router.get("/newordersdetail", (req, res) => {
    // console.log(objGlobal.getConnection());
    const connection = objGlobal.getConnection();
    //console.log(connection);
    const queryString = "SELECT N.*,CASE WHEN C.CustomerScheme IS NULL THEN '' ELSE C.CustomerScheme END AS CustomerScheme FROM NewOrders N LEFT JOIN CustomerSchemes C ON N.CustomerSchemeId=C.CustomerSchemeId;"

    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for NewOrders: " + err)
            res.sendStatus(500)
            return
        }
        res.json(rows)
    })
    //res.end();
})

router.get("/neworders/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    //const queryString = "SELECT CustomerName,CustomerAddress,CustomerMobile,AgentName,OrderType,DATE_FORMAT(StartDate, '%d/%M/%Y') StartDate, DATE_FORMAT(EndDate, '%d/%M/%Y') EndDate,DATE_FORMAT(OrderDate, '%d/%M/%Y') OrderDate, CallerName,DATE_FORMAT(EntryDate, '%d/%M/%Y') EntryDate,UserId FROM NewOrders WHERE OrderId=?";
    const queryString = "SELECT * FROM NewOrders WHERE OrderId=?";
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to query for NewOrders: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No neworder found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        //console.log(rows);
        res.send(rows);
    })
})


router.delete("/neworders/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "DELETE FROM NewOrders WHERE OrderId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to delete NewOrder: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No neworder found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        console.log("New Order deleted successfully with id: " + userId);
        res.sendStatus(202);
    })
})

router.post("/neworders/add", (req, resp) => {
    console.log(req.body);
    console.log(req.body.AgentName);
    const connection = objGlobal.getConnection();
    const name = req.body.CustomerName;
    const mobile = req.body.CustomerMobile;
    const address = (req.body.CustomerAddress == null || req.body.CustomerAddress == undefined) ? '' : req.body.CustomerAddress;
    const agentname = (req.body.AgentName == null || req.body.AgentName == undefined) ? '' : req.body.AgentName;
    const ordertype = req.body.OrderType;
    const callerName = (req.body.CallerName == null || req.body.CallerName == undefined) ? '' : req.body.CallerName;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    const orderDate = req.body.OrderDate;
    var entrydate = req.body.EntryDate;
    const customerschemeId = req.body.CustomerSchemeId;
    // console.log(dt);
    // console.log(dt._now);
    // console.log( dt.format('Y-m-d H:M:S'));
    // var formatted = dt.format('Y-m-d H:M:S');
    const userId = req.body.UserId;
    const queryString = "INSERT INTO NewOrders(CustomerName,CustomerAddress,CustomerMobile,AgentName,OrderType,StartDate,EndDate,OrderDate,CallerName,EntryDate,UserId,CustomerSchemeId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    connection.query(queryString, [name, address, mobile, agentname, ordertype, startDate, endDate, orderDate, callerName, entrydate, userId,customerschemeId], (err, results, fields) => {
        if (err) {
            console.log("failed to query for NewOrders: " + err);
            resp.sendStatus(500);
            return;
        }
        console.log("Inserted neworder id: " + results.insertId);
        resp.sendStatus(201);
    })
})

router.post("/neworders/filter", (req, resp) => {
    console.log(req.body);
    console.log(req.body.AgentName);
    const connection = objGlobal.getConnection();
    const agentname = (req.body.AgentName == null || req.body.AgentName == undefined) ? '' : req.body.AgentName;
    const callerName = (req.body.CallerName == null || req.body.CallerName == undefined) ? '' : req.body.CallerName;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;

    let queryString = "SELECT N.*,CASE WHEN C.CustomerScheme IS NULL THEN '' ELSE C.CustomerScheme END AS CustomerScheme FROM NewOrders N LEFT JOIN CustomerSchemes C ON N.CustomerSchemeId=C.CustomerSchemeId WHERE 1=1";
    if (agentname != '') {
        queryString += " AND N.AgentName LIKE \'%" + agentname + "%\'";
    }
    if (callerName != '') {
        queryString += " AND N.CallerName LIKE \'%" + callerName + "%\'";
    }
    if (startDate != undefined && startDate != null) {
        queryString += " AND N.OrderDate >= STR_TO_DATE(\'" + new Date(startDate).toLocaleDateString()+"\', \'%Y-%m-%d\')";
    }
    if (endDate != undefined && endDate != null) {
        queryString += " AND N.OrderDate <= STR_TO_DATE(\'" + new Date(endDate).toLocaleDateString()+"\', \'%Y-%m-%d\')";
    }
        console.log(queryString);
        connection.query(queryString, [], (err, results, fields) => {
        if (err) {
            console.log("failed to query for NewOrders: " + err);
            resp.sendStatus(500);
            return;
        }
        resp.send(results);
    })
})

router.post("/neworders/edit", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const name = req.body.CustomerName;
    const mobile = req.body.CustomerMobile;
    const address = (req.body.CustomerAddress == null || req.body.CustomerAddress == undefined) ? '' : req.body.CustomerAddress;
    const agentname = (req.body.AgentName == null || req.body.AgentName == undefined) ? '' : req.body.AgentName;
    const ordertype = req.body.OrderType;
    const callerName = (req.body.CallerName == null || req.body.CallerName == undefined) ? '' : req.body.CallerName;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    const orderDate = req.body.OrderDate;
    var entrydate = req.body.EntryDate;
    var orderId = req.body.OrderId;
    
    const customerschemeId = req.body.CustomerSchemeId;
    // console.log(dt);
    // console.log(dt._now);
    // console.log( dt.format('Y-m-d H:M:S'));
    // var formatted = dt.format('Y-m-d H:M:S');
    const userId = req.body.UserId;

    const queryString = "UPDATE NewOrders SET CustomerName=?,CustomerMobile=?,CustomerAddress=?,AgentName=?,OrderType=?,CallerName=?,StartDate=?,EndDate=?,OrderDate=?,EntryDate=?,CustomerSchemeId=? WHERE OrderId=?";
    connection.query(queryString, [name, mobile, address, agentname, ordertype, callerName, startDate, endDate, orderDate, entrydate,customerschemeId, orderId], (err, results, fields) => {
        if (err) {
            console.log("failed to query for Order: " + err);
            resp.sendStatus(500);
            return;
        }
        console.log("Edited OrderId : " + results.insertId);
        resp.sendStatus(202);
    })
})

module.exports = router;