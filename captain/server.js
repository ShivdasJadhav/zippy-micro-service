import "dotenv/config";
import http from "http";
import app from "./app";
import { rabbitConn } from "./service/rabbit";
import { dbConn } from "./db/db";

const server = http.createServer(app);

try {
  await dbConn();
  console.log("🗄️  [Captain service] MongoDB connected successfully..!");

  await rabbitConn();
  console.log("🐰 [Captain service] RabbitMQ connected successfully..!");

  server.listen(3002, () => {
    console.log("✅ [Captain service] is running on port 3002");
  });
} catch (err) {
  console.error("❌ [Captain service] Startup Error:", err);
}
