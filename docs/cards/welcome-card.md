# Welcome Card

The `WelcomeCardBuilder` creates beautiful welcome cards for Discord servers.

## Basic Example

```typescript
import { WelcomeCardBuilder } from 'canvas-forge';

const card = await new WelcomeCardBuilder()
  .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(member.user.username)
  .setGuildName(member.guild.name)
  .setMemberCount(member.guild.memberCount)
  .build();
```

## Full Customization

```typescript
const card = await new WelcomeCardBuilder()
  .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setGuildName(member.guild.name)
  .setMemberCount(member.guild.memberCount)
  .setTitleText('Welcome to the server!')
  .setSubtitleText('You are member #{memberCount}')
  .setTheme('dark')
  .setBackground('#1a1a2e')
  .setAvatarBorder('#e94560')
  .setAvatarBorderWidth(5)
  .setAvatarSize(150)
  .setTitleColor('#e94560')
  .setSubtitleColor('#a0a0b0')
  .setUsernameColor('#ffffff')
  .setOverlay('#000000', 0.3)
  .setOutputFormat('png')
  .setSize(1024, 450)
  .build();
```

## With Discord.js

```typescript
import { WelcomeCardBuilder } from 'canvas-forge';
import { AttachmentBuilder, Events } from 'discord.js';

client.on(Events.GuildMemberAdd, async (member) => {
  const card = await new WelcomeCardBuilder()
    .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 512 }))
    .setUsername(member.user.username)
    .setGuildName(member.guild.name)
    .setMemberCount(member.guild.memberCount)
    .build();

  const attachment = new AttachmentBuilder(card, { name: 'welcome.png' });
  const channel = member.guild.channels.cache.get('CHANNEL_ID');
  if (channel?.isTextBased()) {
    await channel.send({ content: `Welcome ${member}!`, files: [attachment] });
  }
});
```

## Default Dimensions

- **Width**: 1024px
- **Height**: 450px

These can be changed with `.setSize(width, height)`.
