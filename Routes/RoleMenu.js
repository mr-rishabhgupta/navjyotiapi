const express = require('express');
const mysql = require('mysql');
const creationDate = require('node-datetime');
const router = express.Router();
const global = require('../Common/Global.js');


var objGlobal = new global();
router.get("/rolemenus", (req, res) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    
    const queryString =

    "SELECT R.RoleId,R.RoleName, M.Menus FROM Roles AS R LEFT JOIN " +
    "(SELECT X.RoleId,GROUP_CONCAT(X.MenuText SEPARATOR \',\') AS Menus " +
    "FROM (SELECT T.RoleId, N.MenuId, N.MenuText FROM RoleMenus T INNER JOIN Menus N ON N.MenuId=T.MenuId ORDER BY T.RoleId) AS X GROUP BY X.RoleId) AS M " +
    "ON M.RoleId=R.RoleId;";

    console.log(queryString);
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for Surveys: " + err)
            res.sendStatus(500)
            return
        }
        res.json(rows)
    })

})

router.get("/rolemenus/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString =
    "SELECT R.RoleId,R.RoleName, M.Menus FROM Roles AS R LEFT JOIN " +
    "(SELECT X.RoleId,GROUP_CONCAT(X.MenuId SEPARATOR \',\') AS Menus " +
    "FROM (SELECT T.RoleId, N.MenuId, N.MenuText FROM RoleMenus T INNER JOIN Menus N ON N.MenuId=T.MenuId ORDER BY T.RoleId) AS X GROUP BY X.RoleId) AS M " +
    "ON M.RoleId=R.RoleId WHERE R.RoleId=?;";
    console.log(queryString);
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to query for role: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No role found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        res.send(rows)
    })
})

router.post("/rolemenus/edit", (req, res) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const roleId = req.body.RoleId;
    const menustring = req.body.Menus;
   

        const menus = menustring.split(",");
        if (menus.length > 0) {
            let queryPart = "";
            for (i = 0; i < menus.length; i++) {
                queryPart += "(" + roleId + "," + menus[i] + ",1,1,1,1)";
                if (i != menus.length - 1) {
                    queryPart += ",";
                }

            }

            let queryString1 = "DELETE FROM RoleMenus WHERE RoleId=?;";
            console.log(queryString1);
            connection.query(queryString1, [roleId], (innererr, innerresults, innerfields) => {
                if (innererr) {
                    console.log("failed to delete for RoleMenus: " + innererr);
                }
                let queryString2 = "INSERT INTO RoleMenus(RoleId,MenuId,CanAdd,CanEdit,CanView,CanDelete) VALUES " + queryPart + ";";
                console.log(queryString2);
                connection.query(queryString2, [], (innererr1, innerresults1, innerfields1) => {
                    if (innererr1) {
                        console.log("failed to insert for RoleMenus: " + innererr1);
                    }
                    console.log("Edited role id: " + roleId);
                    res.sendStatus(202);
                })
            })
        } else {
            console.log("Edited role id: " + roleId);
            res.sendStatus(202);
        }
    
})  

module.exports = router;