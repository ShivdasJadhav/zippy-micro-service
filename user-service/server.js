import "dotenv/config";
import http from "http";
import app from "./app";
import { rabbitConn } from "./service/rabbit";
import { dbConn } from "./db/db";

const server = http.createServer(app);

try {
  await dbConn();
  console.log("🗄️  [User service] MongoDB connected successfully..!");

  await rabbitConn();
  console.log("🐰 [User service] RabbitMQ connected successfully..!");

  server.listen(3001, () => {
    console.log("✅ [User service] is running on port 3001");
  });
} catch (err) {
  console.error("❌ [User service] Startup Error:", err);
}
