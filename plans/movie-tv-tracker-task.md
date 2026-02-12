# PRD: Movie & TV Show Tracker

## Problem Statement

Users want a simple, personal way to track their movie and TV show watching habits without the complexity of social features or account management. Existing trackers are often cluttered, data-heavy, or gamified in ways that feel judgmental about viewing habits. Users need a calm, cozy companion app that helps them remember what they've watched, what they're currently enjoying, and what they plan to watch next.

## Solution

A local-first web application that integrates with TMDB (The Movie Database) API to provide rich metadata while storing user data locally in the browser. The app features a dark, cozy UI optimized for evening use, with three main status categories: Watchlist, Currently Watching, and Watched. It includes granular episode tracking for TV shows, personal ratings and reviews, comprehensive viewing statistics, and smart recommendations based on TMDB tags.

## User Stories

1. As a viewer, I want to search for movies and TV shows by title, so that I can quickly find content to add to my lists
2. As a viewer, I want to see movie posters, descriptions, and metadata when searching, so that I can identify the correct title
3. As a viewer, I want to add a movie to my Watchlist, so that I remember to watch it later
4. As a viewer, I want to add a TV show to my Watchlist, so that I can plan what series to start next
5. As a viewer, I want to move a movie from Watchlist to Currently Watching, so that I can track what I'm actively viewing
6. As a viewer, I want to move a TV show from Watchlist to Currently Watching, so that I can track the series I've started
7. As a viewer, I want to mark a movie as Watched, so that I have a record of what I've completed
8. As a viewer, I want to mark a TV show as Watched when I finish all seasons, so that I can see my completed series
9. As a viewer, I want to see a list of all episodes for a TV show organized by season, so that I can track my progress
10. As a viewer, I want to check off individual episodes as I watch them, so that I know exactly where I left off
11. As a viewer, I want to see my episode progress as a visual indicator, so that I can quickly gauge how far I am in a series
12. As a viewer, I want to rate movies and TV shows on a personal scale, so that I can remember how much I enjoyed them
13. As a viewer, I want to write personal notes/reviews for content I've watched, so that I can remember my thoughts
14. As a viewer, I want to see my total watch time across all content, so that I understand my viewing habits
15. As a viewer, I want to see a genre breakdown of what I've watched, so that I can understand my preferences
16. As a viewer, I want to see my monthly watching activity, so that I can see patterns over time
17. As a viewer, I want to receive recommendations based on what I've watched, so that I can discover new content
18. As a viewer, I want recommendations ranked by how closely they match my watched content's tags, so that suggestions feel relevant
19. As a viewer, I want to filter my lists by genre, year, or rating, so that I can find specific content quickly
20. As a viewer, I want to sort my lists by date added, title, or rating, so that I can organize my content
21. As a viewer, I want my data to persist in my browser, so that I don't lose my lists when I close the app
22. As a viewer, I want the app to work well on mobile browsers, so that I can use it on my phone on the couch
23. As a viewer, I want a dark theme optimized for evening use, so that the app is comfortable in low light
24. As a viewer, I want smooth, subtle animations, so that the app feels polished without being distracting
25. As a viewer, I want to remove items from any list, so that I can clean up mistakes or content I'm no longer interested in
26. As a viewer, I want to see when I added something to my Watchlist, so that I can prioritize older entries
27. As a viewer, I want to see when I marked something as Watched, so that I have a viewing history timeline
28. As a viewer, I want to quickly move items between status categories, so that managing my lists is effortless

## Implementation Decisions

### Architecture
- **Local-first storage**: Use IndexedDB (via a library like Dexie.js or idb) for persistent local storage. Design schema with future cloud sync in mind.
- **TMDB API integration**: All movie/TV metadata, images, and recommendations sourced from TMDB API. Requires free API key.
- **React Router**: Leverage existing project setup with React Router for navigation between views.

### Data Model
- **MediaItem**: Core entity storing TMDB ID, type (movie/tv), status (watchlist/watching/watched), user rating, review text, date added, date completed
- **EpisodeProgress**: For TV shows, track watched status per episode (season number, episode number, watched boolean, watched date)
- **UserStats**: Computed/cached statistics derived from MediaItem and EpisodeProgress data

### Key Modules

1. **TMDB Service Module**
   - Search movies and TV shows
   - Fetch detailed metadata (cast, genres, keywords/tags, runtime)
   - Fetch episode lists for TV shows
   - Fetch recommendations and similar titles
   - Handle API rate limiting and errors gracefully

2. **Storage Module**
   - CRUD operations for MediaItems
   - Episode progress tracking
   - Data export/import (JSON) for backup
   - Schema migrations for future updates
   - Designed as abstraction layer to swap in cloud sync later

3. **Recommendations Engine Module**
   - Extract tags (genres + keywords) from watched content
   - Query TMDB for similar content
   - Score and rank by tag overlap
   - Filter out already-watched/listed content

4. **Statistics Module**
   - Calculate total watch time (using TMDB runtime data)
   - Aggregate genre breakdown
   - Generate monthly/weekly activity data
   - Cache computed stats for performance

5. **UI Component Library**
   - Media cards (poster, title, status indicator)
   - Episode checklist component
   - Rating input (stars or slider)
   - Stats visualizations (pie charts, bar graphs, calendars)
   - Status tabs navigation
   - Search with autocomplete

### UI/UX Decisions
- **Dark-first design**: Charcoal/deep navy base with warm accent color
- **Soft, rounded components**: Border radius on all cards and buttons
- **Generous spacing**: Comfortable padding, minimal visual noise
- **Subtle animations**: Framer Motion or CSS transitions for state changes
- **Cozy, companion feel**: Friendly copy, no gamification or pressure
- **Responsive**: Mobile-first design that works on all screen sizes

### Tech Stack
- **Runtime**: Bun
- **Framework**: React with React Router
- **Styling**: Tailwind CSS (or CSS-in-JS with dark theme tokens)
- **Local Storage**: Dexie.js (IndexedDB wrapper)
- **Charts**: Recharts or Chart.js for statistics
- **Animations**: Framer Motion (optional)

## Testing Decisions

### Testing Philosophy
- Test external behavior, not implementation details
- Focus on user flows and data integrity
- Mock TMDB API responses for consistent tests

### Modules to Test
1. **Storage Module**: Test CRUD operations, data persistence, schema migrations
2. **Recommendations Engine**: Test tag extraction, ranking algorithm, filtering logic
3. **Statistics Module**: Test calculations for accuracy with various data sets
4. **TMDB Service**: Test response parsing, error handling (use mocked responses)

### Test Types
- Unit tests for utility functions and calculations
- Integration tests for storage operations
- Component tests for key UI interactions (status changes, episode tracking)

## Out of Scope (v1)

- User authentication and accounts
- Cloud persistence/sync
- Social features (sharing, following, friend activity)
- Offline/PWA functionality
- Push notifications or reminders
- Integration with streaming services (watch links)
- Multiple user profiles
- Import from other tracking services (Trakt, Letterboxd)
- Advanced search filters (by actor, director, year range)
- Custom lists beyond the three status categories
- Watch party features
- Content calendar for upcoming releases

## Further Notes

### Future Considerations
The local-first architecture is intentionally designed to support future enhancements:
- **Auth & Persistence**: Storage module abstraction allows swapping local for cloud backend
- **Social Features**: Data model can extend to support sharing and community features
- **Export/Import**: Include from day one for data portability

### TMDB API Notes
- Free API key required (register at themoviedb.org)
- Rate limit: 40 requests per 10 seconds
- Includes genres, keywords, recommendations, and similar titles
- Episode data available via TV endpoints

### Design Inspiration
The app should feel like a cozy reading nook, not a productivity tool. Think: warm lighting, comfortable furniture, no rush. The UI acknowledges binge-watching culture without judgment - it's a companion for the viewing journey, not a tracker with streaks and achievements.

---

## Implementation Approach

Once this PRD is approved, implementation will follow the tracer bullet approach:

1. **Tracer Bullet**: Basic search + add to watchlist + view list (end-to-end slice)
2. **Core Lists**: Three status tabs with move between states
3. **Episode Tracking**: TV show detail view with episode checkboxes
4. **Ratings & Reviews**: Add personal ratings and notes
5. **Statistics**: Watch time, genre breakdown, activity views
6. **Recommendations**: Tag-based suggestion engine
7. **Polish**: Animations, responsive refinements, edge cases
