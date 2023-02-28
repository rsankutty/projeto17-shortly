import { db } from "../database/database.js"

export async function validateToken(req, res, next) {

  try {
    const token = req.headers.authorization.replace("Bearer ", "")
    const session = await db.query(`SELECT "userId" FROM sessions WHERE token = $1`, [token])

    if(session.rows.length === 0) return res.sendStatus(401)
    req.userId = session.rows[0].userId

  } catch (err) {
    res.sendStatus(401)
  }

  next()
}