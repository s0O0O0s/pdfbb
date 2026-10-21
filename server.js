const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// publicフォルダ内の静的ファイル（index.html等）をルート(/)で配信
app.use(express.static(path.join(__dirname, 'public')));

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

// メッセージ取得 (GET)
app.get('/api/messages', async (req, res) => {
  try {
    const response = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '取得エラーが発生しました' });
  }
});

// メッセージ送信 (POST)
app.post('/api/messages', async (req, res) => {
  try {
    const response = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: req.body.content })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '送信エラーが発生しました' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
