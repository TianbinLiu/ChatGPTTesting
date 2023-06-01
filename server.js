const express = require('express');
const OpenAI = require('openai');

const app = express();
const port = 3000; // Change this to the desired port number

const openai = new OpenAI({ apiKey: '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' }); // Replace with your OpenAI API key

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.complete({
      engine: 'text-davinci-003', // Choose the appropriate ChatGPT model
      prompt: message,
      maxTokens: 50, // Adjust the response length as needed
      temperature: 0.6, // Adjust the temperature for more or less randomness
      n: 1, // Number of responses to generate
      stop: '\n', // Stop the response generation at a new line
    });

    const reply = response.data.choices[0].text.trim();
    res.json({ reply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
