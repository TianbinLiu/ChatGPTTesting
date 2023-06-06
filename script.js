import express from "express";
import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import readline from "readline";

config();

const app = express();
app.use(express.json());

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

app.get("/api/chat", (req, res) => {
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
