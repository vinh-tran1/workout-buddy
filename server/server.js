//setup:
//npm install express, nodemon, .env, mongoose
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");

//express app
const app = express();

//middleware
app.use(express.json()); //any request body go to req param




app.use((req, res, next) => {
    console.log(req.path, req.method);
    next()
});
 
//registering routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

//conect to db, using promise
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen to requests only once we connect to our db
        app.listen(process.env.PORT, () => {
            console.log("connected to db & listening on port", process.env.PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });

