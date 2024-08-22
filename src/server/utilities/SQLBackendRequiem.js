const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 1234;

const lastUpdated = {};

const createDatabaseTables = () => {
    db.run(`CREATE TABLE IF NOT EXISTS Treasury (
        treasuryID INTEGER PRIMARY KEY,
        type INTEGER,
        name TEXT,
        ownerID INTEGER,
        accessTBL TEXT,
        marcs INTEGER DEFAULT 0,
        container TEXT,
        audit TEXT,
        incomeSources TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS IncomeSources (
        UniqueID INTEGER PRIMARY  Key,
        type INTEGER,
        TreasuryID INTEGER,
        level INTEGER,
        timeCreated DATE,
        timeLastClaimed INTEGER,
        FOREIGN KEY(TreasuryID) REFERENCES Treasury(treasuryID)
    )`);
}

db.serialize(() => {
    createDatabaseTables();
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log('Database connection closed');
        process.exit(0);
    });
});

app.use(bodyParser.json());

function authorize(req, res, next) {
    const apiKey = req.headers['authorization'];
    if (!apiKey || apiKey !== "mjgjvftuqhendjsboe") {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
}

function canUpdateTreasury(treasuryID) {
    const now = Date.now();
    if (lastUpdated[treasuryID] && now - lastUpdated[treasuryID] < 2000) {
        return false;
    }
    lastUpdated[treasuryID] = now;
    return true;
}

function updateAuditLog(treasuryID, playerID, actionID, detail, reason = null) {
    const logEntry = { playerID, actionID, detail, timestamp: new Date().toISOString(), reason: reason || ''};
    db.get(`SELECT audit FROM Treasury WHERE treasuryID = ?`, [treasuryID], (err, row) => {
        if (err) {
            console.error('Error fetching audit log:', err.message);
            return;
        }
        let currentAudit = row.audit ? JSON.parse(row.audit) : [];
        currentAudit.push(logEntry);
        const updatedAudit = JSON.stringify(currentAudit);
        db.run(`UPDATE Treasury SET audit = ? WHERE treasuryID = ?`, [updatedAudit, treasuryID], (err) => {
            if (err) {
                console.error('Error updating audit log:', err.message);
            }
        });
    });
}

// Create an endpoint to reset all tables and the database
// This is for testing purposes only
app.post('/reset', (req, res) => {
    db.serialize(() => {
        db.run('DROP TABLE IF EXISTS Treasury');
        db.run('DROP TABLE IF EXISTS IncomeSources');
        createDatabaseTables();
    });
    res.json({ message: 'Database reset successfully' });
})

app.get('/get-treasuries/names', (req, res) => {
    // Provide a list of treasuries by name
    // and will return the treasuryID, name, marcs, and ownerID
    const names = req.query.names;
    if (!names) {
        return res.status(400).send('Names are required');
    }

    const query = 'SELECT treasuryID, name, marcs, ownerID FROM Treasury WHERE name IN (?)';
    db.all(query, [names], (err, rows) => {
        if (err) {
            console.error('Error querying the database', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/get-treasuries/name', (req, res) => {
    // Get all the treasuries with a matching name.
    const name = req.query.name;
    if (!name) {
        return res.status(400).send('Name is required');
    }
    
    const query = 'SELECT treasuryID, name, marcs, ownerID FROM Treasury WHERE name = ?';
    db.all(query, [name], (err, rows) => {
        if (err) {
            console.error('Error querying the database', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/treasuries', (req, res) => {
    const ownerID = req.query.ownerID;
    const hasAccess = req.query.hasAccess;

    if (!ownerID) {
        return res.status(400).send('Owner ID is required');
    }

    if (hasAccess === "true") {
        // We need to query all treasuries where the accessTBL (a json string) contains the playerID
        // Also need to query all treasuries where the ownerID is the playerID
        const query = 'SELECT treasuryID, name, marcs, ownerID FROM Treasury WHERE ownerID = ? OR accessTBL LIKE ?';
        db.all(query, [ownerID, `%${ownerID}%`], (err, rows) => {
            if (err) {
                console.error('Error querying the database', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });

        return;
    }

    const query = 'SELECT treasuryID, name, marcs, ownerID FROM Treasury WHERE ownerID = ?';
    db.all(query, [ownerID], (err, rows) => {
        if (err) {
            console.error('Error querying the database', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.put('/update-treasury/update-owner', (req, res) => {
    const { treasuryID, newOwnerID, playerID } = req.body;
    if (!canUpdateTreasury(treasuryID)) {
        return res.status(429).send('Updating too frequently. Please wait.');
    }
    db.run(`UPDATE Treasury SET ownerID = ? WHERE treasuryID = ?`, [newOwnerID, treasuryID], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        updateAuditLog(treasuryID, playerID, 7, newOwnerID);
        res.json({ message: 'Owner updated successfully' });
    });
});


app.post('/update-treasury/add-item', (req, res) => {
    const { treasuryID, playerID, itemID, itemUID, metadata } = req.body;
    if (!canUpdateTreasury(treasuryID)) {
        return res.status(429).send('Updating too frequently. Please wait.');
    }

    db.get(`SELECT container FROM Treasury WHERE treasuryID = ?`, [treasuryID], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        let container = row.container ? JSON.parse(row.container) : { maxWeight: 100, location: 1, itemUID: [] };

        container.itemUID.push({ uid: itemUID, type: itemID, metadata: metadata });
        const updatedContainer = JSON.stringify(container);

        db.run(`UPDATE Treasury SET container = ? WHERE treasuryID = ?`, [updatedContainer, treasuryID], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            updateAuditLog(treasuryID, playerID, 4, itemUID);
            res.json({ message: 'Item added successfully', itemDetails: { itemUID, itemID, metadata } });
        });
    });
});

app.post('/update-treasury/remove-item', (req, res) => {
    const { treasuryID, playerID, itemUID } = req.body;
    if (!canUpdateTreasury(treasuryID)) {
        return res.status(429).send('Updating too frequently. Please wait.');
    }

    db.get(`SELECT container FROM Treasury WHERE treasuryID = ?`, [treasuryID], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        let container = row.container ? JSON.parse(row.container) : { maxWeight: 100, location: 1, itemUID: [] };


        const index = container.itemUID.findIndex(item => item.uid === itemUID);
        if (index > -1) {

            const itemDetails = container.itemUID[index];

            container.itemUID.splice(index, 1);
            const updatedContainer = JSON.stringify(container);

            db.run(`UPDATE Treasury SET container = ? WHERE treasuryID = ?`, [updatedContainer, treasuryID], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                updateAuditLog(treasuryID, playerID, 3, itemUID);
                res.json({
                    message: 'Item removed successfully',
                    itemRemoved: itemDetails
                });
            });
        } else {
            res.status(404).send('Item not found in container.');
        }
    });
});

app.post('/update-treasury/add-marcs', (req, res) => {
    const { treasuryID, playerID, marcsAdded, paySlip, incomeSourceID, reason } = req.body;
    if (!canUpdateTreasury(treasuryID)) {
        return res.status(429).send('Updating too frequently. Please wait.');
    }
    db.run(`UPDATE Treasury SET marcs = marcs + ? WHERE treasuryID = ?`, [marcsAdded, treasuryID], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (paySlip) {
            db.run(`UPDATE IncomeSources SET timeLastClaimed = datetime('now') WHERE UniqueID = ?`, [incomeSourceID], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
            });
        }
        updateAuditLog(treasuryID, playerID, 2, marcsAdded, reason);
        res.json({ message: 'Marcs added successfully', addedAsPayslip: !!paySlip });
    });
});


app.post('/update-treasury/remove-marcs', (req, res) => {
    const { treasuryID, playerID, marcsRemoved } = req.body;
    if (!canUpdateTreasury(treasuryID)) {
        return res.status(429).send('Updating too frequently. Please wait.');
    }
    db.run(`UPDATE Treasury SET marcs = marcs - ? WHERE treasuryID = ?`, [marcsRemoved, treasuryID], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        updateAuditLog(treasuryID, playerID, 1, -marcsRemoved);
        res.json({ message: 'Marcs removed successfully' });
    });
});

app.get('/get-treasury/income-sources', (req, res) => {
    const { treasuryID } = req.query;
    if (!treasuryID) {
        return res.status(400).json({ error: 'Missing required field: treasuryID is required.' });
    }

    db.all(`SELECT * FROM IncomeSources WHERE TreasuryID = ?`, [treasuryID], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No income sources found for the given treasuryID.' });
        }
        res.json({ treasuryID: treasuryID, incomeSources: rows });
    });
});


app.post('/update-treasury/add-income-source', (req, res) => {
    const { treasuryID, playerID, incomesourcesID, type, level } = req.body;
    const numTreasuryID = parseInt(treasuryID, 10);
    const numType = parseInt(type, 10);
    const numLevel = parseInt(level, 10);

    db.run(`INSERT INTO IncomeSources (UniqueID, type, TreasuryID, level, timeCreated) VALUES (?, ?, ?, ?, datetime('now'))`,
        [incomesourcesID, numType, numTreasuryID, numLevel], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            updateAuditLog(numTreasuryID, playerID, 5, incomesourcesID);
            res.json({ message: 'Income source added successfully', incomesourceID: incomesourcesID });
        });
});

function updateIncomeSource(incomesourceID, treasuryID, type, level, timeLastClaimed, playerID, res) {
    db.run(`UPDATE IncomeSources SET type = ?, level = ?, timeLastClaimed = ?, TreasuryID = ? WHERE UniqueID = ?`,
        [type, level, timeLastClaimed, treasuryID, incomesourceID], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Database error while updating income source.' });
            }
            //updateAuditLog(treasuryID, playerID, 6, `Updated income source ${incomesourceID} to type ${type} and level ${level}`);
            res.json({ message: 'Income source updated successfully' });
        });
}

app.put('/update-treasury/update-income-source', (req, res) => {
    const { incomesourceID, treasuryID, newTreasuryID, type, level, timeLastClaimed, playerID } = req.body;

    if (newTreasuryID && newTreasuryID !== treasuryID) {
        db.get(`SELECT 1 FROM Treasury WHERE treasuryID = ?`, [newTreasuryID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error while checking new treasury.' });
            }
            if (!row) {
                return res.status(404).send('New treasury not found.');
            }
            updateIncomeSource(incomesourceID, newTreasuryID, type, level, timeLastClaimed, playerID, res);
        });
    } else {
        updateIncomeSource(incomesourceID, treasuryID, type, level, timeLastClaimed, playerID, res);
    }
});

app.put('/update-treasury/access-table', (req, res) => {
    const { treasuryID, playerID, permissionTable } = req.body;
    db.run(`UPDATE Treasury SET accessTBL = ? WHERE treasuryID = ?`, [JSON.stringify(permissionTable), treasuryID], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        updateAuditLog(treasuryID, playerID, 11, JSON.stringify(permissionTable));
        res.json({ message: 'Access table updated successfully' });
    });
});

app.put('/update-treasury/name', (req, res) => {
    const { treasuryID, newName, playerID } = req.body;
    console.log(req.body)

    if (!treasuryID || !newName) {
        return res.status(400).json({ error: 'Missing required fields: treasuryID and newName are required.' });
    }

    if (!canUpdateTreasury(treasuryID)) {
        return res.status(429).send('Updating too frequently. Please wait.');
    }

    db.run(`UPDATE Treasury SET name = ? WHERE treasuryID = ?`, [newName, treasuryID], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        updateAuditLog(treasuryID, playerID, 9, `Treasury name updated to ${newName}`);
        res.json({ message: 'Treasury name updated successfully', treasuryID: treasuryID, newName: newName });
    });
});


app.get('/get-treasury/treasury', (req, res) => {
    const { treasuryID } = req.query;
    db.get(`SELECT * FROM Treasury WHERE treasuryID = ?`, [treasuryID], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});

app.get('/get-treasury/marcs', (req, res) => {
    const { treasuryID } = req.query;
    db.get(`SELECT marcs FROM Treasury WHERE treasuryID = ?`, [treasuryID], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ treasuryID: treasuryID, marcs: row.marcs });
        } else {
            res.status(404).send('Treasury not found.');
        }
    });
});

app.get('/get-treasury/access-table', (req, res) => {
    const { treasuryID } = req.query;
    db.get(`SELECT accessTBL FROM Treasury WHERE treasuryID = ?`, [treasuryID], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ treasuryID: treasuryID, accessTable: JSON.parse(row.accessTBL) });
        } else {
            res.status(404).send('Access table not found.');
        }
    });
});

app.get('/get-treasury/container', (req, res) => {
    const { treasuryID } = req.query;
    db.get(`SELECT container FROM Treasury WHERE treasuryID = ?`, [treasuryID], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ treasuryID: treasuryID, container: JSON.parse(row.container) });
        } else {
            res.status(404).send('Container not found.');
        }
    });
});

app.get('/get-treasury/location', (req, res) => {
    const { treasuryID } = req.query;
    db.get(`SELECT location FROM Treasury WHERE treasuryID = ?`, [treasuryID], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ treasuryID: treasuryID, location: row.location });
        } else {
            res.status(404).send('Location not found.');
        }
    });
});

app.get('/get-treasury/owner', (req, res) => {
    const { treasuryID } = req.query;
    db.get(`SELECT ownerID FROM Treasury WHERE treasuryID = ?`, [treasuryID], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ treasuryID: treasuryID, ownerID: row.ownerID });
        } else {
            res.status(404).send('Owner not found.');
        }
    });
});

app.get('/get-treasury/audit-logs', (req, res) => {
    const { treasuryID } = req.query;
    db.get(`SELECT audit FROM Treasury WHERE treasuryID = ?`, [treasuryID], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row && row.audit) {
            res.json({ treasuryID: treasuryID, auditLogs: JSON.parse(row.audit) });
        } else {
            res.status(404).send('Audit logs not found.');
        }
    });
});

app.post('/update-treasury/update-container-location', (req, res) => {
    const { treasuryID, playerID, containerID, newLocation } = req.body;

    if (!containerID || newLocation === undefined) {
        return res.status(400).json({ error: 'Missing required fields: containerID and newLocation must be provided.' });
    }

    const query = `UPDATE Containers SET location = ? WHERE id = ?`;
    db.run(query, [newLocation, containerID], function (err) {
        if (err) {
            res.status(500).json({ error: 'Database error: ' + err.message });
            return;
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Container not found' });
        }
        updateAuditLog(treasuryID, playerID, 8, newLocation);
        res.status(200).json({ message: 'Container location updated successfully', updatedLocation: newLocation });
    });
});

app.post('/create/treasury', (req, res) => {
    const { ownerID, type, name, location } = req.body;

    if (!ownerID || !type || !name || !location) {
        return res.status(400).json({ error: 'Missing required fields: ownerID, type, location, and name are required.' });
    }

    const defaultContainer = JSON.stringify({ maxWeight: 100, location: location, itemUID: [] });

    const treasuryQuery = `INSERT INTO Treasury (ownerID, type, name, container) VALUES (?, ?, ?, ?)`;
    db.run(treasuryQuery, [ownerID, type, name, defaultContainer], function (err) {
        if (err) {
            res.status(500).json({ error: 'Database error: ' + err.message });
            return;
        }

        const treasuryID = this.lastID;
        updateAuditLog(treasuryID, ownerID, 10, `Created this treasury with the name ${name}`);
        res.status(201).json({ message: 'Treasury created successfully with container', treasuryID: treasuryID });
    });
});

app.use(authorize);

app.listen(port, () => {
    console.log(`Treasury app listening at http://localhost:${port}`);
});
