### Final Project

Roles:
Shayan: Database Engineer, in charge of keeping track of commits and no intereference - Team Lead
Souleymane: Backend Deveeloper, making sure all functionality is working and everything is working - Backend
Ridone: Frontend Developer, making it visually proactive and css looking pretty and useable - Frontend
Raheen: Frontend Developer, making it visually proactive and css looking pretty and useable - Frontend
Angela: Frontend Developer, making it visually proactive and css looking pretty and useable - Frontend

## Client — Local setup & run

**Prerequisites:**

- **Node.js:** install Node.js (LTS recommended, e.g. v16+ or v18+).
- **Package manager:** `npm` (bundled with Node) or `yarn`/`pnpm`.

**Quick start (development):**

1. Open a terminal and change to the client folder:

```
cd src/client
```

2. Install dependencies:

```
npm install
```

3. Run the dev server:

```
npm run dev
```

4. Open the app in your browser at `http://localhost:5173` (Vite's default port).

**Build & preview (production):**

```
cd src/client
npm run build
npm run preview
```

`npm run preview` serves the production build locally so you can verify the output.

**Linting:**

```
cd src/client
npm run lint
```

**Notes:**

- The client is a Vite + React app. Scripts available in [src/client/package.json](src/client/package.json).
- Vite's default port is `5173`; change it in `vite.config.js` or by setting the `PORT` environment variable if needed.
- If you use `yarn` or `pnpm`, replace `npm install` and `npm run ...` with the equivalent commands.
