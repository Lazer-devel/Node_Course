import fs from "fs/promises";
import express from "express";
import cors from "cors";

console.log("start app");
const app = express();
const path = `./src/elections.json`;
let elections: Map<string, { name: string; votes: number }>;

app.use(express.json());
app.use(cors());

fs.readFile(path, {
  encoding: "utf-8",
}).then((initData: string) => {
  console.log(Object.entries(JSON.parse(initData)));
  elections = new Map(Object.entries(JSON.parse(initData)));
  app.listen(10001);
  console.log("Server start listen port 10001");
});

app.get("/variants", (_, res) => {
  console.log("get /variants");
  const variants = [...elections.entries()].map((arr) => {
    return { id: arr[0], name: arr[1].name };
  });
  res.json(variants);
});

app.post("/stat", (_, res) => {
  console.log("post /stat");
  res.json(Object.fromEntries(elections));
});

app.post("/vote", (req, res) => {
  console.log("get /vote");
  elections.get(req.body.id)!.votes++;
  fs.writeFile(path, JSON.stringify(Object.fromEntries(elections))).then(() =>
    res.send()
  );
});
