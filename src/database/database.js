const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/database/users.sqlite3');
const tableName = 'users';

function addNewUser(payload) {
    db.serialize(() => {
        let sqlGet = `SELECT id FROM ${tableName} WHERE id = ?`;
        let sqlInsert = `INSERT INTO ${tableName} (id, first_name, username, date1, date2)
                                 VALUES ("${payload.from.id}", "${payload.from.first_name}", "${payload.from.username}",
                                         "${payload.date}", "${payload.date}")`;
        const userId = payload.from.id;

        db.get(sqlGet, [userId], (err, row) => {
            if (!err && !row) {
                db.run(sqlInsert);
            }
        });
    });
    db.close();
}

function getUserList(resolve, reject) {
    db.serialize(() => {
        let recordsList = [];
        db.each(`SELECT * FROM ${tableName}`, (err, row) => {
            recordsList.push(row);
        }, () => {
            // db.close(); - не надо (почему?)
            resolve(recordsList);
        });
    });
}

module.exports = { addNewUser, getUserList }