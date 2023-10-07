import express from "express";
import { userRouter } from "./routes/userRouter.js";
import { globalErrorHandler } from "./utils/globalErrorHandler.js";
import { AppError } from "./utils/AppError.js";
import { authRouter } from "./routes/authRouter.js";
import cookieparser from "cookie-parser";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "users crud",
      version: "1.0.0",
      description: "A simple CRUD users API",
    },
    servers: [
      {
        url: `http://localhost:${process.env.NODE_PORT}`,
      },
    ],
  },
  apis: ["./src/routes/*.js", "./dist/routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use((req, res, next) => {
  console.log(req.url);
  next();
});
app.use(cors());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export { app };
