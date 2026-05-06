const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();
// Increase limit to handle image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

const PORT = process.env.PORT || 3000;
const dbFile = './db.json';

// --- DATABASE INITIALIZATION ---
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ messages: [] }));
}

function getMessages() {
    try {
        return JSON.parse(fs.readFileSync(dbFile)).messages;
    } catch (e) { return []; }
}

function saveMessage(role, content) {
    const data = JSON.parse(fs.readFileSync(dbFile));
    data.messages.push({ role, content, timestamp: new Date() });
    if (data.messages.length > 50) data.messages.shift(); // Keep history lean
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// --- AUTH MIDDLEWARE ---
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "AUTH_REQUIRED" });
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(403).json({ error: "SESSION_EXPIRED" });
    }
};

// --- LOGIN ROUTE ---
app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.MY_PASSWORD) {
        const token = jwt.sign({ user: 'Sahad' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } else {
        res.status(401).json({ error: "INVALID_CREDENTIALS" });
    }
});

// --- AI ENGINE CONFIG ---
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are a senior full-stack architect. Provide production-ready code with line-by-line explanations."
});

// --- CHAT & VISION ROUTE ---
app.post('/chat', verifyToken, async (req, res) => {
    try {
        const { message, image, mimeType } = req.body;

        // Prepare History for Context
        const historyData = getMessages().slice(-10);
        const history = historyData.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        let result;
        if (image) {
            // Multimodal (Image + Text)
            const promptParts = [
                { inlineData: { data: image, mimeType: mimeType || "image/jpeg" } },
                { text: message || "Analyze this image." }
            ];
            result = await model.generateContent(promptParts);
        } else {
            // Standard Chat with History
            const chat = model.startChat({ history });
            result = await chat.sendMessage(message);
        }

        const responseText = result.response.text();

        // Persist to JSON
        saveMessage('user', message || "[Image Sent]");
        saveMessage('model', responseText);

        res.json({ text: responseText });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "SERVER_ERROR", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`
🚀 SAHAD_AI_v2.5 DEPLOYED
--------------------------
URL: http://localhost:${PORT}
STATUS: SECURE (JWT ENABLED)
DATABASE: ${dbFile}
--------------------------
    `);
});
