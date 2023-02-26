import { db } from "../database/database.js"

export async function validateUser(req, res, next) {
  const { email } = req.body
  const { path } = req.route;

  try {
    const registeredCustomer = await db.query("SELECT * FROM users WHERE email = $1", [email])

    if (path == "/signup") {
      if (registeredCustomer.rows.length != 0) return res.sendStatus(409)
    }
    else if (path == "/signin") {
      if (registeredCustomer.rows.length == 0) return res.sendStatus(401)
    }

  } catch (err) {
    res.status(500).send(err.message)
  }

  next()
}