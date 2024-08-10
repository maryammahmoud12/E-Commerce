import mongoose from "mongoose";

const connectionDB = async () => {
  return await mongoose
    .connect(process.env.linkDBOnline)
    .then(() => {
      console.log("connected to database success");
    })
    .catch((err) => {
      console.log("connected to database fail");
    });
};

export default connectionDB;
