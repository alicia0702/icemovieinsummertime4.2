import { DriveFile } from '../types';

export const DEMO_DRIVE_FOLDER: DriveFile = {
  id: 'folder_icemovie_root',
  name: 'IceMovieInSUmmerTime',
  mimeType: 'application/vnd.google-apps.folder',
  modifiedTime: new Date().toISOString(),
  webViewLink: 'https://drive.google.com',
};

export const DEMO_FILES: DriveFile[] = [
  {
    id: 'file_index_html',
    name: 'index.html',
    mimeType: 'text/html',
    size: '14280',
    modifiedTime: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    content: `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IceMovieInSUmmerTime - Cinema de Vară</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #38bdf8; padding-bottom: 15px; margin-bottom: 20px; }
    h1 { color: #38bdf8; margin: 0; font-size: 28px; }
    .hero { background: linear-gradient(135deg, #1e293b, #0f172a); padding: 30px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 30px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
    .card { background: #1e293b; border-radius: 10px; padding: 15px; border: 1px solid #334155; transition: transform 0.2s; }
    .card:hover { transform: translateY(-4px); border-color: #38bdf8; }
    .tag { background: #0284c7; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .btn { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 10px; width: 100%; }
    .btn:hover { background: #0369a1; }
  </style>
</head>
<body>
  <header>
    <h1>🍧 IceMovieInSUmmerTime</h1>
    <span>Cinema de Vară & Plajă 2026</span>
  </header>
  <main>
    <div class="hero">
      <h2>Bine ai venit la IceMovieInSUmmerTime!</h2>
      <p>Bucură-te de cele mai răcoroase filme ale verii pe plajă. Streaming direct și colecții speciale de vacanță!</p>
    </div>
    <h2>Filme Recente</h2>
    <div class="grid">
      <div class="card">
        <span class="tag">Aventura de Vara</span>
        <h3>Summer Wave Odyssey</h3>
        <p>Un film spectaculos despre aventurile pe surfboard pe insulele tropicale.</p>
        <button class="btn">Vizionează Acum</button>
      </div>
      <div class="card">
        <span class="tag">Comedie Răcoroasă</span>
        <h3>Ice Cream Party 2</h3>
        <p>Distracție garantată cu prietenii în cea mai fierbinte zi din iulie.</p>
        <button class="btn">Vizionează Acum</button>
      </div>
      <div class="card">
        <span class="tag">Documentar</span>
        <h3>Glaciers in July</h3>
        <p>Expediție arctică uimitoare prin peisajele înghețate din nord.</p>
        <button class="btn">Vizionează Acum</button>
      </div>
    </div>
  </main>
</body>
</html>`,
  },
  {
    id: 'file_styles_css',
    name: 'styles.css',
    mimeType: 'text/css',
    size: '3420',
    modifiedTime: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    content: `/* IceMovieInSUmmerTime Main Stylesheet */
:root {
  --primary-ice: #38bdf8;
  --secondary-summer: #f59e0b;
  --bg-dark: #0f172a;
  --card-bg: #1e293b;
}

body {
  background-color: var(--bg-dark);
  color: #f8fafc;
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
}

.movie-card {
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);
  border-radius: 12px;
  overflow: hidden;
}
`,
  },
  {
    id: 'file_movie_1',
    name: 'Summer_Wave_Odyssey.mp4',
    mimeType: 'video/mp4',
    size: '858993459', // ~820MB
    modifiedTime: new Date(Date.now() - 3600000 * 12).toISOString(),
    isMovie: true,
    movieGenre: 'Aventură / Acțiune',
    movieDuration: '1h 48m',
    movieRating: '4.9 ★',
    thumbnailLink: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'file_movie_2',
    name: 'Ice_Cream_Party_2.mp4',
    mimeType: 'video/mp4',
    size: '1288490188', // ~1.2GB
    modifiedTime: new Date(Date.now() - 3600000 * 36).toISOString(),
    isMovie: true,
    movieGenre: 'Comedie de Vară',
    movieDuration: '1h 32m',
    movieRating: '4.7 ★',
    thumbnailLink: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'file_movie_3',
    name: 'Glaciers_In_July.mp4',
    mimeType: 'video/mp4',
    size: '1825361100', // ~1.7GB
    modifiedTime: new Date(Date.now() - 3600000 * 48).toISOString(),
    isMovie: true,
    movieGenre: 'Documentar Răcoros',
    movieDuration: '2h 05m',
    movieRating: '4.9 ★',
    thumbnailLink: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'file_config_json',
    name: 'movies_catalog.json',
    mimeType: 'application/json',
    size: '2150',
    modifiedTime: new Date(Date.now() - 3600000 * 5).toISOString(),
    content: `{
  "website": "IceMovieInSUmmerTime",
  "version": "1.0.0",
  "season": "Summer 2026",
  "theme": "Ice & Cyan Refresh",
  "catalog": [
    { "id": 1, "title": "Summer Wave Odyssey", "category": "Action", "resolution": "1080p" },
    { "id": 2, "title": "Ice Cream Party 2", "category": "Comedy", "resolution": "4K Ultra HD" },
    { "id": 3, "title": "Glaciers in July", "category": "Documentary", "resolution": "1080p" }
  ]
}`,
  },
];
