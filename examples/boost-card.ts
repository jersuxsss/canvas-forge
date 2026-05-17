/**
 * Example: Creating a Boost Card
 *
 * This example demonstrates how to create a server boost notification card
 * and send it in a Discord channel using discord.js.
 */

import { BoostCardBuilder } from 'canvas-forge';
// import { AttachmentBuilder } from 'discord.js';

async function createBoostCard(): Promise<Buffer> {
  const card = await new BoostCardBuilder()
    .setAvatar('https://cdn.discordapp.com/avatars/123456789/avatar.png')
    .setUsername('Jersuxs')
    .setGuildName('My Server')
    .setBoostCount(15)
    .setTitleText('Server Boosted!')
    .setSubtitleText('This server now has {boostCount} boosts!')
    .setAccentColor('#f47fff')
    .build();

  return card;
}

createBoostCard().then((buffer) => {
  console.log(`Boost card generated! Size: ${buffer.length} bytes`);
});
