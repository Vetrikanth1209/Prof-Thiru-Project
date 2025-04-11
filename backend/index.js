require('dotenv').config();
const express = require("express");
const mongoose = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminFormRoutes = require("./controllers/AdminForm");
const app = express();
const port = process.env.PORT;

//  Middleware
app.use(cors());
app.use(bodyParser.json());



// Routes
app.use("/admission", adminFormRoutes);
app.use("/user", require("./controllers/UserController"));  


// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});