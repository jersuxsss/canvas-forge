# Getting Started with canvas-forge

This guide will walk you through installing canvas-forge and creating your first Discord card.

## Prerequisites

- **Node.js** 18 or higher
- A **Discord bot** project (using [discord.js](https://discord.js.org/) v14 recommended)

## Installation

Choose your preferred package manager:

```bash
# npm
npm install canvas-forge

# yarn
yarn add canvas-forge

# pnpm
pnpm add canvas-forge
```

That's it! No system dependencies required. No Cairo, no Pango, no `node-gyp` — canvas-forge uses `@napi-rs/canvas` which ships with pre-built binaries.

## Your First Welcome Card

### 1. Import the builder

```typescript
import { WelcomeCardBuilder } from 'canvas-forge';
import { AttachmentBuilder, Events } from 'discord.js';
```

### 2. Create the card in your event handler

```typescript
client.on(Events.GuildMemberAdd, async (member) => {
  // Build the welcome card
  const card = await new WelcomeCardBuilder()
    .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
    .setUsername(member.user.username)
    .setGuildName(member.guild.name)
    .setMemberCount(member.guild.memberCount)
    .build();

  // Send it to a channel
  const channel = member.guild.channels.cache.get('YOUR_CHANNEL_ID');
  if (channel?.isTextBased()) {
    const attachment = new AttachmentBuilder(card, { name: 'welcome.png' });
    await channel.send({
      content: `Welcome to the server, ${member}!`,
      files: [attachment],
    });
  }
});
```

### 3. Customize it!

```typescript
const card = await new WelcomeCardBuilder()
  .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(member.user.username)
  .setGuildName(member.guild.name)
  .setMemberCount(member.guild.memberCount)
  // Customization
  .setTitleText('Welcome aboard!')
  .setSubtitleText('You are member #{memberCount}')
  .setTheme('dark')                      // or 'light' or 'custom'
  .setAvatarBorder('#e94560')            // Pink border
  .setTitleColor('#e94560')              // Pink title
  .setBackgroundGradient({               // Gradient background
    colors: ['#1a1a2e', '#16213e'],
    direction: 'diagonal',
  })
  .setOverlay('#000000', 0.2)           // Subtle dark overlay
  .setOutputFormat('png')               // PNG, JPEG, or WebP
  .build();
```

## Next Steps

- 📖 [API Reference](./api-reference.md) — Full documentation of every class and method
- 🎴 [Welcome Card Guide](./cards/welcome-card.md)
- 🏆 [Rank Card Guide](./cards/rank-card.md)
- ⬆️ [Level Up Card Guide](./cards/level-up-card.md)
- 👤 [Profile Card Guide](./cards/profile-card.md)
- 🎨 [Custom Canvas Guide](./custom-canvas.md)
