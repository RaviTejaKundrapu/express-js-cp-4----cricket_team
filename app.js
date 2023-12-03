const express = require('express')

const app = express()
module.exports = app
app.use(express.json())

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const path = require('path')
const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeServerAndDb = async () => {
  try {
    db = await open({filename: dbPath, driver: sqlite3.Database})
    app.listen(3000, () => {
      console.log('Server is Running')
    })
  } catch (error) {
    console.log(`Db Error: ${error.message}`)
    process.exit(1)
  }
}

initializeServerAndDb()

//API 1 : Returns All Players
app.get('/players/', async (request, response) => {
  const getAllPlayersQuery = `SELECT * FROM cricket_team ORDER BY player_id;`
  const allPlayersArray = await db.all(getAllPlayersQuery)
  response.send(allPlayersArray)
})

//API 2 : Create a Player
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addPlayerQuery = `INSERT INTO cricket_team(player_name,jersey_number,role)
  VALUES(
    '${playerName}',
    ${jerseyNumber},
   '${role}'
  );`
  const addPlayer = await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})
//API 3 : Return Player By player_id
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerByIdQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`
  const getplayerIdDb = await db.get(getPlayerByIdQuery)
  response.send(getplayerIdDb)
})

//API 4 : Update Player Details By id
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `
  UPDATE cricket_team 
  SET 
  player_name='${playerName}',
  jersey_number=${jerseyNumber},
  role='${role}'
  WHERE player_id=${playerId};`
  const updatePlayer = await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

//API 5 : Delete Player By player_id
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerByIdQuery = `DELETE FROM cricket_team WHERE player_id=${playerId};`
  const DeletePlayerInDb = await db.run(getPlayerByIdQuery)
  response.send('Player Removed')
})
