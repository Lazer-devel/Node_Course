import fs from "fs/promises";
import express from "express";
import cors from "cors";

console.log("start app");
const app = express();
const path = `./src/elections.json`;
let elections: Map<string, { votes: number }>;

app.use(express.json());
app.use(cors());

fs.readFile(path, {
  encoding: "utf-8",
}).then((initData: string) => {
  elections = new Map(Object.entries(JSON.parse(initData)));
  app.listen(10001);
  console.log("Server start listen port 10001");
});

app.get("/variants", (_, res) => {
  console.log("get /variants");
  res.json([...elections.keys()]);
});

app.get("/stat", (_, res) => {
  console.log("get /stat");
  res.json(Object.fromEntries(elections));
});

app.post("/vote", (req, res) => {
  console.log("get /vote");
  elections.get(req.body.name)!.votes++;
  fs.writeFile(path, JSON.stringify(Object.fromEntries(elections))).then(() =>
    res.send()
  );
});
