const mysql = require("mysql");

function DB() {
    let connectionDB = mysql.createConnection({
        database: "games",
        host: "localhost",
        user: "root",
        password: "root"
    });

    connectionDB.connect(err => {
        if (err) {
            return console.error("ERROR: " + err.message);
        } else {
            console.log("DB is connected...");
        }
    })

    this.getGenres = async () => {
        return await new Promise(resolve => {
            connectionDB.query(`SELECT * FROM genres ORDER BY id DESC`, (err, values) => {
                resolve(values);
            });
        });
    }

    this.getBasketGames = async ({id}) => {
        let queryArr = [];
        for (let gameId of id.split(",")) {
            queryArr.push(`id="${gameId}"`);
        }


        return await new Promise(resolve => {
            connectionDB.query(`SELECT * FROM games WHERE ${queryArr.join(` OR `)}`, (err, values) => {
                resolve(values);
            })
        })
    }

    this.getGames = async ({genre, searchTitle, price, rating, size, position}) => {
        let sort = "";
        let search = [];

        if(genre && genre !== "8") { search.push(`genre="${genre}"`) }
        if(searchTitle) { search.push(`title="${searchTitle}"`) }
        if(search.length) { search = "WHERE " + search.join(" AND ") }

        if(price) { sort = "ORDER BY price" + (price === "down" ? " DESC" : "") }
        if(rating) { sort = "ORDER BY rating" + (rating === "down" ? " DESC" : "") }


        return await new Promise(resolve => {
            connectionDB.query(`SELECT * FROM games ${search} ${sort} LIMIT ${size} OFFSET ${position || 0}`, (err, values) => {
                connectionDB.query(`SELECT COUNT(*) as count FROM games ${search} ${sort}`, (err, count) => {
                    resolve({values, count: count[0].count});
                });
            });
        });
    }

}

module.exports = new DB();