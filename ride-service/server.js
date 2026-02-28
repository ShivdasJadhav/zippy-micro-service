import "dotenv/config";
import http from "http";
import app from "./app";
import { rabbitConn } from "./service/rabbit";
import { dbConn } from "./db/db";

const server = http.createServer(app);

try {
  await dbConn();
  console.log("🗄️  [Rider service] MongoDB connected successfully..!");

  await rabbitConn();
  console.log("🐰 [Rider service] RabbitMQ connected successfully..!");

  server.listen(3003, () => {
    console.log("✅ [Rider service] is running on port 3003");
  });
} catch (err) {
  console.error("❌ [Rider service] Startup Error:", err);
}
