import express from 'express';
import axios from 'axios';

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/process-receipt', async (req, res) => {
  try {
    const { imageData } = req.body;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent',
      {
        contents: [
          {
            parts: [
              { text: "Extract the following information from this receipt image: item names, quantities, prices, and total amount. Format the response as a JSON object." },
              { inline_data: { mime_type: "image/jpeg", data: imageData } }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`
        }
      }
    );

    const extractedData = JSON.parse(response.data.candidates[0].content.parts[0].text);
    res.json({ success: true, data: extractedData });

  } catch (error) {
    console.error('Error processing receipt:', error);
    res.status(500).json({ success: false, error: 'An error occurred while processing the receipt' });
  }
});

export default router;