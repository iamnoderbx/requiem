const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./plots.db');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 1237;

const createDatabaseTables = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Plots (
            id INTEGER PRIMARY KEY,
            owner INTEGER NOT NULL,
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Assets (
            id INTEGER PRIMARY KEY,
            asset_id INTEGER NOT NULL,
            plot_id INTEGER NOT NULL,
            x INTEGER NOT NULL,
            y INTEGER NOT NULL,
            z INTEGER NOT NULL,
            built BOOLEAN NOT NULL,
            owner INTEGER NOT NULL,
            FOREIGN KEY(plot_id) REFERENCES Plots(id)
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Properties (
            property_id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset_id INTEGER NOT NULL,
            property_value INTEGER NOT NULL,
            FOREIGN KEY(asset_id) REFERENCES Assets(asset_id)
        );
    `);
}

db.serialize(() => {
	createDatabaseTables()
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
	if (!apiKey || apiKey !== "r67guiklsapol124") {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	next();
}

// Make an endpoint to clear the entire database and reset it
// for testing
app.post('/reset', (req, res) => {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS Plots`);

        createDatabaseTables()
        res.status(200).send('Database reset');
    });
})

app.post('/plots/add', authorize, (req, res) => {
    const { id, owner } = req.body;

    if (!id || !owner) {
        res.status(400).json({ error: 'Missing id or owner' });
        return;
    }

    const checkPlotExistsQuery = 'SELECT id FROM Plots WHERE id = ?';
    const addPlotQuery = 'INSERT INTO Plots (id, owner) VALUES (?, ?)';

    db.get(checkPlotExistsQuery, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Error checking for existing plot' });
            return;
        }

        if (row) {
            res.status(409).json({ error: 'Plot already exists' });
            return;
        }

        db.run(addPlotQuery, [id, owner], (err) => {
            if (err) {
                res.status(500).json({ error: 'Error adding plot' });
                return;
            }

            res.status(201).send('Plot added successfully');
        });
    });
});

// Make an endpoint to delete a plot asset

// Make an endpoint to create a new asset, the request also includes
// a number array which are the properties of the asset
app.post('/assets/add', authorize, (req, res) => {
    const { assetId, plotId, x, y, z, built, owner, properties } = req.body;

    if (!assetId || !plotId || !x || !y || !z || !built || !owner || !properties) {
        res.status(400).json({ error: 'Missing assetId, plotId, x, y, z, built, owner, or properties' });
        return;
    }

    const addAssetQuery = 'INSERT INTO Assets (asset_id, plot_id, x, y, z, built, owner) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const addPropertiesQuery = 'INSERT INTO Properties (asset_id, property_value) VALUES (?, ?)';

    db.run(addAssetQuery, [assetId, plotId, x, y, z, built, owner], function(err) {
        if (err) {
            res.status(500).json({ error: 'Error adding asset' });
            return;
        }

        properties.forEach(property => {
            db.run(addPropertiesQuery, [assetId, property], (err) => {
                if (err) {
                    res.status(500).json({ error: 'Error adding properties' });
                    return;
                }
            });
        });

        res.status(201).send('Asset added successfully');
    });
});


// Make an endpoint to get a plots assets
app.get('/assets/getAll', authorize, (req, res) => {
    const { plotId } = req.query;

    if (!plotId) {
        res.status(400).json({ error: 'Missing plotId' });
        return;
    }

    const getAssetsQuery = 'SELECT * FROM Assets WHERE plot_id = ?';

    db.all(getAssetsQuery, [plotId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving assets' });
            return;
        }

        res.status(200).json(rows);
    });
});

// Make an endpoint to get all plots that a user owns.
// The user is identified by their id (owner)
app.get('/plots/getAll', authorize, (req, res) => {
    const { owner } = req.query;

    if (!owner) {
        res.status(400).json({ error: 'Missing owner' });
        return;
    }

    const getPlotsQuery = 'SELECT * FROM Plots WHERE owner = ?';

    db.all(getPlotsQuery, [owner], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving plots' });
            return;
        }

        res.status(200).json(rows);
    });
});

app.get('/plots/get', authorize, (req, res) => {
    const { id } = req.query;

    if (!id) {
        res.status(400).json({ error: 'Missing id' });
        return;
    }

    const getPlotQuery = 'SELECT * FROM Plots WHERE id = ?';

    db.get(getPlotQuery, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving plot' });
            return;
        }

        if (!row) {
            res.status(404).json({ error: 'Plot not found' });
            return;
        }

        res.status(200).json(row);
    });
});

app.use(authorize);
app.listen(port, () => {
	console.log(`Landlord Plots app listening at http://localhost:${port}`);
});