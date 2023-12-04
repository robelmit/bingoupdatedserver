import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import connectDB from "./config/MongoConnect.js";
import gamesrouter from "./Routes/GameRouter.js";
// import categoryRouter from "./Routers/CategoryRouters.js";
import usersRouter from "./Routes/UserRouters.js";
import houseRouter from "./Routes/HouseRouters.js";
// import ordersRouter from "./Routers/OrdersRouters.js";
import authJwt from "./helpers/jwt.js";
// import errorHandler from "./helpers/error-handler.js";


import { errorHandler, notFound } from "./helpers/Errors.js";

dotenv.config();
connectDB()

const app = express();

// MIDDLEWARE
app.use(cors({
  origin: true
}))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("tiny"));
app.get('/', (req, res) => {
  res.json({
    message: 'welcome to our api '
  })
})
// let user = new User({
//   name: 'miki',

//   passwordHash: bcrypt.hashSync('miki123', 10),

//   isAdmin: false,
//   isSuperAdmin: true,
//   // room

// });
// user.save().then(() => {
//   console.log('success')
// }).catch(e => {
//   console.log(e)
// })
const __dirname = path.join();
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
const api = process.env.API_URL;
const Port = process.env.PORT;

// ROUTERS

app.use(`${api}/users`, usersRouter);
app.use(`${api}/houses`, houseRouter);
// app.use(authJwt());
// app.use(authJwt());

app.use(`${api}/games`, gamesrouter);
// app.use(`${api}/categories`, categoryRouter);
// app.use(`${api}/orders`, ordersRouter);
// app.use(errorHandler);
app.use(notFound);
app.use(errorHandler);

app.listen(Port, () => {
  console.log(`Example app listening at http://localhost:${Port}`);
});

// production
// development
// var server = app.listen(Port, () => {
//   let port = server.address().port;
//   console.log(`express is working ${port}`);
// });
