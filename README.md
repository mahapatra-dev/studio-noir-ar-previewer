# Studio Noir AR Previewer

Full-stack Web AR furniture/product previewer — React + Three.js + WebXR (frontend) and Node.js + Express + MongoDB (backend).

## Features
**User:** registration/login, product catalog browse, 3D viewer, AR "View in Your Space", search & filters, wishlist, compare, reviews & ratings, QR code for mobile AR.
**Admin:** admin login, product CRUD, 3D model (.glb/.gltf) upload, image upload, category management, user management, analytics dashboard with charts.

---

## 1. Prerequisites (install once)

- **Node.js** (v18+) — https://nodejs.org
- **MongoDB** — either:
  - Install MongoDB Community Server locally (https://www.mongodb.com/try/download/community) and make sure it's running (`mongod`), OR
  - Use a free cloud database at https://www.mongodb.com/cloud/atlas and copy its connection string.
- **VS Code** with the extensions: *ESLint*, *ES7+ React snippets* (optional but helpful).

---

## 2. Open the project in VS Code

1. Unzip this project.
2. In VS Code: `File > Open Folder` → select the `webar-previewer` folder.
3. Open a terminal in VS Code: `Terminal > New Terminal` (you'll open two terminals — one for backend, one for frontend).

---

## 3. Backend setup (Terminal 1)

```bash
cd backend
npm install
copy .env.example .env      # Windows
# cp .env.example .env      # Mac/Linux
```

Open `.env` and set:
```
MONGO_URI=mongodb://127.0.0.1:27017/webar-previewer
JWT_SECRET=any_random_secret_string
PORT=5000
CLIENT_URL=http://localhost:5173
```
(If using Atlas, replace `MONGO_URI` with your Atlas connection string.)

Seed the database with an admin account + sample products:
```bash
npm run seed
```
This creates:
- Admin login: `admin@studionoir.com` / `admin123`
- Test user: `user@studionoir.com` / `user1234`

Start the backend:
```bash
npm run dev
```
You should see `MongoDB connected` and `Server running on port 5000`.

---

## 4. Frontend setup (Terminal 2 — new terminal, keep backend running)

```bash
cd frontend
npm install
npm run dev
```

Vite will print a local URL, usually:
```
http://localhost:5173
```
Open that in your browser.

---

## 5. Using the app

- Browse products on the homepage, use search/filters.
- Click a product to see the 3D viewer (drag to rotate/zoom).
- Login as admin to go to `/admin`, add products, upload `.glb`/`.gltf` 3D models and images.
- On a product page, click **"View in AR on Mobile (QR)"** to get a QR code — scan it with your phone (phone must be on the **same WiFi network** as your laptop; see step 6 for the AR button to actually work on the phone).
- Register a normal user account to test wishlist, compare, and reviews.

---

## 6. Testing real AR on your phone (optional, WebXR requires HTTPS)

WebXR's AR button only works on Android Chrome (ARCore-supported phones) and requires either `localhost` or HTTPS. To test on your phone over your local network:

1. Find your laptop's local IP (e.g. `192.168.1.5`) via `ipconfig` (Windows) or `ifconfig` (Mac/Linux).
2. Frontend `vite.config.js` already has `host: true` so it's reachable on your network — visit `http://<your-ip>:5173` from your phone browser.
3. For the AR button itself to activate (not just page load), you'll need HTTPS. Easiest option: use a tunneling tool like `ngrok` (`ngrok http 5173`) which gives you a temporary HTTPS URL, then update `CLIENT_URL` in backend `.env` and the API base URL in `frontend/src/api/axios.js` accordingly for that session.
4. Without HTTPS, you can still preview everything (3D viewer, catalog, wishlist etc.) on desktop and phone browsers normally — only the live AR camera overlay needs the HTTPS/localhost requirement.

---

## 7. Project structure

```
webar-previewer/
├── backend/
│   ├── models/       (User, Product, Category, Review)
│   ├── routes/       (auth, products, categories, reviews, wishlist, admin)
│   ├── middleware/   (auth/JWT, file upload)
│   ├── uploads/       (uploaded 3D models & images served statically)
│   ├── seed.js
│   └── server.js
└── frontend/
    └── src/
        ├── pages/       (Home, ProductDetail, Login, Register, Wishlist, Compare, Admin*)
        ├── components/  (Navbar, ProductCard, ThreeViewer, QRCodeModal, ReviewList, SearchFilter)
        ├── context/     (AuthContext — JWT-based login state)
        └── api/         (axios instance)
```

## 8. Next steps / ideas to extend for your college submission

- Add pagination to the product catalog.
- Add password reset / email verification.
- Add category images and a landing banner (matches your black/gold Pitta Vision aesthetic).
- Add per-user "recently viewed" products.
- Deploy: frontend to Vercel/Netlify, backend to Render/Railway, DB to MongoDB Atlas — gives you a real HTTPS URL so AR works properly on any phone.
