# Server Stats Card

The `ServerStatsCardBuilder` creates beautiful, grid-based guild statistics cards displaying member counts, online users, and guild boost tiers.

## Basic Usage

```typescript
import { ServerStatsCardBuilder } from 'canvas-forge';

const card = await new ServerStatsCardBuilder()
  .setGuildName('Pixel Developers')
  .setGuildIcon(guild.iconURL({ extension: 'png' }))
  .setTotalMembers(guild.memberCount)
  .setOnlineMembers(onlineCount)
  .setBoosts(guild.premiumSubscriptionCount)
  .setBoostLevel(guild.premiumTier)
  .build();
```

## Configuration

| Method | Description | Default |
|---|---|---|
| `setGuildName(name)` | Name of the Discord server/guild | `'Discord Server'` |
| `setGuildIcon(source)` | Guild icon image (URL, path, or Buffer) | `null` |
| `setTotalMembers(count)` | Total number of members | `1000` |
| `setOnlineMembers(count)` | Number of online members | `250` |
| `setBoosts(count)` | Number of server boosts | `15` |
| `setBoostLevel(level)` | Guild boost level / tier (0 to 3) | `2` |
| `setAccentColor(color)` | Accent color for progress bars and elements | `#5865F2` (Blurple) |
| `setTitleColor(color)` | Title/Guild name text color | `#ffffff` |
| `setValueColor(color)` | Main metric value text color | `#ffffff` |
| `setLabelColor(color)` | Label description text color | `#a0a0b0` |
| `setTheme(theme)` | Color theme (`'dark'`, `'light'`, `'custom'`) | `'dark'` |

## Discord.js Example

```typescript
import { AttachmentBuilder } from 'discord.js';
import { ServerStatsCardBuilder } from 'canvas-forge';

async function sendStats(interaction) {
  const guild = interaction.guild;
  const onlineCount = guild.members.cache.filter(m => m.presence?.status !== 'offline').size;

  const card = await new ServerStatsCardBuilder()
    .setGuildName(guild.name)
    .setGuildIcon(guild.iconURL({ extension: 'png' }))
    .setTotalMembers(guild.memberCount)
    .setOnlineMembers(onlineCount)
    .setBoosts(guild.premiumSubscriptionCount || 0)
    .setBoostLevel(guild.premiumTier)
    .build();

  const attachment = new AttachmentBuilder(card, { name: 'stats.png' });
  await interaction.reply({ files: [attachment] });
}
```
