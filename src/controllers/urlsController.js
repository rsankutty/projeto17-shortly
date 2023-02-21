import { db } from "../database/database.js"

export async function listGames(req, res) {
  try {
    const games = await db.query("SELECT * FROM games")
    res.send(games.rows)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function registerGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body

  const registeredGame = await db.query(`SELECT * FROM games WHERE name = '${name}'`)

  if (registeredGame.rows.length != 0) return res.status(409).send('Game already registered')

  try {
    await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ('${name}', '${image}', '${stockTotal}', '${pricePerDay}')`)
    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}