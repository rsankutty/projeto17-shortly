import { db } from "../database/database.js"
import bcrypt from 'bcrypt'
import { nanoid } from "nanoid";

export async function signUp(req, res) {
  const { name, email, password } = req.body
  const encryptedPassword = bcrypt.hashSync(password, 10)
  try {
    await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3);', [name, email, encryptedPassword])
    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}


export async function signIn(req, res) {
  const { email, password } = req.body

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email])
    console.log(user.rows[0].id)

    const comparePassword = await bcrypt.compare(password, user.rows[0].password)
    if (!comparePassword) return res.sendStatus(401)

    const userToken = await db.query('SELECT token FROM sessions WHERE "userId" = $1', [user.rows[0].id])

    const token = nanoid()

    if (userToken.rows.length != 0) {
      console.log('update')
      await db.query(`
        UPDATE 
          sessions
        SET 
          token = $2
        WHERE 
          "userId" = $1;`, [user.rows[0].id, token])

      return res.status(200).send({ token })
    }
    console.log('create')
    await db.query('INSERT INTO sessions ("userId", token) VALUES ($1, $2);', [user.rows[0].id, token])

    res.status(200).send({ token })

  } catch (err) {
    return res.status(500).send(err.message)
  }
}