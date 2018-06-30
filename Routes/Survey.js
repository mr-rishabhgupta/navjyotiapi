const express = require('express');
const mysql = require('mysql');
const creationDate = require('node-datetime');
const router = express.Router();
const global = require('../Common/Global.js');

var objGlobal = new global();
router.get("/surveys", (req, res) => {
    // console.log(objGlobal.getConnection());
    const connection = objGlobal.getConnection();
    //console.log(connection);

    const queryString =

        "SELECT S.SurveyId,S.Place,S.AgencyName,S.AgencyAddress,S.AgencyMobile,S.ContactPerson,S.Details,A.AlreadyAgentOf,S.AgencyCreationDate,S.SurveyorName,S.UserId FROM Surveys S  " +
        "LEFT JOIN " +
        "(SELECT News.SurveyId,GROUP_CONCAT(News.NewsPaper SEPARATOR \',\') AS AlreadyAgentOf FROM " +
        "(SELECT T.SurveyId, N.NewsPaper FROM AgentNewsPaper T INNER JOIN NewsPapers N ON N.NewsPaperId=T.NewspaperId) " +
        "AS News GROUP BY News.SurveyId)  " +
        "AS A ON S.SurveyId=A.SurveyId;";


    // SET @s='2,5,6';
    // SET @del=",";	


    // DROP TEMPORARY TABLE IF EXISTS temp;
    // CREATE TEMPORARY TABLE temp(val CHAR(255));
    // SET @SQL = CONCAT("insert into temp (val) values ('", REPLACE(( SELECT GROUP_CONCAT(@s) AS DATA), @del, "'),('"),"');");

    // PREPARE stmt1 FROM @SQL;
    // EXECUTE stmt1;


    // SET @agent=(SELECT GROUP_CONCAT(News.NewsPaper SEPARATOR ', ') FROM 
    // (SELECT T.val AS NewsPaperId,N.NewsPaper FROM temp T INNER JOIN NewsPapers N ON N.NewsPaperId=T.val) AS News);
    // SELECT @agent;

    //const queryString = "SELECT * FROM Surveys"
    console.log(queryString);
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for Surveys: " + err)
            res.sendStatus(500)
            return
        }
        res.json(rows)
    })
    //res.end();
})

router.get("/surveys/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString =
        "SELECT S.SurveyId,S.Place,S.AgencyName,S.AgencyAddress,S.AgencyMobile,S.ContactPerson,S.Details,A.AlreadyAgentOf,S.AgencyCreationDate,S.SurveyorName,S.UserId FROM Surveys S  " +
        "LEFT JOIN " +
        "(SELECT News.SurveyId,GROUP_CONCAT(News.NewspaperId SEPARATOR \',\') AS AlreadyAgentOf FROM " +
        "(SELECT T.SurveyId, T.NewspaperId FROM AgentNewsPaper T) " +
        "AS News GROUP BY News.SurveyId)  " +
        "AS A ON S.SurveyId=A.SurveyId WHERE S.SurveyId=?";
    console.log(queryString);
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to query for Surveys: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No survey found with the id: " + userId)
            res.sendStatus(404)
            return
        }
        //   const users = rows.map((row) => {
        //     return {firstName: row.first_name, lastName: row.last_name}
        //     })
        res.send(rows)
    })
})


router.delete("/surveys/:id", (req, res) => {
    const connection = objGlobal.getConnection();
    const userId = req.params.id;
    const queryString = "DELETE FROM Surveys WHERE SurveyId=?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("failed to delete Survey: " + err)
            res.sendStatus(500)
            return
        } else if (rows == null) {
            console.log("No survey found with the id: " + userId)
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

router.post("/surveys/filter", (req, resp) => {
    console.log(req.body);
    console.log(req.body.AgentName);
    const connection = objGlobal.getConnection();
    const surveyorName = (req.body.SurveyorName == null || req.body.SurveyorName == undefined) ? '' : req.body.SurveyorName;
    const startDate = req.body.StartDate;
    const endDate = req.body.EndDate;
    let queryString = "SELECT S.SurveyId,S.Place,S.AgencyName,S.AgencyAddress,S.AgencyMobile,S.ContactPerson,S.Details,A.AlreadyAgentOf,S.AgencyCreationDate,S.SurveyorName,S.UserId FROM Surveys S  " +
                        "LEFT JOIN " +
                        "(SELECT News.SurveyId,GROUP_CONCAT(News.NewsPaper SEPARATOR \',\') AS AlreadyAgentOf FROM " +
                        "(SELECT T.SurveyId, N.NewsPaper FROM AgentNewsPaper T INNER JOIN NewsPapers N ON N.NewsPaperId=T.NewspaperId) " +
                        "AS News GROUP BY News.SurveyId)  " +
                        "AS A ON S.SurveyId=A.SurveyId WHERE 1=1";
    //let queryString = "SELECT * FROM Surveys WHERE 1=1";
    if (surveyorName != '') {
        queryString += " AND s.SurveyorName LIKE \'%" + surveyorName + "%\'";
    }
    
    if (startDate != undefined && startDate != null) {
        queryString += " AND s.AgencyCreationDate >= STR_TO_DATE(\'" + new Date(startDate).toLocaleDateString()+"\', \'%Y-%m-%d\')";
    }
    if (endDate != undefined && endDate != null) {
        queryString += " AND s.AgencyCreationDate <= STR_TO_DATE(\'" + new Date(endDate).toLocaleDateString()+"\', \'%Y-%m-%d\')";
    }
        console.log(queryString);
        connection.query(queryString, [], (err, results, fields) => {
        if (err) {
            console.log("failed to query for survey: " + err);
            resp.sendStatus(500);
            return;
        }
        resp.send(results);
    })
})
router.post("/surveys/add", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const place = (req.body.Place == null || req.body.Place == undefined) ? '' : req.body.Place;
    const agencyName = (req.body.AgencyName == null || req.body.AgencyName == undefined) ? '' : req.body.AgencyName;
    const mobile = (req.body.AgencyMobile == null || req.body.AgencyMobile == undefined) ? '' : req.body.AgencyMobile;
    const address = (req.body.AgencyAddress == null || req.body.AgencyAddress == undefined) ? '' : req.body.AgencyAddress;
    const contactPerson = (req.body.ContactPerson == null || req.body.ContactPerson == undefined) ? '' : req.body.ContactPerson;
    const alreadyagentof = (req.body.AlreadyAgentOf == null || req.body.AlreadyAgentOf == undefined) ? '' : req.body.AlreadyAgentOf;
    const details = (req.body.Details == null || req.body.Details == undefined) ? '' : req.body.Details;
    const surveyorName = (req.body.SurveyorName == null || req.body.SurveyorName == undefined) ? '' : req.body.SurveyorName;
    const agencyCreationDate = req.body.AgencyCreationDate;
    //var dt = creationDate.create();
    // console.log(dt);
    // console.log(dt._now);
    // console.log( dt.format('Y-m-d H:M:S'));
    // var formatted = dt.format('Y-m-d H:M:S');
    const userId = req.body.UserId;
    let surveyId = 0;
    let queryString = "INSERT INTO Surveys(Place,AgencyName,AgencyAddress,AgencyMobile,ContactPerson,AlreadyAgentOf,Details,AgencyCreationDate,SurveyorName,UserId) VALUES (?,?,?,?,?,?,?,?,?,?)";
    connection.query(queryString, [place, agencyName, address, mobile, contactPerson, alreadyagentof, details, agencyCreationDate, surveyorName, userId], (err, results, fields) => {
        if (err) {
            console.log("failed to query for Surveys: " + err);
            resp.sendStatus(500);
            return;
        }
        console.log(results);
        surveyId = results.insertId;
        const paperIds = alreadyagentof.split(",");
        if (paperIds.length > 0) {
            let queryPart = "";
            for (i = 0; i < paperIds.length; i++) {
                queryPart += "(" + surveyId + "," + paperIds[i] + ")";
                if (i != paperIds.length - 1) {
                    queryPart += ",";
                }

            }
            queryString = "INSERT INTO AgentNewsPaper(SurveyId,NewspaperId) VALUES " + queryPart + ";";
            console.log(queryString);
            connection.query(queryString, [], (innererr, innerresults, innerfields) => {
                if (innererr) {
                    console.log("failed to query for AgentNewsPaper: " + err);
                }
                console.log("Inserted survey id: " + surveyId);
                resp.sendStatus(201);
            });
        } else {
            console.log("Inserted survey id: " + surveyId);
            resp.sendStatus(201);
        }
    })
})

router.post("/surveys/edit", (req, resp) => {
    console.log(req.body);
    const connection = objGlobal.getConnection();
    const surveyId = req.body.SurveyId;
    const place = (req.body.Place == null || req.body.Place == undefined) ? '' : req.body.Place;
    const agencyName = (req.body.AgencyName == null || req.body.AgencyName == undefined) ? '' : req.body.AgencyName;
    const mobile = (req.body.AgencyMobile == null || req.body.AgencyMobile == undefined) ? '' : req.body.AgencyMobile;
    const address = (req.body.AgencyAddress == null || req.body.AgencyAddress == undefined) ? '' : req.body.AgencyAddress;
    const contactPerson = (req.body.ContactPerson == null || req.body.ContactPerson == undefined) ? '' : req.body.ContactPerson;
    const alreadyagentof = (req.body.AlreadyAgentOf == null || req.body.AlreadyAgentOf == undefined) ? '' : req.body.AlreadyAgentOf;
    const details = (req.body.Details == null || req.body.Details == undefined) ? '' : req.body.Details;
    const surveyorName = (req.body.SurveyorName == null || req.body.SurveyorName == undefined) ? '' : req.body.SurveyorName;

    const agencyCreationDate = req.body.AgencyCreationDate;
    //var dt = creationDate.create();
    // console.log(dt);
    // console.log(dt._now);
    // console.log( dt.format('Y-m-d H:M:S'));
    // var formatted = dt.format('Y-m-d H:M:S');
    const userId = req.body.UserId;
    let queryString = "UPDATE Surveys SET Place=?,AgencyName=?,AgencyAddress=?,AgencyMobile=?,ContactPerson=?,AlreadyAgentOf=?,Details=?,AgencyCreationDate=?,SurveyorName=? WHERE SurveyId=?";
    connection.query(queryString, [place, agencyName, mobile, address, contactPerson, alreadyagentof, details, agencyCreationDate, surveyorName, surveyId], (err, results, fields) => {
        if (err) {
            console.log("failed to query for Surveys: " + err);
            resp.sendStatus(500);
            return;
        }

        const paperIds = alreadyagentof.split(",");
        if (paperIds.length > 0) {
            let queryPart = "";
            for (i = 0; i < paperIds.length; i++) {
                queryPart += "(" + surveyId + "," + paperIds[i] + ")";
                if (i != paperIds.length - 1) {
                    queryPart += ",";
                }

            }

            let queryString1 = "DELETE FROM AgentNewsPaper WHERE SurveyId=?;";
            console.log(queryString1);
            connection.query(queryString1, [surveyId], (innererr, innerresults, innerfields) => {
                if (innererr) {
                    console.log("failed to delete for AgentNewsPaper: " + innererr);
                }
                let queryString2 = "INSERT INTO AgentNewsPaper(SurveyId,NewspaperId) VALUES " + queryPart + ";";
                console.log(queryString2);
                connection.query(queryString2, [], (innererr1, innerresults1, innerfields1) => {
                    if (innererr1) {
                        console.log("failed to query for AgentNewsPaper: " + innererr1);
                    }
                    console.log("Edited survey id: " + surveyId);
                    resp.sendStatus(202);
                })
            })
        } else {
            console.log("Edited survey id: " + surveyId);
            resp.sendStatus(202);
        }
    })
})

module.exports = router;