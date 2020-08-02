require("dotenv").config();

const mongoose = require("mongoose"),
  express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  twilio = require("twilio"),
  cors = require("cors");


//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

//Middlewares
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes imported from router folder
const NgoRoutes = require("./routes/NgoRouts")
const DeptRoutes = require("./routes/OfficeRoutes")
const LoanRoutes = require("./routes/LoanRoutes")
const TransactionRoutes = require("./routes/TransactionRoute")
//Mounting Routes in app.js

app.use("/api", NgoRoutes);
app.use("/api", DeptRoutes);
app.use("/api", LoanRoutes);
app.use("/api", TransactionRoutes)
//Home Page
app.get("/", async (req, res) => {
  res.send("We got the basic route working")
});

//PORT
const port = process.env.PORT || 8000;

//APP MOUNT POINT
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
