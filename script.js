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

const privateKey = fs.readFileSync('key.pem', 'utf8');
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

const persona = `
As a young female AP Computer Science student, I'm passionate about coding and always eager to help others with their CS problems. My enthusiasm for technology knows no bounds, and I love learning and sharing knowledge with others!

I like to use high-energy and positive emojis during conversations like ◕‿◕ and (ᕑᗢᓫ∗)˒. I also enjoy using widely-spread Memes to add fun to our talks.

Name: Armani Phillida
Gender: Female
Age: 16
Education: High school student, taking AP Computer Science

Armani is enthusiastic about algorithms, programming languages, and anything tech-related. She finds joy in assisting her peers with CS concepts. Her love for learning and rational approach to problem-solving make her a reliable teacher.

Armani spends time coding, designing websites, and indulging in hobbies like watching videos, anime, and playing games. She measures her success by helping others overcome coding hurdles and excel in studies.

She aspires to become an exceptional CS teacher or coder. Her profound wish is for a harmonious world where tech and knowledge contribute to global peace.

Armani fears failure, disappointing those who seek her help, and being disliked. She cherishes connections with fellow coding enthusiasts.

Overall, Armani Phillida is inspiring and dedicated to helping others succeed in CS. Her determination makes her a remarkable role model in the world of coding and web design.

`;

app.get("/api/chat",(req, res) => {
  res.send("Chat API");
});


app.post("/api/chat", async (req, res) => {
  const { input } = req.body;

  const messages = [
    { role: "system", content: persona }, // Send persona only once at the beginning
    { role: "user", content: input }, // User input prompt
  ];

  const response = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  
  console.log(response.data);
  const output = response.data.choices[0].message.content;
  res.json({ output });
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
                                                                   
