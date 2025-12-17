# Vue expander template

## Creating a new campaign
1. Create a new repository using the template.
<img width="1234" height="126" alt="Screenshot 2025-08-08 at 13 53 50" src="https://github.com/user-attachments/assets/43ffe048-9ee7-43dc-9315-a8f73567fbc3" />

2. Select the correct owner (ShowHeroes-Expanders) and fill out the name of the repository
<img width="778" height="727" alt="Screenshot 2025-08-08 at 13 54 19" src="https://github.com/user-attachments/assets/1019002d-ea7a-41e5-b270-3d7aa4cd82f3" />

3. Clone the new repository to your local machine
```
git clone https://github.com/ShowHeroes-Expanders/[new-repo].git
```
4. Go inside the folder
```
cd [new-repo]
```
5. Install the dependencies.
```
npm install
```
6. Run the local development server
```
npm run dev
```
Or use the legacy command:
```
npm run serve
```
7. Build the production version
```
npm run build
```
8. Preview the production build locally (optional)
```
npm run preview
```
9. Compress the content of the `dist` folder and upload to the Create platform.
10. Commit and push all the changes and assets
```
git add -A
git commit -m "Some comment"
git push
```

## Technology Stack

This template uses:
- **Vue 3** (v3.5.25) - Latest stable version
- **Vite** (v6.0.11) - Modern, fast build tool
- **Sass** - CSS preprocessor
- **ESLint 9** - Code linting with flat config

## Development Notes

- The dev server runs on `http://localhost:5173` by default
- Hot Module Replacement (HMR) is enabled for instant updates
- Build outputs are optimized and production-ready
