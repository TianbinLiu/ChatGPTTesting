//tutorial: https://www.youtube.com/watch?v=4qNwoAAfnk4
//openai documentation(python): https://platform.openai.com/docs/guides/chat

import { config } from "dotenv"
config()

import { Configuration, OpenAIApi } from "openai"

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.API_KEY
}))


const dialogElement = document.getElementById("dialog");
const userInputElement = document.getElementById("user-input");
const submitButton = document.getElementById("submit-btn");

let userInputArray = [];

function appendUserInput(input) {
  const userInputItem = document.createElement("div");
  userInputItem.innerText = input;
  dialogElement.appendChild(userInputItem);
}

function handleUserInput() {
  const userInput = userInputElement.value;
  const res = openai.createChatCompletion({
    model:"gpt-3.5-turbo",
    messages: [{role:"user", content: userInput}],
  })
  console.log(res.data.choices[0].message.content) //print out result(output)
  userInputArray.push(userInput);
  appendUserInput(userInput);
  userInputElement.value = "";
}

submitButton.addEventListener("click", handleUserInput);
userInputElement.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleUserInput();
  }
});








