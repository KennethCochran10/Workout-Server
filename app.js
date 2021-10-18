const Express = require("express");
const app = Express();
require('dotenv').config();
const controller = require("./controllers")
const dbConnection = require('./db')
const middlewares = require('./middleware')
app.use(Express.json());
app.use('/user', controller.userController)
app.use('/log', controller.logController)
app.use(middlewares.CORS);


dbConnection.authenticate()
    .then(() => dbConnection.sync())
    //{ force: true }
    .then(() => {
        app.listen(5000, () => {
            console.log(`[Server]: App is listening on 5k`);
        })
    })
    .catch((err) => {
        console.log(chalk.blueBright(`[Server]: Server got clapped! ${err}`));
    })
