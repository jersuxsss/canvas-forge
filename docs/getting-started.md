# Getting Started

Welcome to **canvas-forge**! This guide will help you get up and running in minutes.

## Installation

```bash
# npm
npm install canvas-forge

# yarn
yarn add canvas-forge

# pnpm
pnpm add canvas-forge
```

> **Note:** canvas-forge requires **Node.js 18** or higher.

## Your First Card

Let's create a simple welcome card:

```typescript
import { WelcomeCardBuilder } from 'canvas-forge';
import fs from 'fs';

const card = await new WelcomeCardBuilder()
  .setUsername('Jersuxs')
  .setGuildName('My Server')
  .setMemberCount(1500)
  .setTitleText('Welcome!')
  .setBackground('#1a1a2e')
  .build();

// Save to file
fs.writeFileSync('welcome.png', card);
```

## Available Card Builders

canvas-forge ships with **9 built-in card builders**:

| Builder | Use Case |
|---|---|
| `WelcomeCardBuilder` | Welcome new members |
| `LeaveCardBuilder` | Say goodbye to departing members |
| `RankCardBuilder` | Display XP/rank with progress bars |
| `LevelUpCardBuilder` | Level-up notifications |
| `ProfileCardBuilder` | Detailed user profiles with stats |
| `BoostCardBuilder` | Server boost notifications |
| `InfoCardBuilder` | General info cards (like embeds) |
| `LeaderboardCardBuilder` | Ranked leaderboards |
| `SpotifyCardBuilder` | Now Playing / music cards |

## Custom Canvas

If the built-in cards don't fit your needs, use `CanvasBuilder` for full creative freedom:

```typescript
import { CanvasBuilder } from 'canvas-forge';

const buffer = new CanvasBuilder(800, 400)
  .setBackground('#1a1a2e')
  .drawShadow()
  .drawGradientRect(20, 20, 760, 360, { colors: ['#e94560', '#0f3460'] }, 15)
  .clearShadow()
  .setFont(32, 'sans-serif', 'bold')
  .drawText('Custom Design', 400, 200, '#ffffff', 'center')
  .drawLine(40, 250, 760, 250, '#e94560', 2)
  .drawProgressBar(50, 300, 700, 30, 0.75, '#e94560', '#2a2a3e')
  .toBuffer();
```

## Using with Discord.js

```typescript
import { WelcomeCardBuilder } from 'canvas-forge';
import { AttachmentBuilder, Client, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.GuildMembers] });

client.on('guildMemberAdd', async (member) => {
  const card = await new WelcomeCardBuilder()
    .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
    .setUsername(member.user.username)
    .setGuildName(member.guild.name)
    .setMemberCount(member.guild.memberCount)
    .build();

  const attachment = new AttachmentBuilder(card, { name: 'welcome.png' });
  const channel = member.guild.systemChannel;
  if (channel) channel.send({ files: [attachment] });
});
```

## Next Steps

- Check the [API Reference](./api-reference.md) for all methods and options
- Browse the [examples](../examples/) directory for more code samples
- Read the individual card docs in the [cards](./cards/) directory
- Try building a [Custom Canvas](./custom-canvas.md) from scratch
