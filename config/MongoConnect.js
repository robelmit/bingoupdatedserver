import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const URL = process.env.MONGO_URL;
// console.log(URL)

const connectDB = async () => {



  console.log('tring to connect')
  try {
    const conn = await mongoose.connect(`mongodb+srv://miki:a85RoEwyn5uKuStg@cluster0.7llfyox.mongodb.net/bingo?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('cool')

    // const conn = await mongoose.connect(`mongodb://127.0.0.1/bingo`, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    // });
    console.log(`MongoDB Connected:`);
  } catch (error) {
    console.log('shit')

    console.error(error.message);
    process.exit(1);
  }
}



export default connectDB