import express from "express";

import config from "./config";
import router from "./routes/index";
import { requestLogger } from "./middleware/logger";
import { genericErrorHandler, notFoundError } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(notFoundError);
app.use(genericErrorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
