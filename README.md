# HiAnime API - Next.js Optimized Version

This is a Next.js implementation of the HiAnime API, optimized for deployment on Azion using the **Next.js Preset**.

## Key Features
- **Next.js App Router**: Uses modern Route Handlers for high performance.
- **Azion-Ready**: Compatible with the Azion Next.js preset for one-click deployment.
- **Pre-configured CORS**: Optimized for `hianimez.xyz` and local development.
- **Unified Logic**: Shares the same core extraction logic as the original API but with better routing.

## Deployment to Azion

1.  **Push to GitHub**: Push the contents of this `next-api` directory to your GitHub repository.
2.  **Azion Console**: Select **"Import from GitHub"**.
3.  **Preset**: Choose **Next.js** (it should now auto-detect or be easily selectable).
4.  **Application Name**: `hianime-api-next`
5.  **Deploy**: Azion will handle the build and deployment automatically.

## API Endpoints

- `GET /api/info?id=[slug]` - Get anime details.
- `GET /api/stream?id=[epId]&server=[name]&type=[sub/dub]` - Get streaming links.
- `GET /api/episodes/[id]` - Get episode list.
- `GET /api/servers/[id]` - Get available servers.
- `GET /api/search?keyword=[query]` - Search for anime.
- `GET /api/[category]` - Get category info (e.g., `top-airing`).

## Development

```bash
npm install
npm run dev
```
Open [http://localhost:3000/api](http://localhost:3000/api) to see the result.
