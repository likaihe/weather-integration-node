import express from "express";
import weatherRouter from "./src/routes/weather.routes";

const app = express();
const PORT = 8080; // per your OpenAPI servers

app.use(express.json());

// mount routes matching the spec
app.use("/", weatherRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
