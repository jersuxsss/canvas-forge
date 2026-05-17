/**
 * Example: Creating an Info Card
 *
 * This example demonstrates how to create a general-purpose info card
 * similar to Discord embeds.
 */

import { InfoCardBuilder } from 'canvas-forge';

async function createInfoCard(): Promise<Buffer> {
  const card = await new InfoCardBuilder()
    .setTitle('Server Rules')
    .setDescription('Please follow these rules to keep our community friendly and safe for everyone.')
    .addField({ name: 'Rule 1', value: 'Be respectful to all members' })
    .addField({ name: 'Rule 2', value: 'No spam or self-promotion' })
    .addField({ name: 'Members', value: '1,500', inline: true })
    .addField({ name: 'Online', value: '320', inline: true })
    .addField({ name: 'Roles', value: '25', inline: true })
    .setFooter('Last updated: May 2026')
    .setAccentColor('#5865F2')
    .build();

  return card;
}

createInfoCard().then((buffer) => {
  console.log(`Info card generated! Size: ${buffer.length} bytes`);
});
