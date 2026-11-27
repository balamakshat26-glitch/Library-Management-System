# Library Management System - Experiment 3

## Requirements
- Node.js installed
- Experiment 2 folder must remain in its original location.
- Exp-2 `user.json` must be writable.

## Step 1: Link Exp-2
Open `server.js`.

Find:
```js
const EXP2_JSON_PATH = String.raw`PASTE_YOUR_EXP2_USER_JSON_PATH_HERE`;
```

Replace it with the path copied using Windows **Copy as path** for the Exp-2 `user.json`.

Example:
```js
const EXP2_JSON_PATH = String.raw`C:\Users\bhanu\Desktop\Library Management System\Exp 2\user.json`;
```

## Step 2: Install Express
Open terminal inside this Exp-3 folder:

```bash
npm install
```

## Step 3: Start Exp-3
```bash
node server.js
```

Open:
http://localhost:3000

## Step 4: Test
1. Click VIEW RECORDS.
2. Copy an existing `id`.
3. Paste it into Customer ID.
4. Enter phone/email/racks/rows.
5. Click UPDATE.
6. Open the Exp-2 `user.json` file and verify the values changed.
7. For ALTER, click ALTER. This updates Exp-2 and also stores the altered record in Exp-3 `alter.json`.
8. For DELETE, enter an ID and click DELETE. Verify that the record disappears from Exp-2 `user.json`.

## Important
Do not run Flask `app.py` for Exp-3. Exp-3 uses Express.js on port 3000.
