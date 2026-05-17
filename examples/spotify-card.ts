/**
 * Example: Creating a Spotify / Now Playing Card
 *
 * This example demonstrates how to create a music "now playing" card
 * with album art, song details, and a progress bar.
 */

import { SpotifyCardBuilder } from 'canvas-forge';

async function createSpotifyCard(): Promise<Buffer> {
  const card = await new SpotifyCardBuilder()
    .setSongTitle('Blinding Lights')
    .setArtist('The Weeknd')
    .setAlbum('After Hours')
    .setAlbumArt('https://example.com/album-cover.jpg')
    .setElapsed(90000)   // 1:30
    .setDuration(200000) // 3:20
    .setIsPlaying(true)
    .setProgressBarColor('#1DB954')
    .setAccentColor('#1DB954')
    .build();

  return card;
}

createSpotifyCard().then((buffer) => {
  console.log(`Spotify card generated! Size: ${buffer.length} bytes`);
});
