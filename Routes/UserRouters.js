import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModels.js";
import Game from "../models/GameModel.js";
import { protect, admin } from "../helpers/AuthMiddleware.js";
import moment from "moment";
import House from "../models/HouseModels.js";

const UserRouter = express.Router();

// GET ALL User
UserRouter.get("/", protect, admin, async (req, res) => {
  let filter = { room: req.user.room }

  const userList = await User.find(filter).select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

// GET USER BY ID
// UserRouter.get("/:id", async (req, res) => {
//   const user = await User.findById(req.params.id).select("-passwordHash");

//   if (!user) {
//     res
//       .status(500)
//       .json({ message: "The user with the given ID was not found." });
//   }
//   res.status(200).send(user);
// });

// ADMIN CREATE USER
UserRouter.post("/", protect, admin, async (req, res) => {
  let room = req.user.room

  let user = new User({
    name: req.body.name,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    isAdmin: false,
    room

  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

// LOGIN USER
UserRouter.post("/login", async (req, res) => {
  console.log(req.body)
  const user = await User.findOne({ name: req.body.name }).populate("room")
  // console.log(user)
  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1w" }
    );

    res.status(200).send({ name: user.name, id: user.id, house: user.room.name, token: token, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin });
  } else {
    res.status(400).send("password is wrong!");
  }
});

// REGISTER USER
UserRouter.post("/register", protect, async (req, res) => {
  let userfound = await User.find({ name: req.body.name })
  console.log(userfound)
  if (!userfound.length) {
    console.log(req.user)
    let room = req.user.room

    console.log('user is now registering')
    let user = new User({
      name: req.body.name,

      passwordHash: bcrypt.hashSync(req.body.password, 10),

      isAdmin: req.body.isAdmin ? req.body.isAdmin : false,
      room

    });
    let usertosend = await user.save();

    if (!usertosend) return res.status(400).send("the user cannot be created!");

    else res.send(usertosend);
  }
  else {
    console.log('the user was found')
    return res.status(400).send("the user cannot be created!");
  }
});

// DELETE USER
UserRouter.delete("/:id", protect, admin, (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

// UPDATE USER
UserRouter.put("/:id", async (req, res) => {
  const userExist = await User.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

// TOTAL User
UserRouter.get('/cashiers', protect, admin, async (req, res) => {
  let room = req.user.room
  console.log(room)
  const cashiers = await User.find({ isAdmin: false, isSuperAdmin: false, room });
  console.log(cashiers)

  if (!cashiers) {
    res.status(500).json({ success: false });
  }
  res.send(cashiers);
});
UserRouter.get('/analytics/getall', protect, admin, async (req, res) => {
  let role = req.user.role
  console.log('this is working')
  const games = await Game.countDocuments();
  const users = await User.countDocuments();
  var todaystart = moment().startOf('day');
  // end today
  var thismonthstart = moment().startOf('month');   // set to the first of this month, 12:00 am
  var thisyearstart = moment().startOf('year');   // set to the first of this month, 12:00 am
  var thisweekstart = moment().startOf('week');
  var end = moment(todaystart).endOf('day');

  const todaygame = await Game.find({ dateCreated: { '$gte': todaystart, '$lte': end } })
  const thisweekgame = await Game.find({ dateCreated: { '$gte': thisweekstart, '$lte': end } })
  const thismonthgame = await Game.find({ dateCreated: { '$gte': thismonthstart, '$lte': end } })
  const todayuser = await User.find({ dateCreated: { '$gte': todaystart, '$lte': end } })
  const thisweekuser = await User.find({ dateCreated: { '$gte': thisweekstart, '$lte': end } })
  const thismonthuser = await User.find({ dateCreated: { '$gte': thismonthstart, '$lte': end } })
  const thisyearuser = await User.find({ dateCreated: { '$gte': thisyearstart, '$lte': end } })
  //users,
  //games,
  if (users) {
    res.json({
      users,
      games,
      todaygame,
      thisweekgame,
      thismonthgame,
      todayuser,
      thisweekuser,
      thismonthuser,
      thisyearuser
    })
  }
  else {

    res.status(404).json({
      message: "Error on sending"
    })
  }
});
UserRouter.get('/analytics/getcustom', protect, async (req, res) => {
  console.log(' this is good')
  const { startdate, enddate } = req.query
  console.log(startdate)
  console.log(enddate)
  // console.log(req.user)
  let isAdmin = req.user.isAdmin !== null ? req.user.isAdmin : false
  let isSuperAdmin = req.user.isSuperAdmin !== null ? req.user.isSuperAdmin : false
  let isCahier = !req.user.isAdmin && !req.user.isSuperAdmin
  if (isSuperAdmin) {
    console.log('super admin found')
    const user = await User.find({ dateCreated: { '$gte': startdate, '$lte': enddate } })
    const game = await Game.find({ dateCreated: { '$gte': startdate, '$lte': enddate } })
    const house = await House.find({ dateCreated: { '$gte': startdate, '$lte': enddate } })

    res.json({
      user: user.length, game, house
    }
    )
    // total houses 
    // total earnings
    // toal games 
  }
  else if (isAdmin) {
    console.log('this is here and now ')
    let room = req.user.room
    console.log(' admin found')
    const user = await User.find({ dateCreated: { '$gte': startdate, '$lte': enddate }, room, isAdmin: false, isSuperAdmin: false })
    const game = await Game.find({ dateCreated: { '$gte': startdate, '$lte': enddate }, room })

    res.json({
      user: user.length, game
    }
    )
    // total houses 
    // total earnings
    // toal games 
  }
  else if (isCahier) {
    let room = req.user.room
    console.log(req.user)
    let id = req.user._id


    console.log('cashier ')
    const game = await Game.find({ dateCreated: { '$gte': startdate, '$lte': enddate }, room, postedby: id.toString() })

    res.json({
      game
    }
    )
    // total houses 
    // total earnings
    // toal games 
  }

});
export default UserRouter;
