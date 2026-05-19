# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-05-19

### Added

- **ModerationCardBuilder** — Create moderation action cards (ban, kick, mute, warn, unban, unmute) with customizable action accent themes and case numbers
- **ServerStatsCardBuilder** — Create grid-based server statistic cards showing total members, online members, boost counts, and tiers with status progress bars
- **CanvasBuilder Advanced Features**:
  - `drawTextWithEmojis()` — Inline support for Discord custom emojis (`<:name:id>`) with automatic CDN downloading and vertical alignment centering
  - `pixelate()` — Custom pixelation effect for specific rectangular regions (e.g. obscuring avatars or details)
  - `setFilter()` / `clearFilter()` / `applyBlur()` / `applyGrayscale()` / `applySepia()` / `applyInvert()` — Native CSS-like image filters
  - Support for `radial` gradients in background fills and rectangle drawing
- **In-memory Image Cache** in `ImageLoader` to cache network and filesystem images, preventing redundant reads and HTTP requests
- `clearImageCache()` utility function to clear the memory cache
- Type definitions: `ModerationCardConfig`, `ModerationAction`, `ServerStatsCardConfig`
- Default dimensions for Moderation and Server Stats cards
- Additional unit tests covering new features (reaching 226 total tests)
- Documentation and examples for all 1.2.0 features

## [1.1.0] - 2026-05-17

### Added

- **BoostCardBuilder** — Create server boost notification cards with Nitro-themed gradients
- **InfoCardBuilder** — Create general-purpose info cards (embed-style) with title, description, fields, and footer
- **LeaderboardCardBuilder** — Create ranked leaderboard cards showing top users with medals, avatars, and scores
- **SpotifyCardBuilder** — Create "Now Playing" music cards with album art, progress bar, and timestamps
- **CanvasBuilder** new drawing methods:
  - `drawLine()` — Draw straight lines with color and width
  - `drawPolygon()` — Draw custom polygon shapes with optional stroke
  - `drawGradientRect()` — Draw rectangles filled with gradients (with optional rounded corners)
  - `drawBorderedRect()` — Draw rectangles with colored borders (stroke only)
  - `drawArc()` — Draw arcs and partial circles
  - `drawShadow()` / `clearShadow()` — Enable/disable shadow for drawing operations
  - `setGlobalAlpha()` / `resetGlobalAlpha()` — Control transparency
  - `save()` / `restore()` — Canvas state management
- New type definitions: `BoostCardConfig`, `InfoCardConfig`, `InfoFieldData`, `LeaderboardCardConfig`, `LeaderboardEntry`, `SpotifyCardConfig`
- New default dimensions for Boost, Info, Leaderboard, and Spotify cards
- Comprehensive tests for all new builders and methods (213 total tests)
- Documentation and examples for all new features

## [1.0.0] - 2026-05-17

### Added

- Initial release of `canvas-forge`
- **WelcomeCardBuilder** — Create beautiful welcome cards for Discord servers
- **LeaveCardBuilder** — Create goodbye/leave cards for Discord servers
- **RankCardBuilder** — Create XP/rank cards with progress bars
- **LevelUpCardBuilder** — Create level-up notification cards
- **ProfileCardBuilder** — Create detailed user profile cards
- **CanvasBuilder** — Freeform canvas for custom designs
- **ImageLoader** — Load images from URL, file path, or Buffer with caching
- Full TypeScript support with comprehensive type definitions
- Dual ESM/CJS module output
- Utility functions for colors, text, shapes, and validation
- Comprehensive test suite with 170+ tests
- Full documentation with examples
