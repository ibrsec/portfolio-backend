"use strict";

/* --------------------------------- imports -------------------------------- */
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const { dbConnection } = require("./src/configs/dbConnection");
const logger = require("./src/middlewares/logger");
const errorHandler = require("./src/middlewares/errorHandler");
const cors = require("cors");
const queryHandler = require("./src/middlewares/queryHandler");
const path = require("path");
const userDataSync = require("./src/helpers/userDataSync");
const adminUser = require("./src/helpers/adminUser");
const projectsSync = require("./src/helpers/projectsSync");

/* ------------------------------- Express app ------------------------------ */
const app = express();
const PORT = process.env.PORT;

/* ------------------------------ dbconnection ------------------------------ */
dbConnection();
adminUser();

/* ------------------------------- middlewares ------------------------------ */
//customError ok,swagger ok,redoc ok ,authentication,permission,query handler, notfound route

//cors
app.use(cors());

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "./public")));

//logger
app.use(logger);

// authentication
app.use(require("./src/middlewares/auhthentication"));

//query handler
app.use(queryHandler);

/* --------------------------------- routes --------------------------------- */
//welcome route
app.all("/api", (req, res) => {
  res.json({
    message: "Welcome to Stock api!",
    documents: [
      "/api/documents/json",
      "/api/documents/swagger",
      "/api/documents/redoc",
    ],
    user: req.user,
  });
});

//main route index
app.use("/api", require("./src/routes/routerIndex"));

//swagger statics
app.use(
  "/api/swagger",
  express.static(path.join(__dirname, "node_modules", "swagger-ui-dist"))
);


//frontend static
app.get("/", (req, res) => {
  /*
  #swagger.ignore = true 
*/
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

 


//not found route for backend
app.use("/api/*", (req, res) => {
  res.errorStatusCode = 400;
  throw new Error("route not found!");
});

//for refresh 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ------------------------------ error handle ------------------------------ */
app.use(errorHandler);

/* ----------------------------------- RUN ---------------------------------- */
app.listen(PORT, () => console.log("Server is running on:", PORT));

// clean and add user data
// userDataSync()

// const { Token } = require("./src/models/tokenModel");
// Token.deleteMany().then(()=>console.log('object'))


// projectsSync();

//*ok  card larda isim hoversiz gozukecek, toollarda gozuksun orda
//*ok card lar duzelecek, image toptan baslayacak uste yaslanacak

//* ok yeni navlar ekelenecek
//*ok dummy storeun resminde bisey var
//*ok bazi projelerin kategorileri gelmedi neden bak?
//*ok build almamisim - local den calistirinca hala mock apiye istek atiyor neden?
//*ok  pagination icin img yerine next image kullandim lazy load oldu
