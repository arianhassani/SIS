import express from "express";
import cors from "cors";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log('Server listening on ' + port);
});
