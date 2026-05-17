/**
 * Example: Creating a Rank Card
 */

import { RankCardBuilder } from 'canvas-forge';
import { writeFileSync } from 'fs';

async function main(): Promise<void> {
  const card = await new RankCardBuilder()
    .setUsername('Jersuxs')
    .setLevel(15)
    .setCurrentXP(2500)
    .setRequiredXP(5000)
    .setRank(3)
    .setStatus('online')
    .setProgressBarColor('#e94560')
    .setProgressBarTrackColor('#2a2a3e')
    .setBackground('#1a1a2e')
    .build();

  writeFileSync('./rank-card.png', card);
  console.log('✅ Rank card saved to rank-card.png');
}

main().catch(console.error);
