import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose, { connect } from "mongoose";

const DB = String(process.env.DB_URL).replace(
  "<PASSWORD>",
  String(process.env.DB_PASS)
);

mongoose
  .connect(DB)
  .then(() => console.log(`DB Connected`))
  .catch((e) => console.error(`DB Connection Failed`));

const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
