import dotenv from "dotenv";
import mongoose from "mongoose";

const env = dotenv.config().parsed;

const connection = () => {
  // connection to mongodb server
  mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_NAME,
  });

  // create a new constanta
  const connection = mongoose.connection;

  // mongodb error handler
  connection.on("error", function (err) {
    console.error(err);
  });

  connection.on("open", () => {
    console.log(
      `Mongoodb successfully connected to ${env.MONGODB_NAME} database`
    );
  });
};

export default connection;
