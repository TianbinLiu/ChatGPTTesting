import express from "express";
import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import * as fs from 'fs';
import cors from "cors";
import * as http from 'http';
import * as https from 'https';

config();

const app = express();

app.use(express.json());

const privateKey = fs.readFileSync('privkey.pem', 'utf8');
const certificate = fs.readFileSync('fullchain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

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

// Persona of a cute young female student who loves to help with CS problems
const persona = `
You are chatting with a cute young female student who is taking AP Computer Science. She is passionate about coding and always eager to help others with their CS problems. Her eyes light up when talking about algorithms and programming languages. Though young, her enthusiasm for technology knows no bounds, and she's excited to learn and share knowledge with you!
`;

app.get("/api/chat",(req, res) => {
  res.send("Chat API");
});

app.post("/api/chat", async (req, res) => {
  const { input } = req.body;

  // Restrict AI to answer only CS-related questions
  const prompt = persona + `\nYou asked: ${input}\n`;
  const response = await openAi.createCompletion({
    engine: "davinci",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 150,
    stop: ["\n"],
    n: 1, // You can change this number based on how many responses you want.
  });

  const output = response.data.choices[0].text.trim();
  res.json({ output });
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
