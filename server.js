const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = 3000;



const EXP2_JSON_PATH = String.raw`C:\Users\bhanu\Desktop\Library Management  System\Exp 2\user.json`;

const EXP3_DIR = __dirname;
const ALTER_JSON_PATH = path.join(EXP3_DIR, "alter.json");

app.use(express.json());
app.use(express.static(EXP3_DIR));

function checkExp2Path() {
    if (EXP2_JSON_PATH.includes("PASTE_YOUR_EXP2")) {
        throw new Error("Please paste the Exp-2 user.json path in server.js.");
    }
    if (!fs.existsSync(EXP2_JSON_PATH)) {
        throw new Error("Exp-2 user.json was not found at: " + EXP2_JSON_PATH);
    }
}

function readDatabase() {
    checkExp2Path();

    const raw = fs.readFileSync(EXP2_JSON_PATH, "utf8");
    const database = JSON.parse(raw);

    if (!database.users) {
        database.users = [];
    }

    return database;
}

function writeDatabase(database) {
    checkExp2Path();

    fs.writeFileSync(
        EXP2_JSON_PATH,
        JSON.stringify(database, null, 4),
        "utf8"
    );
}

function readAlterDatabase() {
    if (!fs.existsSync(ALTER_JSON_PATH)) {
        return { altered_records: [] };
    }

    try {
        const data = JSON.parse(
            fs.readFileSync(ALTER_JSON_PATH, "utf8")
        );

        if (!data.altered_records) {
            data.altered_records = [];
        }

        return data;
    } catch {
        return { altered_records: [] };
    }
}

function writeAlterDatabase(data) {
    fs.writeFileSync(
        ALTER_JSON_PATH,
        JSON.stringify(data, null, 4),
        "utf8"
    );
}

/*
=========================================================
GET ALL RECORDS
=========================================================
*/
app.get("/api/users", (req, res) => {
    try {
        const database = readDatabase();

        res.json({
            success: true,
            users: database.users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/*
=========================================================
ADD
Creates a new customer record in Exp-2 user.json.
=========================================================
*/
app.post("/api/users", (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        const age = Number(req.body.age);

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Customer name is required."
            });
        }

        if (!age || age < 1 || age > 120) {
            return res.status(400).json({
                success: false,
                message: "A valid age (1-120) is required."
            });
        }

        const database = readDatabase();

        const racks = req.body.racks !== undefined
            ? Number(req.body.racks) : 4;
        const rows = req.body.rows !== undefined
            ? Number(req.body.rows) : 3;

        // Every customer gets their own unique, sequential ID:
        // LIB + 2-digit year + 3-digit number  ->  LIB26001, LIB26002, ...
        // Numbering restarts at 001 each new year.
        const yearCode = String(new Date().getFullYear()).slice(-2);
        const prefix = "LIB" + yearCode;
        let highest = 0;

        database.users.forEach(item => {
            const match = new RegExp("^" + prefix + "(\\d+)$").exec(String(item.id));
            if (match) {
                highest = Math.max(highest, Number(match[1]));
            }
        });

        const newId = prefix + String(highest + 1).padStart(3, "0");

        const newUser = {
            id: newId,
            name: name,
            age: age,
            phone: req.body.phone !== undefined
                ? String(req.body.phone) : "",
            email: req.body.email !== undefined
                ? String(req.body.email) : "",
            cupboard: {
                width_cm: 120,
                height_cm: 200,
                depth_cm: 45,
                number_of_cupboards: 1,
                racks_per_cupboard: racks,
                rows_per_rack: rows,
                door_type: "Sliding"
            },
            recommended_racks: racks,
            approved: true,
            approved_at: new Date().toISOString()
        };

        database.users.push(newUser);

        writeDatabase(database);

        res.status(201).json({
            success: true,
            message: "Customer record added successfully to Exp-2 user.json.\nNew Customer ID: " + newUser.id,
            user: newUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/*
=========================================================
GET ONE RECORD
=========================================================
*/
app.get("/api/users/:id", (req, res) => {
    try {
        const database = readDatabase();

        const user = database.users.find(
            item => item.id === req.params.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Customer record not found."
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/*
=========================================================
UPDATE
Changes phone, email, racks and shelves/rows.
The changes are written directly to Exp-2 user.json.
=========================================================
*/
app.put("/api/users/:id", (req, res) => {
    try {
        const database = readDatabase();

        const index = database.users.findIndex(
            item => item.id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Customer record not found."
            });
        }

        const user = database.users[index];

        if (req.body.phone !== undefined) {
            user.phone = String(req.body.phone);
        }

        if (req.body.email !== undefined) {
            user.email = String(req.body.email);
        }

        if (!user.cupboard) {
            user.cupboard = {};
        }

        if (req.body.racks !== undefined) {
            user.cupboard.racks_per_cupboard =
                Number(req.body.racks);
        }

        if (req.body.rows !== undefined) {
            user.cupboard.rows_per_rack =
                Number(req.body.rows);
        }

        user.updated_at = new Date().toISOString();

        database.users[index] = user;

        writeDatabase(database);

        res.json({
            success: true,
            message: "Customer record updated successfully. Changes are reflected in Exp-2 user.json.",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/*
=========================================================
ALTER
Creates/updates a separate alter.json in Exp-3,
and also applies the altered values to Exp-2 user.json.
=========================================================
*/
app.post("/api/users/:id/alter", (req, res) => {
    try {
        const database = readDatabase();

        const index = database.users.findIndex(
            item => item.id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Customer record not found."
            });
        }

        const user = database.users[index];

        if (req.body.phone !== undefined) {
            user.phone = String(req.body.phone);
        }

        if (req.body.email !== undefined) {
            user.email = String(req.body.email);
        }

        if (!user.cupboard) {
            user.cupboard = {};
        }

        if (req.body.racks !== undefined) {
            user.cupboard.racks_per_cupboard =
                Number(req.body.racks);
        }

        if (req.body.rows !== undefined) {
            user.cupboard.rows_per_rack =
                Number(req.body.rows);
        }

        user.altered_at = new Date().toISOString();

        database.users[index] = user;
        writeDatabase(database);

        const alterDatabase = readAlterDatabase();

        const existingAlterIndex =
            alterDatabase.altered_records.findIndex(
                item => item.id === req.params.id
            );

        const alteredRecord = {
            id: user.id,
            name: user.name,
            phone: user.phone || "",
            email: user.email || "",
            racks_per_cupboard:
                user.cupboard.racks_per_cupboard,
            rows_per_rack:
                user.cupboard.rows_per_rack,
            altered_at: user.altered_at
        };

        if (existingAlterIndex === -1) {
            alterDatabase.altered_records.push(alteredRecord);
        } else {
            alterDatabase.altered_records[existingAlterIndex] =
                alteredRecord;
        }

        writeAlterDatabase(alterDatabase);

        res.json({
            success: true,
            message: "Customer details altered successfully. alter.json updated and Exp-2 user.json synchronized.",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/*
=========================================================
DELETE
Deletes the customer from Exp-2 user.json.
=========================================================
*/
app.delete("/api/users/:id", (req, res) => {
    try {
        const database = readDatabase();

        const index = database.users.findIndex(
            item => item.id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Customer record not found."
            });
        }

        const deletedUser = database.users.splice(index, 1)[0];

        writeDatabase(database);

        const alterDatabase = readAlterDatabase();

        alterDatabase.altered_records =
            alterDatabase.altered_records.filter(
                item => item.id !== req.params.id
            );

        writeAlterDatabase(alterDatabase);

        res.json({
            success: true,
            message: "Customer record deleted successfully from Exp-2 user.json.",
            deletedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/*
=========================================================
404
=========================================================
*/
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "404 Error: Page not found in this library world"
    });
});

/*
=========================================================
START SERVER
=========================================================
*/
app.listen(PORT, () => {
    console.log("");
    console.log("==========================================");
    console.log("   LIBRARY MANAGEMENT SYSTEM - EXP3");
    console.log("==========================================");
    console.log("Express.js server is running...");
    console.log(`Open: http://localhost:${PORT}`);
    console.log("Exp-2 and Exp-3 JSON files are linked.");
    console.log("==========================================");
    console.log("");
});