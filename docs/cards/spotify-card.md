# Spotify / Now Playing Card

The `SpotifyCardBuilder` creates music "Now Playing" cards with album art, song details, playback progress bar, and timestamps. Works for Spotify, YouTube Music, or any music source.

## Basic Usage

```typescript
import { SpotifyCardBuilder } from 'canvas-forge';

const card = await new SpotifyCardBuilder()
  .setSongTitle('Blinding Lights')
  .setArtist('The Weeknd')
  .setAlbum('After Hours')
  .setAlbumArt('https://example.com/album-cover.jpg')
  .setElapsed(90000)   // 1:30 (in milliseconds)
  .setDuration(200000) // 3:20 (in milliseconds)
  .setIsPlaying(true)
  .build();
```

## Configuration

| Method | Description | Default |
|---|---|---|
| `setSongTitle(text)` | Song / track title | `'Unknown Track'` |
| `setArtist(text)` | Artist name(s) | `'Unknown Artist'` |
| `setAlbum(text)` | Album name | `''` |
| `setAlbumArt(source)` | Album cover image (URL, path, or Buffer) | `null` |
| `setAlbumArtSize(size)` | Album art size in pixels | `160` |
| `setElapsed(ms)` | Elapsed time in milliseconds | `0` |
| `setDuration(ms)` | Total duration in milliseconds | `200000` |
| `setIsPlaying(boolean)` | Whether the track is currently playing | `true` |
| `setTitleColor(color)` | Song title color | `#ffffff` |
| `setArtistColor(color)` | Artist text color | `#b3b3b3` |
| `setAlbumColor(color)` | Album text color | `#808080` |
| `setProgressBarColor(color)` | Progress bar fill color | `#1DB954` |
| `setProgressBarTrackColor(color)` | Progress bar track color | `#404040` |
| `setTimestampColor(color)` | Timestamp text color | `#b3b3b3` |
| `setAccentColor(color)` | Accent color | `#1DB954` |
| `setTheme(theme)` | Color theme (`'dark'`, `'light'`, `'custom'`) | `'dark'` |

## Discord.js Example with Spotify Activity

```typescript
const activities = member.presence?.activities;
const spotify = activities?.find(a => a.name === 'Spotify');

if (spotify) {
  const card = await new SpotifyCardBuilder()
    .setSongTitle(spotify.details ?? 'Unknown')
    .setArtist(spotify.state ?? 'Unknown')
    .setAlbumArt(spotify.assets?.largeImageURL() ?? '')
    .setElapsed(Date.now() - (spotify.timestamps?.start?.getTime() ?? 0))
    .setDuration((spotify.timestamps?.end?.getTime() ?? 0) - (spotify.timestamps?.start?.getTime() ?? 0))
    .build();

  const attachment = new AttachmentBuilder(card, { name: 'spotify.png' });
  channel.send({ files: [attachment] });
}
```
