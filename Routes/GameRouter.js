import express from "express";
import mongoose from "mongoose";
import { protect, admin } from "../helpers/AuthMiddleware.js";

import multer from "multer";
// import Category from "../models/categoryModel.js";
import Game from "../models/GameModel.js";

const GameRouter = express.Router();

// UPLOAD IMAGE
// const FILE_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpeg",
//   "image/jpg": "jpg",
// };



// END OF IMAGE UPLOAD

GameRouter.get("/", protect, async (req, res) => {

  let filter = { room: req.user.room }
  const GameList = await Game.find(filter).populate("postedby");

  if (!GameList) {
    res.status(500).json({ success: false });
  }
  res.send(GameList);
});

// CREATE Game
GameRouter.post(`/`, protect, async (req, res) => {

  console.log(req.body)
  console.log(req.user)


  let room = req.user.room

  let finalgame = Date.now().toString() + req.body.gameid

  let game = new Game({
    players: req.body.players,
    amount: req.body.amount,
    pattern: req.body.pattern,
    winamount: req.body.winamount,
    percentage: req.body.percentage,
    scores: req.body.scores,
    postedby: req.user._id,
    isWon: false,
    gameid: finalgame,
    room
  });

  let Gamefound = await game.save();
  console.log(Gamefound)
  if (!Gamefound) return res.status(500).send("The Game cannot be created");

  else res.send(Gamefound);
});

// GET ONE Game
GameRouter.get(`/:id`, protect, async (req, res) => {
  let filter = { room: req.user.room, _id: req.params.id }

  const game = await Game.findOne(filter).populate("postedby").populate("room");

  if (!game) {
    res.status(500).json({ success: false });
  }
  else res.send(game);
});

// UPDATE Game
GameRouter.put("/:id", protect, async (req, res) => {
  console.log('updating game ')
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Game Id");
  }


  const game = await Game.findByIdAndUpdate(
    req.params.id,
    {
      scores: [],

    },
    { new: true }
  );

  if (!game) return res.status(500).send("the Game cannot be updated!");

  res.send(game);
});
GameRouter.put("/won/:id", protect, async (req, res) => {
  console.log(req.body)
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Game Id");
  }
  let gamefound = await Game.findById(req.params.id)
  if (gamefound.room.toString() == req.user.room.toString()) {



    const game = await Game.findByIdAndUpdate(
      req.params.id,
      {
        isWon: true,
        winner: req.body.winner,

      },
      { new: true }
    );

    if (!game) return res.status(500).send("the Game cannot be updated!");

    else res.send(game);
  }
  else {
    console.log('second case ')
    return res.status(500).send("the Game cannot be updated!");
  }

});
GameRouter.put("/score/:id", protect, async (req, res) => {
  console.log('this is the update')
  let { scores } = req.body
  console.log('this is the update', scores)

  console.log(req.params.id)
  // if (!mongoose.isValidObjectId(req.params.id)) {
  //   return res.status(400).send("Invalid Game Id");
  // }
  let gamefound = await Game.findById(req.params.id)
  var game = await Game.findById(req.params.id)
  console.log('game room', gamefound.room.toString())
  console.log('userroom', req.user.room.toString())
  if (gamefound.room.toString() === req.user.room.toString()) {
    console.log('miki is miki')
    let updatedgame
    Game.findById(req.params.id).then(gamedetail => {
      let items = gamedetail.scores
      console.log(items)
      console.log(scores)
      if (items.includes(scores) || scores <= 0 || scores > 75) return res.status(301).json({ message: "the game cann't be updated" });
      else {
        console.log('miki is working')

        gamedetail.scores.push(scores);
        updatedgame = gamedetail.save();

        res.send(updatedgame);

      }
    }).catch(error => {
      console.log(error)
      return res.status(404).end(error);
    })

    //   , async (gamedetail) => {
    //   console.log(gamedetail)
    //   gamedetail.scores.push(scores);
    //   updatedgame = await gamedetail.save();
    // })

    console.log('miki is sleeping')
    if (!game) return res.status(500).end("the Game cannot be updated!");
  }
  else {
    if (!game) return res.status(500).end("the Game cannot be updated!");

  }
});

// DELETE Game
GameRouter.delete("/:id", protect, async (req, res) => {
  let gamefound = await Game.findById(req.params.id)
  if (gamefound.room == req.user.room) {
    Game.findByIdAndRemove(req.params.id)
      .then((Game) => {
        if (Game) {
          return res
            .status(200)
            .json({ success: true, message: "the Game is deleted!" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "Game not found!" });
        }
      })
      .catch((err) => {
        return res.status(500).json({ success: false, error: err });
      });
  }
  else {
    return res
      .status(404)
      .json({ success: false, message: "Error occured while deleting!" });
  }
});

// TOTAL GameS
GameRouter.get(`/get/count`, protect, async (req, res) => {
  let gamefound = await Game.findById(req.params.id)
  if (gamefound.room == req.user.room) {
    const GameCount = await Game.countDocuments((count) => count);

    if (!GameCount) {
      res.status(500).json({ success: false });
    }
    res.send({
      GameCount: GameCount,
    });
  }
  else {
    return res.status(400).send("Error occured");
  }
});

GameRouter.get(`/get/games`, protect, admin, async (req, res) => {
  console.log(req.user)

  const game = await Game.find({ room: req.user.room.toString() }).sort({ '_id': -1 })

  if (!game) {
    res.status(500).json({ success: false });
  }
  else res.send(game);


});

// DISPLAY FEATURED Game
// GameRouter.get(`/get/featured/:count`, protect, async (req, res) => {
//   const count = req.params.count ? req.params.count : 0;
//   const Games = await Game.find({ isFeatured: true }).limit(+count);

//   if (!Games) {
//     res.status(500).json({ success: false });
//   }
//   res.send(Games);
// });

// GameRouter.put(
//   "/gallery-images/:id", protect,
//   async (req, res) => {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       return res.status(400).send("Invalid Game Id");
//     }
//     const files = req.files;
//     let imagesPaths = [];
//     const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

//     if (files) {
//       files.map((file) => {
//         imagesPaths.push(`${basePath}${file.filename}`);
//       });
//     }

//     const Game = await Game.findByIdAndUpdate(
//       req.params.id,
//       {
//         images: imagesPaths,
//       },
//       { new: true }
//     );

//     if (!Game) return res.status(500).send("the gallery cannot be updated!");

//     res.send(Game);
//   }
// );

export default GameRouter;
