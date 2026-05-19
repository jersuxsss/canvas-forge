/**
 * Example: Creating a Server Stats Card
 *
 * This example demonstrates how to create a server statistics card for members,
 * online status, and boost details.
 */

import { ServerStatsCardBuilder } from 'canvas-forge';
// import { AttachmentBuilder } from 'discord.js';

async function createServerStatsCard(): Promise<Buffer> {
  const card = await new ServerStatsCardBuilder()
    .setGuildName('Pixel Developers')
    .setGuildIcon('https://cdn.discordapp.com/icons/123456789/icon.png')
    .setTotalMembers(2540)
    .setOnlineMembers(890)
    .setBoosts(22)
    .setBoostLevel(3)
    .setTheme('dark')
    .build();

  return card;
}

createServerStatsCard().then((buffer) => {
  console.log(`Server stats card generated! Size: ${buffer.length} bytes`);
});
