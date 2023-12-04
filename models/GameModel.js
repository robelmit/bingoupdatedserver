import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({

  players: {
    type: Array,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  pattern: {
    type: String,
    required: true,
  },
  gameid: {
    type: String,
    required: true,
  },

  winamount: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  scores: {
    type: Array,
    required: true,
  },

  isWon: {
    type: Boolean,
    default: false,
    required: true,
  },
  postedby: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
    required: true,
  },
  winner: {
    type: Number,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  room: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Houses',
    required: true,
  }
});

GameSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

GameSchema.set("toJSON", {
  virtuals: true,
});

const Games = mongoose.model("Games", GameSchema);

export default Games;
