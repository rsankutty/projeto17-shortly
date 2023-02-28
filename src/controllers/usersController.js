import { db } from '../database/database.js';

export async function getUserInfo(req, res) {
	const userId = req.userId
  
	try {
	  const query = await db.query(
		`WITH cte AS (
			SELECT 
					users.id,
					users.name,
					SUM(urls."visitCount") AS "totalCount" 
				FROM 
					users 
				JOIN urls ON urls."userId" = users.id
				WHERE 
					users.id = $1
				GROUP BY users.id
		)
		SELECT cte.*,urls.id AS "urlsId",urls.url,urls."shortUrl",urls."visitCount" FROM cte LEFT JOIN urls ON urls."userId" = cte.id;
		`,
		[userId]
	  )

	  const shortenedUrls = query.rows.map(i =>({
		id: i.urlsId,
		shortUrl: i.shortUrl,
		url: i.url,
		visitCount: i.visitCount
	  }))
	  
	  const body = {
		id:query.rows[0].id,
		name:query.rows[0].name,
		visitCount:query.rows[0].totalCount,
		shortenedUrls:shortenedUrls
	  }
	  res.status(200).send(body)
  
	} catch (err) {
	  res.status(500).send(err.message)
	}
  }

  export async function getRanking(req, res) {
    try {
        const query = await db.query(
            `
            SELECT 
                users.id,
                users.name,
                COUNT(urls.id) AS "linksCount",
                SUM(urls.visitCount) AS "visitCount"
            FROM users
            LEFT JOIN urls ON users.id = urls.userId 
            GROUP BY users.id
            ORDER BY "visitCount" DESC
            LIMIT 10;          
            `
        )

        return res.status(200).send(query.rows)

    } catch (err) {
        return res.status(500).send(err.message)
    }
}