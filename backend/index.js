require('dotenv').config();
const express = require("express");
const mongoose = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminFormRoutes = require("./controllers/AdminForm");
const userRoutes = require("./controllers/UserController");
const billRoutes = require("./controllers/BillController");
const feeRoutes = require("./controllers/FeeController");
const courseRoutes = require("./controllers/CourseController");


const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Clear existing model and re-register
delete mongoose.connection.models['Bill'];
const Bill = require('./models/Bill'); // Re-require the model

// Routes
app.use("/admission", adminFormRoutes);
app.use("/user", userRoutes);
app.use("/bills", billRoutes);
app.use("/fees", feeRoutes);
app.use("/courses", courseRoutes);


// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});