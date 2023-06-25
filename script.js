import express from "express";
import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import cors from "cors";

config();

const app = express();

app.use(express.json());
const allowedOrigins = ["http://127.0.0.1:5500/", "http://127.0.0.1:5500/public/index.html"];

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,

  }))

app.use(cors({
  origin: function(origin, callback) {
      console.log("COR request from ", origin);
      return callback(null, true);
  }
}))

app.get("/api/chat",(req, res) => {
  res.send("Chat API");
});

app.post("/api/chat", async (req, res) => {
  const { input } = req.body;

  const response = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
  });

  const output = response.data.choices[0].message.content;
  res.json({ output });
});

app.listen(443, () => {
  console.log("Server is running on port 3000");
});
