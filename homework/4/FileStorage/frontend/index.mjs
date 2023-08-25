import { createWebSocketStream, WebSocket } from "ws";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

/*const ws = new WebSocket("ws://localhost:10004");
const wsStream = createWebSocketStream(ws);

ws.on("open", () => {
  wsStream.on("data", () => console.log("new chunk"));
  wsStream.on("close", () => console.log("stream closed"));
  wsStream.on("error", (err) => {
    console.log(err.message);
  });

  wsStream.on("end", () => {
    console.log("end");
  });

  console.log(path.resolve(__dirname, "./test.txt"));

  const reader = fs.createReadStream(path.resolve(__dirname, "./test.txt"));

  reader.pipe(wsStream, { end: false });
  console.log("ws connection opened");
});

ws.on("close", () => console.log("ws connection closed"));*/

async function uploadFile() {
  const fileStream = fs.createReadStream(path.resolve(__dirname, "./test.txt"));
  const id = fetch("http://127.0.0.1:10004/upload", {
    method: "POST",
    body: fileStream,
  });
}

uploadFile();
