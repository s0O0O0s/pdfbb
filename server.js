const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

// 1. サーバー内のテキストチャンネル一覧を取得
app.get('/api/channels', async (req, res) => {
  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/channels`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const channels = await response.json();
    
    if (!Array.isArray(channels)) {
      return res.status(500).json({ error: 'チャンネル一覧の取得に失敗しました', details: channels });
    }

    // テキストチャンネル（type: 0）のみ抽出して昇順ソート
    const textChannels = channels
      .filter(c => c.type === 0)
      .sort((a, b) => a.position - b.position);

    res.json(textChannels);
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// 2. 指定チャンネルのメッセージ取得
app.get('/api/channels/:channelId/messages', async (req, res) => {
  const { channelId } = req.params;
  try {
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '取得エラーが発生しました' });
  }
});

// 3. 指定チャンネルへメッセージ送信
app.post('/api/channels/:channelId/messages', async (req, res) => {
  const { channelId } = req.params;
  try {
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
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
