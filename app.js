const express=require('express');
const app=express();
const morgan=require('morgan');
const customerRouter = require('./Routes/Customer.js')
const userRouter = require('./Routes/User.js')
const hawkerRouter = require('./Routes/Hawker.js')
const newOrderRouter = require('./Routes/NewOrder.js')
const newsPaperRouter = require('./Routes/NewsPaper.js')
const schemeRouter = require('./Routes/Scheme.js')
const surveyRouter = require('./Routes/Survey.js')
const customerschemeRouter = require('./Routes/CustomerScheme.js')
const roleRouter = require('./Routes/Role.js')
const menuRouter = require('./Routes/Menu.js')
const roleMenuRouter = require('./Routes/RoleMenu.js')
const bodyParser = require('body-parser');
var cors = require('cors');

app.use(morgan('short'));
app.use(cors());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.listen(3000,()=>{
    console.log('app started listening on port 3000.');
})

app.get("/", (req, res) => {
    console.log("Service is up.")
    res.send("Service is up.")
  })

app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.text({ type: 'text/html' }))
// app.use(bodyParser.text({ type: 'text/xml' }))
// app.use(bodyParser.text({ type: 'text/plain' }))
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
// app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.json());
app.use(customerRouter);
app.use(userRouter);
app.use(hawkerRouter);
app.use(newOrderRouter);
app.use(newsPaperRouter);
app.use(schemeRouter);
app.use(surveyRouter);
app.use(roleRouter);
app.use(menuRouter);
app.use(roleMenuRouter);
app.use(customerschemeRouter);