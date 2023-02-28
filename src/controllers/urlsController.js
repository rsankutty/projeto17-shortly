import { db } from "../database/database.js"
import { nanoid } from "nanoid";

export async function createShortUrl(req, res) {
  const { url } = req.body
  const userId = req.userId
	const shortUrl = nanoid(10)

  try {
    await db.query('INSERT INTO urls ("userId", url, "shortUrl") VALUES ($1, $2, $3);', [userId, url, shortUrl])

    const query = await db.query('SELECT id,"shortUrl" FROM urls WHERE url = $1 AND "userId" = $2;', [url,userId])

    res.status(201).send({id: query.rows[0].id, shortUrl: query.rows[0].shortUrl})
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function getShortUrl(req, res) {
  const {id} = req.params

  try {
    const query = await db.query('SELECT id,"shortUrl",url FROM urls WHERE id = $1;', [id])

    if (query.rows.length==0) return res.sendStatus(404)

    res.status(200).send({id: query.rows[0].id, shortUrl: query.rows[0].shortUrl, url: query.rows[0].url})

  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function openShortUrl(req, res) {
  const { shortUrl } = req.params

  try {
    const query = await db.query('SELECT url,"visitCount" FROM urls WHERE "shortUrl" = $1;', [shortUrl])

    if (query.rows.length==0) return res.sendStatus(404)

    await db.query(
      `UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2`,[Number(query.rows[0].visitCount) + 1, shortUrl])

    return res.redirect(query.rows[0].url)

  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function deleteShortUrl(req, res) {
  const { id } = req.params
  const userId = req.userId

  try {
    const query = await db.query('SELECT "userId" FROM urls WHERE id = $1;', [id])

    if (query.rows.length==0) return res.sendStatus(404)

    if (query.rows[0].userId != userId) return res.sendStatus(401)

    await db.query(
      `DELETE FROM urls WHERE id = $1`,[id])

    res.sendStatus(204)

  } catch (err) {
    res.status(500).send(err.message)
  }
}