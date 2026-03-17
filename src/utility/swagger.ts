import swaggerJsdoc from "swagger-jsdoc";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API Documentation",
      version: "1.0.0",
      description: "A simple Express API with Swagger documentation",
    },
    servers: [
      {
        url: BACKEND_URL,
      },
    ],
  },
  apis: [
    path.join(__dirname, "..", "./routes/**/*.js"),
    path.join(__dirname, "..", "app.js"),
  ],
};

export const specs = swaggerJsdoc(options);
