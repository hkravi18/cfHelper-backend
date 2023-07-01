const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); 

mongoose
.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("db connection successful");
})
.catch((err) => {
    console.log('Error : ', err.message);
})

const userListRoute = require('./routes/userListRoute');
const contestRoute = require('./routes/contestRoute');
const userRoute = require('./routes/userRoute');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/list", userListRoute);
app.use("/api/contest", contestRoute);
app.use("/api/user", userRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});