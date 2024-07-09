import express from "express";

import config from "./config";
import router from "./routes/index";

const app = express();

app.use(express.json());
app.use(router);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
export default router;
