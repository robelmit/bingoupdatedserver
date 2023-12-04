import mongoose from "mongoose";

const housemodel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,

  },
  detail: {
    type: String,
    required: true,

  },
  isActive: {
    type: Boolean,
    required: true,

  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },

});
// categorySchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });

// categorySchema.set('toJSON', {
//     virtuals: true,
// });

const House = mongoose.model("Houses", housemodel);

export default House;
