import express from "express";
import House from "../models/HouseModels.js";
import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { protect, superadmin, admin } from "../helpers/AuthMiddleware.js";

const houseRouter = express.Router();

// GET ALL HOUSE
houseRouter.get("/", protect, superadmin, async (req, res) => {
  const houseList = await House.find({});
  res.status(200).send(houseList);
});

// GET HOUSE ONE
houseRouter.get("/:id", async (req, res) => {
  const house = await House.findById(req.params.id);

  if (!house) {
    res
      .status(500)
      .json({ message: "The house with the given ID was not found." });
  }
  res.status(200).send(house);
});

// CREATE HOUSE
houseRouter.post("/", protect, superadmin, async (req, res) => {
  console.log(req.body)
  let userfound = await User.find({ name: req.body.username })
  console.log(userfound)
  if (userfound.length < 1) {
    console.log('kk')
    let housefind = await House.find({ name: req.body.name })
    console.log(housefind ? 'a' : "b")

    if (housefind.length >= 1) {
      return res.status(400).send("the house cannot be created!");
    }
    let house = new House({
      name: req.body.name,
      owner: req.body.owner,
      city: req.body.city,
      detail: req.body.detail,
      isActive: true,
    });
    let housefound = await house.save();
    console.log(house)

    let user = new User({
      name: req.body.username,
      room: house._id,

      passwordHash: bcrypt.hashSync(req.body.password, 10),

      isAdmin: true,

    });
    let userhere = await user.save();


    if (!housefound) return res.status(400).send("the house cannot be created!");

    res.send(housefound);
  }
  else {
    console.log('aa')
    return res.status(400).send("the house cannot be created!");

  }
});

// DELETE HOUSE
houseRouter.delete("/:id", protect, superadmin, (req, res) => {
  console.log('this is deleting  route')
  House.findByIdAndRemove(req.params.id)
    .then((house) => {
      if (house) {
        return res
          .status(200)
          .json({ success: true, message: "the house is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "house not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

// UPDATE HOUSE
houseRouter.put("/:id", protect, superadmin, async (req, res) => {
  console.log(req.params)
  console.log(req.body)
  const house = await House.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      city: req.body.city, //|| house.icon,
      detail: req.body.detail,
      isActive: req.body.isActive,
    },
    { new: true }
  );

  if (!house) return res.status(400).send("the house cannot be Updated!");

  res.send(house);
});

export default houseRouter;
