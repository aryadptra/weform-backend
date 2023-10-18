import mongoose from "mongoose";

const connection = () => {
  // connection to mongodb server
  mongoose.connect("mongodb://localhost:27017", {
    dbName: "weform",
  });

  // create a new constanta
  const connection = mongoose.connection;

  // mongodb error handler
  connection.on("error", function (err) {
    console.error(err);
  });

  connection.on("open", () => {
    console.log("Mongoodb successfully connected");
  });
};

export default connection;
