const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./branches.db');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 1235;

const zlib = require('zlib');
const { promisify } = require('util');
const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const createDatabaseTables = () => {
    db.run(`CREATE TABLE IF NOT EXISTS Branch (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        shout TEXT,
        treasury INTEGER DEFAULT 0
    )`);

    // Create a table for the ranks
    db.run(`CREATE TABLE IF NOT EXISTS RankStructure (
        id INTEGER PRIMARY KEY,
        branch_id INTEGER,
        rank_id INTEGER,
        wage INTEGER,
        name TEXT NOT NULL,
        FOREIGN KEY(branch_id) REFERENCES Branch(id)
    )`);

    // Create a table for the branch detachments
    db.run(`CREATE TABLE IF NOT EXISTS Detachment (
        id INTEGER PRIMARY KEY,
        branch_id INTEGER,
        name TEXT NOT NULL,
        abbreviation TEXT NOT NULL,
        r INTEGER DEFAULT 0,
        g INTEGER DEFAULT 0,
        b INTEGER DEFAULT 0,
        FOREIGN KEY(branch_id) REFERENCES Branch(id)
    )`);

    // Create a table for the branch members
    db.run(`CREATE TABLE IF NOT EXISTS BranchMembers (
        branch_id INTEGER,
        user_id INTEGER,
        rank_id INTEGER,
        detachment_id INTEGER,
        username TEXT,
        FOREIGN KEY(branch_id) REFERENCES Branch(id),
        FOREIGN KEY(user_id) REFERENCES User(id),
        FOREIGN KEY(detachment_id) REFERENCES Detachment(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS BranchPoints (
        id INTEGER PRIMARY KEY,
        branch_id INTEGER,
        user_id INTEGER,
        points INTEGER,
        point_type INTEGER,
        FOREIGN KEY(branch_id) REFERENCES Branch(id),
        FOREIGN KEY(user_id) REFERENCES User(id),
        UNIQUE(branch_id, user_id, point_type)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS AuditLog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        branch_id INTEGER,
        user_id INTEGER,
        log TEXT NOT NULL,
        audit_type INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(branch_id) REFERENCES Branch(id),
        FOREIGN KEY(user_id) REFERENCES User(id)
    )`);

    // New table for BranchTransfers
    db.run(`CREATE TABLE IF NOT EXISTS BranchTransfers (
        user_id INTEGER,
        current_branch_id INTEGER,
        target_branch_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES User(id),
        FOREIGN KEY(current_branch_id) REFERENCES Branch(id),
        FOREIGN KEY(target_branch_id) REFERENCES Branch(id)
    )`);
}

db.serialize(() => {
    // Create a bunch of tables for the branch, it will contain
    // the branch id, the branch name, the branch icon,
    // the branch members (seperate table which contains user id)
    // the branch points, the branch wage structure, and the branch shout

    // The wage structure should be a database table that contains
    // the rank id, and the amount of money.
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
    if (!apiKey || apiKey !== "m9hteifjf89aw9boe") {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
}

// Make an endpoint to clear the entire database and reset it
// for testing
app.post('/reset', (req, res) => {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS Branch`);
        db.run(`DROP TABLE IF EXISTS RankStructure`);
        db.run(`DROP TABLE IF EXISTS BranchMembers`);
        db.run(`DROP TABLE IF EXISTS BranchPoints`);
        db.run(`DROP TABLE IF EXISTS Detachment`);
        db.run(`DROP TABLE IF EXISTS AuditLog`);

        createDatabaseTables()

        res.status(200).send('Database reset');
    });
})

app.get('/branch/transfers/get', (req, res) => {
    const { branch_id } = req.query;
    db.all(`SELECT * FROM BranchTransfers WHERE current_branch_id = ? OR target_branch_id = ?`, [branch_id, branch_id], (err, rows) => {
        if (err) {
            res.status(500).send('Failed to get branch transfers');
        } else {
            res.status(200).json(rows);
        }
    });
});

// Make an endpoint to accept a branch transfer. It will set the users BranchMember branch_id to the target_branch_id
// It will also reset the users points in the target branch, reset their rank to the lowest rank in the target branch
// and remove them from any detachment.
app.post('/branch/transfer/accept', (req, res) => {
    const { user_id, target_branch_id } = req.body;
    db.run(`UPDATE BranchMembers SET branch_id = ?, rank_id = (SELECT rank_id FROM RankStructure WHERE branch_id = ? ORDER BY rank_id ASC LIMIT 1), detachment_id = -1 WHERE user_id = ?`, [target_branch_id, target_branch_id, user_id], (err) => {
        if (err) {
            res.status(500).send('Failed to accept branch transfer');
            return;
        }
        // Delete the transfer request after updating BranchMembers
        db.run(`DELETE FROM BranchTransfers WHERE user_id = ? AND target_branch_id = ?`, [user_id, target_branch_id], (err) => {
            if (err) {
                res.status(500).send('Failed to delete branch transfer request');
            } else {
                res.status(200).send('Branch transfer accepted and request deleted');
            }
        });
    });
});
// Make an endpoint to delete a branch transfer
app.delete('/branch/transfer/delete', (req, res) => {
    const { user_id, current_branch_id, target_branch_id } = req.body;
    db.run(`DELETE FROM BranchTransfers WHERE user_id = ? AND current_branch_id = ? AND target_branch_id = ?`, [user_id, current_branch_id, target_branch_id], (err) => {
        if (err) {
            res.status(500).send('Failed to delete branch transfer');
        } else {
            res.status(200).send('Branch transfer deleted');
        }
    });
});

// Make an endpoint to add a branch transfer
app.post('/branch/transfer/add', (req, res) => {
    const { user_id, current_branch_id, target_branch_id } = req.body;
    db.run(`INSERT INTO BranchTransfers (user_id, current_branch_id, target_branch_id) VALUES (?, ?, ?)`, [user_id, current_branch_id, target_branch_id], (err) => {
        if (err) {
            res.status(500).send('Failed to add branch transfer');
        } else {
            res.status(200).send('Branch transfer added');
        }
    });
});

// Make an endpoint to add an audit log
app.post('/audit/add', async (req, res) => {
    const { branch_id, user_id, audit_type, log } = req.body;

    try {
        // Compress the log string
        const compressedLog = await gzip(log);

        // Check the current count of logs
        const countQuery = `SELECT COUNT(*) AS total FROM AuditLog`;
        db.get(countQuery, async (err, result) => {
            if (err) {
                res.status(500).send('Failed to check audit log count');
                return;
            }

            if (result.total >= 300) {
                // Delete the oldest log
                const deleteOldestLogQuery = `DELETE FROM AuditLog WHERE id = (SELECT id FROM AuditLog ORDER BY timestamp ASC LIMIT 1)`;
                await new Promise((resolve, reject) => {
                    db.run(deleteOldestLogQuery, (err) => {
                        if (err) reject(err);
                        resolve();
                    });
                });
            }

            // Insert the compressed log into the database
            db.run(`INSERT INTO AuditLog (branch_id, user_id, log, audit_type) VALUES (?, ?, ?, ?)`, [branch_id, user_id, compressedLog, audit_type], (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Failed to add audit log');
                } else {
                    res.status(200).send('Audit log added');
                }
            });
        });
    } catch (error) {
        res.status(500).send('Failed to compress and add audit log');
    }
});

app.get('/audit/get', async (req, res) => {
    const { branch_id, audit_type, page = 0, limit = 20 } = req.query;
    const offset = page * limit;

    // Adjust the queries to optionally filter by audit_type
    let countQuery = `SELECT COUNT(*) AS total FROM AuditLog WHERE branch_id = ?`;
    // Modified fetchQuery to include ORDER BY clause for descending order
    let fetchQuery = `SELECT * FROM AuditLog WHERE branch_id = ? ORDER BY timestamp DESC`; // Assuming 'timestamp' is the column to sort by
    const queryParams = [branch_id]; // Initialize query parameters array with branch_id

    // If audit_type is provided, add it to the query
    if (audit_type) {
        countQuery += ` AND audit_type = ?`;
        // Ensure the ORDER BY clause remains at the end of the query
        fetchQuery = fetchQuery.replace('ORDER BY timestamp DESC', '') + ` AND audit_type = ? ORDER BY timestamp DESC`;
        queryParams.push(audit_type); // Add audit_type to the parameters array
    }

    fetchQuery += ` LIMIT ? OFFSET ?`; // Complete the fetchQuery with LIMIT and OFFSET
    const fetchParams = [...queryParams, limit, offset]; // Combine queryParams with limit and offset for the fetch query

    db.get(countQuery, queryParams, async (err, countResult) => {
        if (err) {
            res.status(500).send('Failed to get audit logs count');
            return;
        }

        const totalLogs = countResult.total;
        const totalPages = Math.ceil(totalLogs / limit);

        db.all(fetchQuery, fetchParams, async (err, rows) => {
            if (err) {
                res.status(500).send('Failed to get audit logs');
                return;
            }

            try {
                const logs = await Promise.all(rows.map(async (row) => {
                    const decompressedLog = await gunzip(row.log);
                    return {
                        ...row,
                        log: decompressedLog.toString('utf-8')
                    };
                }));

                res.status(200).json({ logs, pages: totalPages });
            } catch (decompressionError) {
                res.status(500).send('Failed to decompress logs');
            }
        });
    });
});

// Make an endpoint for creating a branch
app.post('/branch/create', (req, res) => {
    const { name, icon, shout } = req.body;
    db.run(`INSERT INTO Branch (name, icon, shout) VALUES (?, ?, ?)`, [name, icon, shout], function (err) {
        if (err) {
            res.status(500).send('Failed to create branch');
        } else {
            res.status(200).send({ message: 'Branch created', id: this.lastID });
        }
    });
});

// Make an endpoint for getting a branch

app.get('/branch/get', (req, res) => {
    const { branch_id } = req.query;
    db.get(`
        SELECT Branch.id as branch_id, Branch.name, Branch.icon, Branch.shout, 
               (SELECT COUNT(*) FROM BranchMembers WHERE BranchMembers.branch_id = Branch.id) as memberCount,
               (SELECT user_id FROM BranchMembers WHERE BranchMembers.branch_id = Branch.id AND BranchMembers.rank_id = 12 LIMIT 1) as commander
        FROM Branch
        WHERE Branch.id = ?`, [branch_id], (err, row) => {
        if (err) {
            res.status(500).send('Failed to get branch');
        } else {
            if (!row) {
                res.status(404).send('Branch not found');
            } else {
                res.status(200).json(row);
            }
        }
    });
});

app.post('/branch/rank/create', (req, res) => {
    const { branch_id, wage, name, rank_id } = req.body;
    db.run(`INSERT INTO RankStructure (branch_id, rank_id, wage, name) VALUES (?, ?, ?, ?)`, [branch_id, rank_id, wage, name], (err) => {
        if (err) {
            res.status(500).send('Failed to create rank');
        } else {
            res.status(200).send({ message: 'Rank created', rank_id });
        }
    });
});

// Make an endpoint for adding a member to a branch
app.post('/branch/member/add', (req, res) => {
    const { branch_id, user_id, rank_id, name } = req.body;
    // First, check if a record exists for the given user_id
    db.get(`SELECT user_id FROM BranchMembers WHERE user_id = ?`, [user_id], (err, row) => {
        if (err) {
            res.status(500).send('Failed to query existing member');
        } else if (row) {
            // If a record exists, update it
            db.run(`UPDATE BranchMembers SET branch_id = ?, rank_id = ?, username = ? WHERE user_id = ?`,
                [branch_id, rank_id, name, user_id], (updateErr) => {
                    if (updateErr) {
                        res.status(500).send('Failed to update member');
                    } else {
                        res.status(200).send('Member updated successfully');
                    }
                });
        } else {
            // If no record exists, insert a new one
            db.run(`INSERT INTO BranchMembers (branch_id, user_id, rank_id, username) VALUES (?, ?, ?, ?)`,
                [branch_id, user_id, rank_id, name], (insertErr) => {
                    if (insertErr) {
                        res.status(500).send('Failed to add member');
                    } else {
                        res.status(200).send('Member added successfully');
                    }
                });
        }
    });
});

// Make an endpoint for updating a member's rank
app.post('/branch/member/update', (req, res) => {
    const { branch_id, user_id, rank_id } = req.body;
    db.run(`UPDATE BranchMembers SET rank_id = ? WHERE branch_id = ? AND user_id = ?`, [rank_id, branch_id, user_id], (err) => {
        if (err) {
            res.status(500).send('Failed to update member');
        } else {
            res.status(200).send('Member updated');
        }
    });
});

// Make an endpoint for updating a user's points
app.post('/branch/points/update', (req, res) => {
    const { branch_id, user_id, points, point_type } = req.body;
    db.run(`INSERT OR REPLACE INTO BranchPoints (branch_id, user_id, points, point_type) VALUES (?, ?, ?, ?)`, [branch_id, user_id, points, point_type], (err) => {
        if (err) {
            res.status(500).send('Failed to update points');
        } else {
            res.status(200).send('Points updated');
        }
    });
});

// Make an endpoint for adding points to a user of type
// if it doesn't exist create it
app.post('/branch/points/add', (req, res) => {
    const { branch_id, user_id, points, point_type } = req.body;
    db.run(`INSERT OR REPLACE INTO BranchPoints (branch_id, user_id, points, point_type) VALUES (?, ?, COALESCE((SELECT points FROM BranchPoints WHERE branch_id = ? AND user_id = ? AND point_type = ?), 0) + ?, ?)`, [branch_id, user_id, branch_id, user_id, point_type, points, point_type], (err) => {
        if (err) {
            res.status(500).send('Failed to add points');
        } else {
            res.status(200).send('Points added');
        }
    });
});

// Make an endpoint for removing points from a user of type
// if it doesn't exist create it and set it to 0
app.post('/branch/points/remove', (req, res) => {
    const { branch_id, user_id, points, point_type } = req.body;
    db.run(`INSERT OR REPLACE INTO BranchPoints (branch_id, user_id, points, point_type) VALUES (?, ?, COALESCE((SELECT points FROM BranchPoints WHERE branch_id = ? AND user_id = ? AND point_type = ?), 0) - ?, ?)`, [branch_id, user_id, branch_id, user_id, point_type, points, point_type], (err) => {
        if (err) {
            res.status(500).send('Failed to remove points');
        } else {
            res.status(200).send('Points removed');
        }
    });
});

// Make an endpoint for getting a user's points, where if
// you don't provide a point type, it returns all points
app.get('/branch/points/get', (req, res) => {
    const { branch_id, user_id, point_type } = req.query;
    if (point_type) {
        db.get(`SELECT points FROM BranchPoints WHERE branch_id = ? AND user_id = ? AND point_type = ?`, [branch_id, user_id, point_type], (err, row) => {
            if (err) {
                res.status(500).send('Failed to get points');
            } else {
                res.status(200).json(row);
            }
        });
    } else {
        db.all(`SELECT points, point_type FROM BranchPoints WHERE branch_id = ? AND user_id = ?`, [branch_id, user_id], (err, rows) => {
            if (err) {
                res.status(500).send('Failed to get points');
            } else {
                res.status(200).json(rows);
            }
        });
    }
});

app.get('/branch/members/get', (req, res) => {
    const { branch_id, page, limit, rank_id, search } = req.query;

    // Adjust the base SQL for counting total members
    let countSql = `
        SELECT COUNT(*) AS total 
        FROM BranchMembers 
        WHERE branch_id = ?`;

    let paramsForCount = [branch_id];

    if (rank_id) {
        countSql += ' AND rank_id = ?';
        paramsForCount.push(rank_id);
    }

    // Adjust search condition to match the start of the username
    if (search) {
        countSql += ' AND username LIKE ?';
        paramsForCount.push(`${search}%`); // Matches usernames starting with the search term
    }

    // Execute the count query
    db.get(countSql, paramsForCount, (err, countResult) => {
        if (err) {
            return res.status(500).send('Failed to get total members count');
        }

        // Calculate total pages
        const totalMembers = countResult.total;
        const totalPages = Math.ceil(totalMembers / limit);

        // Adjust the SQL for fetching members with pagination
        let fetchSql = `
        SELECT BranchMembers.*, 
               COALESCE(Detachment.name, 'None') as detachment_name, 
               COALESCE(Detachment.abbreviation, 'N/A') as abbreviation,
               COALESCE(Detachment.id, -1) as detachment_id, 
               COALESCE(Detachment.r, 255) as r, 
               COALESCE(Detachment.g, 255) as g, 
               COALESCE(Detachment.b, 255) as b 
        FROM BranchMembers 
        LEFT JOIN Detachment ON BranchMembers.detachment_id = Detachment.id 
        WHERE BranchMembers.branch_id = ?`;

        let paramsForFetch = [branch_id];

        if (rank_id) {
            fetchSql += ' AND BranchMembers.rank_id = ?';
            paramsForFetch.push(rank_id);
        }

        // Adjust search condition for fetching to match the start of the username
        if (search) {
            fetchSql += ' AND BranchMembers.username LIKE ?';
            paramsForFetch.push(`${search}%`);
        }

        fetchSql += ' LIMIT ? OFFSET ?';
        paramsForFetch.push(limit, page * limit);

        // Execute the fetch query
        db.all(fetchSql, paramsForFetch, (err, rows) => {
            if (err) {
                console.log(err)
                return res.status(500).send('Failed to get members');
            }

            const members = rows.map(row => {
                const { detachment_name, abbreviation, detachment_id, r, g, b, ...member } = row;
                return {
                    ...member,
                    detachment: {
                        detachment_name,
                        abbreviation, // Include the abbreviation in the detachment object
                        detachment_id,
                        r,
                        g,
                        b
                    }
                };
            });

            // Return both members and total pages
            res.status(200).json({ members, totalPages });
        });
    });
});

// Make an endpoint to get a user's wage based on their rank
app.get('/branch/member/wage/get', (req, res) => {
    const { branch_id, user_id } = req.query;
    db.get(`SELECT wage FROM RankStructure WHERE branch_id = ? AND rank_id = (SELECT rank_id FROM BranchMembers WHERE branch_id = ? AND user_id = ?)`, [branch_id, branch_id, user_id], (err, row) => {
        if (err) {
            res.status(500).send('Failed to get wage');
        } else {
            res.status(200).json(row);
        }
    });
})

app.get('/branch/member/get', (req, res) => {
    const { member_id } = req.query;
    db.all(`
        SELECT BranchMembers.*, 
               COALESCE(Detachment.name, 'None') as detachment_name, 
               COALESCE(Detachment.abbreviation, 'N/A') as abbreviation,
               COALESCE(Detachment.id, -1) as detachment_id, 
               COALESCE(Detachment.r, 255) as r, 
               COALESCE(Detachment.g, 255) as g, 
               COALESCE(Detachment.b, 255) as b,
               COALESCE(RankStructure.name, 'No Rank') as rank_name,
               COALESCE(RankStructure.wage, 0) as wage_amount
        FROM BranchMembers 
        LEFT JOIN Detachment ON BranchMembers.detachment_id = Detachment.id 
        LEFT JOIN RankStructure ON BranchMembers.rank_id = RankStructure.rank_id
        WHERE BranchMembers.user_id = ?`,
        [member_id], (err, rows) => {
            if (err) {
                res.status(500).send('Failed to get member');
            } else if (rows.length === 0) {
                res.status(404).send('Member not found');
            } else {
                const { detachment_name, abbreviation, detachment_id, r, g, b, rank_name, wage_amount, ...member } = rows[0];
                res.status(200).json({
                    ...member,
                    detachment: {
                        detachment_name,
                        abbreviation, // Include the abbreviation in the response
                        detachment_id,
                        r,
                        g,
                        b
                    },
                    rank: rank_name,
                    wage: wage_amount
                });
            }
        });
});

// Make an endpoint to promote a user in a branch
// increment their rank by 1
app.post('/branch/member/promote', (req, res) => {
    const { branch_id, user_id } = req.body;
    db.get(`SELECT rank_id FROM BranchMembers WHERE branch_id = ? AND user_id = ?`, [branch_id, user_id], (err, row) => {
        if (err) {
            res.status(500).send('Failed to promote member');
        } else {
            db.get(`SELECT rank_id FROM RankStructure WHERE branch_id = ? AND rank_id = ? + 1`, [branch_id, row.rank_id], (err, rank) => {
                if (err) {
                    res.status(500).send('Failed to promote member');
                } else {
                    db.run(`UPDATE BranchMembers SET rank_id = ? WHERE branch_id = ? AND user_id = ?`, [rank.rank_id, branch_id, user_id], (err) => {
                        if (err) {
                            res.status(500).send('Failed to promote member');
                        } else {
                            res.status(200).send('Member promoted');
                        }
                    });
                }
            });
        }
    });
})

// Make an endpoint to set a users rank in a branch
app.post('/branch/member/rank/set', (req, res) => {
    const { branch_id, user_id, rank_id } = req.body;
    db.run(`UPDATE BranchMembers SET rank_id = ? WHERE branch_id = ? AND user_id = ?`, [rank_id, branch_id, user_id], (err) => {
        if (err) {
            res.status(500).send('Failed to set rank');
        } else {
            res.status(200).send('Rank set');
        }
    });
});

// Make an endpoint to get a users rank in a branch
app.get('/branch/member/rank/get', (req, res) => {
    const { branch_id, user_id } = req.query;
    db.get(`SELECT rank_id FROM BranchMembers WHERE branch_id = ? AND user_id = ?`, [branch_id, user_id], (err, row) => {
        if (err) {
            res.status(500).send('Failed to get rank');
        } else if (row) {
            // Get the rank structure
            db.get(`SELECT * FROM RankStructure WHERE id = ?`, [row.rank_id], (err, rankRow) => {
                if (err) {
                    res.status(500).send('Failed to get rank structure');
                } else {
                    res.status(200).json(rankRow);
                }
            });
        } else {
            res.status(404).send('No rank found for the given user in the given branch');
        }
    });
});

// Make an endpoint for getting a branch's ranks
app.get('/branch/ranks/get', (req, res) => {
    const { branch_id } = req.query;
    db.all(`SELECT * FROM RankStructure WHERE branch_id = ?`, [branch_id], (err, rows) => {
        if (err) {
            res.status(500).send('Failed to get ranks');
        } else {
            res.status(200).json(rows);
        }
    });
});

// Make an endpoint for getting a branch's shout
app.get('/branch/shout/get', (req, res) => {
    const { branch_id } = req.query;
    db.get(`SELECT shout FROM Branch WHERE id = ?`, [branch_id], (err, row) => {
        if (err) {
            res.status(500).send('Failed to get shout');
        } else {
            res.status(200).json(row);
        }
    });
});

// Make an endpoint for updating a branch's shout
app.post('/branch/shout/update', (req, res) => {
    const { branch_id, shout } = req.body;
    db.run(`UPDATE Branch SET shout = ? WHERE id = ?`, [shout, branch_id], (err) => {
        if (err) {
            res.status(500).send('Failed to update shout');
        } else {
            res.status(200).send('Shout updated');
        }
    });
});

// Make an endpoint for getting a branch's icon
app.get('/branch/icon/get', (req, res) => {
    const { branch_id } = req.query;
    db.get(`SELECT icon FROM Branch WHERE id = ?`, [branch_id], (err, row) => {
        if (err) {
            res.status(500).send('Failed to get icon');
        } else {
            res.status(200).json(row);
        }
    });
});

// Make an endpoint for updating a branch's icon
app.post('/branch/icon/update', (req, res) => {
    const { branch_id, icon } = req.body;
    db.run(`UPDATE Branch SET icon = ? WHERE id = ?`, [icon, branch_id], (err) => {
        if (err) {
            res.status(500).send('Failed to update icon');
        } else {
            res.status(200).send('Icon updated');
        }
    });
});

// Make an endpoint for getting a branch's name
app.get('/branch/name/get', (req, res) => {
    const { branch_id } = req.query;
    db.get(`SELECT name FROM Branch WHERE id = ?`, [branch_id], (err, row) => {
        if (err) {
            res.status(500).send('Failed to get name');
        } else {
            res.status(200).json(row);
        }
    });
});

// Make an endpoint for updating a branch's name
app.post('/branch/name/update', (req, res) => {
    const { branch_id, name } = req.body;
    db.run(`UPDATE Branch SET name = ? WHERE id = ?`, [name, branch_id], (err) => {
        if (err) {
            res.status(500).send('Failed to update name');
        } else {
            res.status(200).send('Name updated');
        }
    });
});

// Make an endpoint for getting all wages for a branch
// or a specific wage for a rank
app.get('/branch/wages/get', (req, res) => {
    const { branch_id, rank_id } = req.query;
    if (rank_id) {
        db.get(`SELECT wage FROM RankStructure WHERE branch_id = ? AND rank_id = ?`, [branch_id, rank_id], (err, row) => {
            if (err) {
                res.status(500).send('Failed to get wage');
            } else {
                res.status(200).json(row);
            }
        });
    } else {
        db.all(`SELECT wage, rank_id FROM RankStructure WHERE branch_id = ?`, [branch_id], (err, rows) => {
            if (err) {
                res.status(500).send('Failed to get wages');
            } else {
                res.status(200).json(rows);
            }
        });
    }
});

// Make an endpoint for updating a wage for a rank
app.post('/branch/wages/update', (req, res) => {
    const { branch_id, rank_id, wage } = req.body;
    db.run(`UPDATE RankStructure SET wage = ? WHERE branch_id = ? AND rank_id = ?`, [wage, branch_id, rank_id], (err) => {
        if (err) {
            res.status(500).send('Failed to update wage');
        } else {
            res.status(200).send('Wage updated');
        }
    });
});

// Make an endpoint for deleting a branch
app.delete('/branch/delete', (req, res) => {
    const { branch_id } = req.body;
    db.run(`DELETE FROM Branch WHERE id = ?`, [branch_id], (err) => {
        if (err) {
            res.status(500).send('Failed to delete branch');
        } else {
            res.status(200).send('Branch deleted');
        }
    });
});

// Make an endpoint for deleting a rank
app.delete('/branch/rank/delete', (req, res) => {
    const { branch_id, rank_id } = req.body;
    db.run(`DELETE FROM RankStructure WHERE branch_id = ? AND rank_id = ?`, [branch_id, rank_id], (err) => {
        if (err) {
            res.status(500).send('Failed to delete rank');
        } else {
            res.status(200).send('Rank deleted');
        }
    });
});

// Make an endpoint for removing a member from a branch
app.post('/branch/member/remove', (req, res) => {
    const { branch_id, user_id } = req.body;
    db.run(`DELETE FROM BranchMembers WHERE branch_id = ? AND user_id = ?`, [branch_id, user_id], (err) => {
        if (err) {
            res.status(500).send('Failed to remove member');
        } else {
            res.status(200).send('Member removed');
        }
    });
});

// Make an endpoint for removing a user's points
app.post('/branch/points/remove', (req, res) => {
    const { branch_id, user_id, point_type } = req.body;
    db.run(`DELETE FROM BranchPoints WHERE branch_id = ? AND user_id = ? AND point_type = ?`, [branch_id, user_id, point_type], (err) => {
        if (err) {
            res.status(500).send('Failed to remove points');
        } else {
            res.status(200).send('Points removed');
        }
    });
});

app.get('/member/branch', (req, res) => {
    const { user_id } = req.query;
    db.get(`SELECT BranchMembers.branch_id, Branch.name, Branch.icon, Branch.shout, 
            (SELECT COUNT(*) FROM BranchMembers WHERE BranchMembers.branch_id = Branch.id) as memberCount,
            (SELECT user_id FROM BranchMembers WHERE BranchMembers.branch_id = Branch.id AND BranchMembers.rank_id = 12 LIMIT 1) as commander
            FROM BranchMembers 
            JOIN Branch ON BranchMembers.branch_id = Branch.id 
            WHERE BranchMembers.user_id = ?`, [user_id], (err, row) => {

        if (err) {
            res.status(500).send('Failed to get branch');
        } else {
            res.status(200).json(row);
        }
    });
});

// Make an endpoint for getting a branch's treasury
app.get('/branch/treasury/get', (req, res) => {
    const { branch_id } = req.query;
    db.get(`SELECT treasury FROM Branch WHERE id = ?`, [branch_id], (err, row) => {
        if (err) {
            res.status(500).send('Failed to get treasury');
        } else {
            res.status(200).json(row);
        }
    });
});

// Make an endpoint for updating a branch's treasury
app.post('/branch/treasury/update', (req, res) => {
    const { branch_id, treasury } = req.body;
    db.run(`UPDATE Branch SET treasury = ? WHERE id = ?`, [treasury, branch_id], (err) => {
        if (err) {
            res.status(500).send('Failed to update treasury');
        } else {
            res.status(200).send('Treasury updated');
        }
    });
});

// Make an endpoint for creating a detachment
app.post('/branch/detachment/create', (req, res) => {
    const { branch_id, name, abbreviation, r, g, b } = req.body;
    db.run(`INSERT INTO Detachment (branch_id, name, abbreviation, r, g, b) VALUES (?, ?, ?, ?, ?, ?)`, [branch_id, name, abbreviation, r, g, b], function (err) {
        if (err) {
            res.status(500).send('Failed to create detachment');
        } else {
            res.status(200).send({ message: 'Detachment created', id: this.lastID });
        }
    });
});

// Make an endpoint for getting a detachment
app.get('/branch/detachment/get', (req, res) => {
    const { detachment_id } = req.query;
    const sql = `
        SELECT Detachment.*, COUNT(BranchMembers.user_id) AS player_count
        FROM Detachment
        LEFT JOIN BranchMembers ON Detachment.id = BranchMembers.detachment_id
        WHERE Detachment.id = ?
        GROUP BY Detachment.id`;

    db.get(sql, [detachment_id], (err, row) => {
        if (err) {
            res.status(500).send('Failed to get detachment');
        } else {
            res.status(200).json(row);
        }
    });
});
// Make an endpoint for getting a branch's detachments along with the player count for each detachment
app.get('/branch/detachments/get', (req, res) => {
    const { branch_id } = req.query;
    const sql = `
        SELECT D.*, 
               (SELECT COUNT(*) FROM BranchMembers WHERE detachment_id = D.id) AS players
        FROM Detachment D
        WHERE D.branch_id = ?`;

    db.all(sql, [branch_id], (err, rows) => {
        if (err) {
            res.status(500).send('Failed to get detachments');
        } else {
            res.status(200).json(rows);
        }
    });
});

// Make an endpoint for updating a detachment
app.post('/branch/detachment/update', (req, res) => {
    const { detachment_id, name, abbreviation, r, g, b } = req.body;
    db.run(`UPDATE Detachment SET name = ?, abbreviation = ?, r = ?, g = ?, b = ? WHERE id = ?`, [name, abbreviation, r, g, b, detachment_id], (err) => {
        if (err) {
            res.status(500).send('Failed to update detachment');
        } else {
            res.status(200).send('Detachment updated');
        }
    });
});

app.delete('/branch/detachment/delete', (req, res) => {
    const { detachment_id } = req.body;

    // Step 1: Update users with the detachment_id
    db.run(`UPDATE BranchMembers SET detachment_id = -1 WHERE detachment_id = ?`, [detachment_id], (err) => {
        if (err) {
            res.status(500).send('Failed to update users');
            return;
        }

        // Step 2: Delete the detachment
        db.run(`DELETE FROM Detachment WHERE id = ?`, [detachment_id], (err) => {
            if (err) {
                res.status(500).send('Failed to delete detachment');
            } else {
                res.status(200).send('Detachment deleted and users updated');
            }
        });
    });
});

// Make an endpoint for getting a branch's members in a detachment, using
// a pagination structure
app.get('/branch/detachment/members/get', (req, res) => {
    const { branch_id, detachment_id, page, limit } = req.query;
    db.all(`SELECT * FROM BranchMembers WHERE branch_id = ? AND detachment_id = ? LIMIT ? OFFSET ?`, [branch_id, detachment_id, limit, page * limit], (err, rows) => {
        if (err) {
            res.status(500).send('Failed to get members');
        } else {
            res.status(200).json(rows);
        }
    });
});

// Make an endpoint to set a users detachment
app.post('/branch/member/detachment/set', (req, res) => {
    const { branch_id, user_id, detachment_id } = req.body;
    db.run(`UPDATE BranchMembers SET detachment_id = ? WHERE branch_id = ? AND user_id = ?`, [detachment_id, branch_id, user_id], (err) => {
        if (err) {
            res.status(500).send('Failed to set detachment');
        } else {
            res.status(200).send('Detachment set');
        }
    });
});

// Make an endpoint for adding a member to a detachment
app.post('/branch/detachment/member/add', (req, res) => {
    const { branch_id, user_id, rank_id, detachment_id, username } = req.body;
    db.run(`INSERT INTO BranchMembers (branch_id, user_id, rank_id, detachment_id, username) VALUES (?, ?, ?, ?, ?)`, [branch_id, user_id, rank_id, detachment_id, username], (err) => {
        if (err) {
            res.status(500).send('Failed to add member');
        } else {
            res.status(200).send('Member added');
        }
    });
});

// Make an endpoint for removing a member from a detachment
app.post('/branch/detachment/member/remove', (req, res) => {
    const { branch_id, user_id, detachment_id } = req.body;
    db.run(`DELETE FROM BranchMembers WHERE branch_id = ? AND user_id = ? AND detachment_id = ?`, [branch_id, user_id, detachment_id], (err) => {
        if (err) {
            res.status(500).send('Failed to remove member');
        } else {
            res.status(200).send('Member removed');
        }
    });
});

app.use(authorize);
app.listen(port, () => {
    console.log(`Branch app listening at http://localhost:${port}`);
});
