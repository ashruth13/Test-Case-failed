const express = require("express");
const app = express();
const path = require("path");
const dbpath = path.join(__dirname, "cricketTeam.db");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;
app.use(express.json());
const initializeserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Started");
    });
  } catch (e) {
    console.log(`${e.message}`);
    process.exit(1);
  }
};

initializeserver();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const list = `select * from cricket_team`;
  const arr = await db.all(list);
  response.send(
    arr.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const eachque = `select * from cricket_team where player_id = ${playerId};`;
  const det = await db.get(eachque);
  response.send(convertDbObjectToResponseObject(det));
});

app.post("/players/", async (request, response) => {
  const body = request.body;
  const { playerName, jerseyNumber, role } = body;
  const addquery = `insert into cricket_team (player_name,jersey_number,role) values ("${playerName}",${jerseyNumber},"${role}");`;
  const resp = await db.run(addquery);
  response.send("Player Added to Team");
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const upq = `update cricket_team set player_name = "${playerName}",
    jersey_number = "${jerseyNumber},role="${role}" where player_id = ${playerId}`;
  await db.run(upq);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { bookId } = request.params;
  const deleteB = `delete from cricket_team where player_id = ${bookId}`;
  await db.run(deleteB);
  response.send("Player Removed");
});

// app.put("/players/:playerId/", async (request, response) => {
//   const { playerId } = request.params;
//   const { pName, jNumber, ro } = request.body;
//   const upquery = `
//   UPDATE
//     cricket_team
//   SET
//     player_name = "${pName}",
//     jersey_number = ${jNumber},
//     role = "${ro}"
//   WHERE
//     player_id = ${playerId};`;

//   await db.run(upquery);
//   response.send("Player Details Updated");
// });

// app.delete("/player/:playerId/", async (request, response) => {
//   const { playerId } = response.params;
//   const delquer = `DELETE from cricket_team where player_id = ${playerId};`;
//   await db.run(delquer);
//   response.send("Player Removed");
// });

module.exports = app;
