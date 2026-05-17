/**
 * Example: Creating a Leaderboard Card
 *
 * This example demonstrates how to create a ranked leaderboard
 * showing the top users in a Discord server.
 */

import { LeaderboardCardBuilder } from 'canvas-forge';

async function createLeaderboardCard(): Promise<Buffer> {
  const card = await new LeaderboardCardBuilder()
    .setTitle('🏆 XP Leaderboard')
    .setScoreLabel('XP')
    .addEntry({ rank: 1, username: 'Jersuxs', score: 25400 })
    .addEntry({ rank: 2, username: 'Alice', score: 19200 })
    .addEntry({ rank: 3, username: 'Bob', score: 15800 })
    .addEntry({ rank: 4, username: 'Charlie', score: 12100 })
    .addEntry({ rank: 5, username: 'Diana', score: 9500 })
    .setMaxEntries(5)
    .setAccentColor('#e94560')
    .build();

  return card;
}

createLeaderboardCard().then((buffer) => {
  console.log(`Leaderboard card generated! Size: ${buffer.length} bytes`);
});
