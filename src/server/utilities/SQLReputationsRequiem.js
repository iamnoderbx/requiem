const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./reputations.db');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 1236;

const createDatabaseTables = () => {
    db.run(`CREATE TABLE IF NOT EXISTS LocationFactors (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        type INT,
        population INT,
		businesses INT,
        average_income INT,
        happiness REAL,
        outlook REAL,
		governor INT,
		civilian_tax REAL,
		industrial_tax REAL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS ReputationItem (
        id INTEGER PRIMARY KEY,
        type INT,
        name TEXT NOT NULL,
        location INTEGER,
        reputation REAL,
        FOREIGN KEY(location) REFERENCES LocationFactors(id)
    )`);
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
	if (!apiKey || apiKey !== "247fgbefktyh8018kd") {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	next();
}

// Make an endpoint to clear the entire database and reset it
// for testing
app.post('/reset', (req, res) => {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS LocationFactors`);
        db.run(`DROP TABLE IF EXISTS ReputationItem`);

        createDatabaseTables()

        res.status(200).send('Database reset');
    });
})

// Make an endpoint to get a location by its governor id
app.get('/location/get/governor', (req, res) => {
	const { governor } = req.query;

	db.serialize(() => {
		db.get(`SELECT * FROM LocationFactors WHERE governor = ?`, [governor], (err, row) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(200).json(row);
		});
	});
})

// Make an endpoint to add a new location
app.post('/location/add', (req, res) => {
	const { name, type, population, average_income, happiness, outlook, governor, civilian_tax, industrial_tax, businesses } = req.body;

	db.serialize(() => {
		const stmt = db.prepare(`INSERT INTO LocationFactors (name, type, population, average_income, happiness, outlook, governor, civilian_tax, industrial_tax, businesses) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
		stmt.run(name, type, population, average_income, happiness, outlook, governor, civilian_tax, industrial_tax, businesses);
		stmt.finalize();

		res.status(200).send('Location added');
	});
})

// Make an endpoint to get a location by name and type
app.get('/location/get', (req, res) => {
	const { name, type } = req.query;

	db.serialize(() => {
		db.get(`SELECT * FROM LocationFactors WHERE name = ? AND type = ?`, [name, type], (err, row) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(200).json(row);
		});
	});
})

// Make an endpoint to update a locations governor
app.put('/location/update/governor', (req, res) => {
	const { id, governor } = req.body;

	db.serialize(() => {
		const stmt = db.prepare(`UPDATE LocationFactors SET governor = ? WHERE id = ?`);
		stmt.run(governor, id);
		stmt.finalize();

		res.status(200).send('Governor updated');
	});
})

// Make an endpoint to update a locations taxes
app.put('/location/update/taxes', (req, res) => {
	const { id, civilian_tax, industrial_tax } = req.body;

	db.serialize(() => {
		const stmt = db.prepare(`UPDATE LocationFactors SET civilian_tax = ?, industrial_tax = ? WHERE id = ?`);
		stmt.run(civilian_tax, industrial_tax, id);
		stmt.finalize();

		res.status(200).send('Taxes updated');
	});
})

// Make an endpoint to update a locations outlook
app.put('/location/update/outlook', (req, res) => {
	const { id, outlook } = req.body;

	db.serialize(() => {
		const stmt = db.prepare(`UPDATE LocationFactors SET outlook = ? WHERE id = ?`);
		stmt.run(outlook, id);
		stmt.finalize();

		res.status(200).send('Outlook updated');
	});
})

// Make an endpoint to update a locations happiness
app.put('/location/update/happiness', (req, res) => {
	const { id, happiness } = req.body;

	db.serialize(() => {
		const stmt = db.prepare(`UPDATE LocationFactors SET happiness = ? WHERE id = ?`);
		stmt.run(happiness, id);
		stmt.finalize();

		res.status(200).send('Happiness updated');
	});
})

// Make an endpoint to update a locations businesses
app.put('/location/update/businesses', (req, res) => {
	const { id, businesses } = req.body;

	db.serialize(() => {
		const stmt = db.prepare(`UPDATE LocationFactors SET businesses = ? WHERE id = ?`);
		stmt.run(businesses, id);
		stmt.finalize();

		res.status(200).send('Businesses updated');
	});
})

// Make an endpoint to update a locations population
app.put('/location/update/population', (req, res) => {
	const { id, population } = req.body;

	db.serialize(() => {
		const stmt = db.prepare(`UPDATE LocationFactors SET population = ? WHERE id = ?`);
		stmt.run(population, id);
		stmt.finalize();

		res.status(200).send('Population updated');
	});
})

// Make an endpoint to update a locations average income
app.put('/location/update/income', (req, res) => {
	const { id, average_income } = req.body;

	db.serialize(() => {
		const stmt = db.prepare(`UPDATE LocationFactors SET average_income = ? WHERE id = ?`);
		stmt.run(average_income, id);
		stmt.finalize();

		res.status(200).send('Income updated');
	});
})

// Make an endpoint to delete a location
app.delete('/location/delete', (req, res) => {
	const { id } = req.query;

	db.serialize(() => {
		const stmt = db.prepare(`DELETE FROM LocationFactors WHERE id = ?`);
		stmt.run(id);
		stmt.finalize();

		res.status(200).send('Location deleted');
	});
})

// Make an endpoint to get a locations reputation
app.get('/location/reputation/get', (req, res) => {
	const { id } = req.query;

	db.serialize(() => {
		db.all(`SELECT * FROM ReputationItem WHERE location = ?`, [id], (err, rows) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(200).json(rows);
		});
	});
})

// Make an endpoint to add a new reputation item
// Should have a location as a foreign key integer for the location
app.post('/reputation/add', (req, res) => {
	const { type, name, location, reputation } = req.body;

	db.serialize(() => {
		const stmt = db.prepare(`INSERT INTO ReputationItem (type, name, location, reputation) VALUES (?, ?, ?, ?)`);
		stmt.run(type, name, location, reputation);
		stmt.finalize();

		res.status(200).send('Reputation added');
	});
})

// Make an endpoint to update a reputation item
app.put('/reputation/update', (req, res) => {
	const { id, reputation } = req.body;

	db.serialize(() => {
		const stmt = db.prepare(`UPDATE ReputationItem SET reputation = ? WHERE id = ?`);
		stmt.run(reputation, id);
		stmt.finalize();

		res.status(200).send('Reputation updated');
	});
})

// Make an endpoint to delete a reputation item
app.delete('/reputation/delete', (req, res) => {
	const { id } = req.query;

	db.serialize(() => {
		const stmt = db.prepare(`DELETE FROM ReputationItem WHERE id = ?`);
		stmt.run(id);
		stmt.finalize();

		res.status(200).send('Reputation deleted');
	});
})

// Make an endpoint to get a reputation item by location and name
app.get('/reputation/get', (req, res) => {
	const { location, name } = req.query;

	db.serialize(() => {
		db.get(`SELECT * FROM ReputationItem WHERE location = ? AND name = ?`, [location, name], (err, row) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(200).json(row);
		});
	});
})

// Make an endpoint to get all locations and their reputation items
app.get('/get/all', (req, res) => {
	db.serialize(() => {
		db.all(`SELECT * FROM LocationFactors`, (err, rows) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}

			const promises = rows.map((location) => {
				return new Promise((resolve, reject) => {
					db.all(`SELECT * FROM ReputationItem WHERE location = ?`, [location.id], (err, rows) => {
						if (err) {
							reject(err);
						}
						resolve({ location, reputation: rows });
					});
				});
			});

			Promise.all(promises).then((results) => {
				res.status(200).json(results);
			}).catch((err) => {
				res.status(500).json({ error: err.message });
			});
		});
	});
})

// Make an endpoint to get all reputation items for a location
app.get('/reputation/get/all', (req, res) => {
	const { location } = req.query;

	db.serialize(() => {
		db.all(`SELECT * FROM ReputationItem WHERE location = ?`, [location], (err, rows) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(200).json(rows);
		});
	});
})

app.use(authorize);
app.listen(port, () => {
	console.log(`Reputations app listening at http://localhost:${port}`);
});