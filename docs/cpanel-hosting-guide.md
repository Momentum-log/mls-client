# Hosting Guide: Deploying to cPanel (Momentum Logistics Service)

This guide provides step-by-step instructions for deploying the **Momentum Logistics Service** to cPanel using the **Setup Node.js App** interface.

**Domain:** `momentumlogservices.com`

---

## Phase 1: Local Project Preparation

Before uploading, prepare the production build on your local machine.

1.  **Install Dependencies**: Ensure all packages are up to date.
    ```bash
    bun install
    ```
2.  **Production Build**: Generate the optimized production assets.
    ```bash
    bun run build
    ```
3.  **Selective Archiving**:
    - Navigate into your project root folder.
    - Select **all** files and folders (including the hidden `.next` folder).
    - **CRITICAL**: Do **NOT** include the `node_modules` folder.
    - Compress the selection into a single archive named `source.zip`.

---

## Phase 2: cPanel Environment Setup

Initialize the Node.js runtime on your server.

1.  **Access Setup**: Log in to cPanel -> **Software** -> **Setup Node.js App**.
2.  **Create Application**:
    - **Node.js Version**: Select **Version 20** (or latest recommended).
    - **Application Mode**: `Production`.
    - **Application Root**: `momentum-app` (or your preferred folder name).
    - **Application URL**: `momentumlogservices.com`.
    - **Application Startup File**: `app.js`.
3.  Click **Create**.

---

## Phase 3: File Deployment

1.  **Upload**: Open cPanel **File Manager** and go to the `Application Root` directory.
2.  **Extract**:
    - Upload `source.zip`.
    - Extract the contents directly into the application root.
    - Delete `source.zip` after extraction.

---

## Phase 4: Server Configuration (app.js)

Next.js requires a custom entry point for the cPanel environment.

1.  **Create/Edit app.js**: In your application root, find or create `app.js`.
2.  **Server Script**: Paste the code below. This script boots the Next.js server on the port assigned by cPanel.

```javascript
/*
  Custom app.js for Next.js on cPanel
  Usage: Set this as the Application Startup File
*/
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = false; // Forced production mode
const app = next({ dev });
const handle = app.getRequestHandler();

// cPanel uses the environment variable 'PORT'
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
```

3.  **Save Changes**.

---

## Phase 5: Final Initialization

1.  **Install Server-Side Dependencies**:
    - Go back to **Setup Node.js App**.
    - Click **Run bun install**. This installs dependencies directly on the server.
2.  **Restart Application**:
    - Click the **Restart** button (small circular arrow next to your app).
3.  **Verification**:
    - Open `https://momentumlogservices.com` in your browser.
    - Test that all routes and API calls are functioning correctly.

---

## Troubleshooting

- **Internal Server Error**: Check the `.htaccess` file in your application root. cPanel usually generates this automatically.
- **Environment Variables**: If your app uses `.env.local`, ensure you upload it or set the variables in the **Setup Node.js App** interface under **Environment variables**.
