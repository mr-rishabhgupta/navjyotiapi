const express = require('express');
const mysql = require('mysql');
const creationDate = require('node-datetime');
const router = express.Router();
const global = require('../Common/Global.js');

var objGlobal = new global();
router.get("/users", (req, res) => {
    const connection = objGlobal.getConnection();
    const queryString = "SELECT * FROM Users"

    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for Users: " + err)
            res.sendStatus(500)
            return
        }
        res.json(rows)
    })
    //res.end();
})

router.get("/usersdetail", (req, res) => {
    const connection = objGlobal.getConnection();
    const queryString = "SELECT U.UserId,U.RoleId,R.RoleName,U.UserName,U.EmailId,U.UserPassword,U.Mobile, U.IsEnable,U.Remark,U.CreatorId FROM Users U INNER JOIN Roles R ON U.RoleId=R.RoleId";

    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for Users: " + err)
            res.sendStatus(500)
            return
        }
        res.json(rows)
    })
    //res.end();
})

router.get("/users/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "SELECT * FROM Users WHERE UserId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to query for Users: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No user found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        res.json(rows)
    })
})

router.get("/usersdetail/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "SELECT U.UserId,U.RoleId,R.RoleName,U.UserName,U.EmailId,U.UserPassword,U.Mobile, U.IsEnable,U.Remark,U.CreatorId FROM Users U INNER JOIN Roles R ON U.RoleId=R.RoleId WHERE U.UserId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to query for Users: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No user found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        // const users = rows.map((row) => {
        //     return {
        //         firstName: row.first_name,
        //         lastName: row.last_name
        //     }
        // })
        res.json(rows)
    })
})



router.get("/usersmenu/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "SELECT M.MenuId,M.MenuText,M.ParentId,M.Url,M.IconClass,M.MenuOrder,M.IsEnable,M.Remark " +
        "FROM Users U INNER JOIN Roles R ON R.RoleId=U.RoleId INNER JOIN RoleMenus O ON R.RoleId=O.RoleId INNER JOIN Menus M ON M.MenuId=O.MenuId WHERE U.UserId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to query for Menus: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No menu found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        // const users = rows.map((row) => {
        //     return {
        //         firstName: row.first_name,
        //         lastName: row.last_name
        //     }
        // })
        res.json(rows)
    })
})


router.post("/users/add", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const userName = req.body.UserName;
    const password = req.body.UserPassword;
    const email = req.body.EmailId;
    const remark = (req.body.Remark == null || req.body.Remark == undefined) ? '' : req.body.Remark;
    const mobile = req.body.Mobile;
    const role = req.body.RoleId;
    const creator = req.body.CreatorId;
    const enable = req.body.IsEnable;

    const queryString = "INSERT INTO Users(RoleId,UserName,EmailId,UserPassword,Mobile,IsEnable,Remark,CreatorId) VALUES (?,?,?,?,?,?,?,?)";
    connection.query(queryString, [role, userName, email, password, mobile, enable, remark, creator], (err, results, fields) => {
        if (err) {
            console.log("failed to add User: " + err);
            resp.sendStatus(500);
            return;
        }
        console.log("Inserted user id: " + results.insertId);
        resp.sendStatus(201);
    })
})

router.post("/users/edit", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const userId = req.body.UserId;
    const userName = req.body.UserName;
    const password = req.body.UserPassword;
    const email = req.body.EmailId;
    const remark = (req.body.Remark == null || req.body.Remark == undefined) ? '' : req.body.Remark;
    const mobile = req.body.Mobile;
    const role = req.body.RoleId;
    const enable = req.body.IsEnable;
    console.log(enable);
    const queryString = "UPDATE Users SET RoleId=?,UserName=?,EmailId=?,UserPassword=?,Mobile=?,IsEnable=?,Remark=? WHERE UserId=?";
    connection.query(queryString, [role, userName, email, password, mobile, enable, remark, userId], (err, results, fields) => {
        if (err) {
            console.log("failed to edit User: " + err);
            resp.sendStatus(500);
            return;
        }
        console.log("Edited user id: " + results.userId);
        resp.sendStatus(202);
    })
})

router.post("/users/login", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    console.log(req.body);
    const password = req.body.password;
    const email = req.body.email;
    const queryString = "SELECT U.UserId,U.RoleId,R.RoleName,U.UserName,U.EmailId,U.UserPassword,U.Mobile, U.IsEnable,U.Remark,U.CreatorId FROM Users U INNER JOIN Roles R ON U.RoleId=R.RoleId WHERE U.EmailId=? AND U.UserPassword=?";
    connection.query(queryString, [email, password], (err, results, fields) => {
        resp.setHeader('Access-Control-Allow-Origin', '*');
        if (err) {
            console.log("failed to query for Users: " + err)
            resp.sendStatus(500)
            return
        } else if (results == null) {
            console.log("Invalid Credentials: " + email)
            resp.sendStatus(403)
            return
        } else {
            if (results[0].IsEnable == false) {
                console.log("Invalid Access: " + email)
                resp.sendStatus(401)
                return
            }
            resp.json(results);
        }
    });
})

router.get("/userstatuschange/:id", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const userId = req.params.id;

    const queryString = "UPDATE Users SET IsEnable= !IsEnable WHERE UserId=?";
    connection.query(queryString, [userId], (err, results, fields) => {
        if (err) {
            console.log("failed to get User: " + err);
            resp.sendStatus(500);
            return;
        }
        console.log("Edited user id: " + results.insertId);
        resp.sendStatus(202);
    })
})

router.get("/homecounts", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    

    const queryString = "SELECT COUNT(*) AS Counting FROM Customers "+
                        " UNION ALL "+
                        " SELECT COUNT(*) AS Counting FROM Hawkers "+
                        " UNION ALL "+
                        " SELECT COUNT(*) AS Counting FROM NewOrders "+
                        " UNION ALL "+
                        " SELECT COUNT(*) AS Counting FROM Surveys ";
    connection.query(queryString, [], (err, results, fields) => {
        if (err) {
            console.log("failed to get various counts: " + err);
            resp.sendStatus(500);
            return;
        }
        resp.json(results);
    })
})

module.exports = router;