import { db } from '../database/database.js';

export async function listRentals(req, res) {
	try {
		const rentals = await db.query(
			`
		SELECT 
			rentals.* ,
			games.name AS "gameName",
			customers.name AS "customerName" 
		FROM 
			rentals 
		JOIN games ON games.id= "gameId"
		JOIN customers ON customers.id = "customerId"
		`
		);

		const rentalsRes = rentals.rows.map(item => ({
			id: item.id,
			customerId: item.customerId,
			gameId: item.gameId,
			rentDate: item.rentDate,
			daysRented: item.daysRented,
			returnDate: item.returnDate,
			originalPrice: item.originalPrice,
			delayFee: item.delayFee,
			customer: {
				id: item.customerId,
				name: item.customerName
			},
			game: {
				id: item.gameId,
				name: item.gameName
			}
		}))

		return res.send(rentalsRes);
	} catch (err) {
		res.status(500).send(err.message);
	}
}

export async function registerRental(req, res) {
	const { customerId, gameId, daysRented } = req.body
	const rentDate = dayjs(Date.now()).format('YYYY-MM-DD')
	try {
		const games = await db.query(`SELECT "pricePerDay","stockTotal" FROM games WHERE id = '${gameId}'`);
		const registeredCustomer = await db.query(`SELECT * FROM customers WHERE id = '${customerId}'`);

		if (registeredCustomer.rows.length == 0 || games.rows.length == 0) return res.sendStatus(400);

		const originalPrice = daysRented * games.rows[0].pricePerDay;
		console.log(originalPrice)

		const totalRentals = await db.query(`SELECT COUNT("gameId") AS "gameCount" FROM rentals WHERE "gameId"='${gameId}'`);

		if (totalRentals.rows[0].gameCount >= games.rows[0].stockTotal) return res.status(400).send('Insuficient stock');

		await db.query(
			`
		INSERT INTO 
		  rentals (
			"customerId", "gameId", "rentDate", "daysRented", "originalPrice"
		  ) 
		  VALUES (
			'${customerId}','${gameId}','${rentDate}','${daysRented}','${originalPrice}'
		  )
		`);

		res.sendStatus(201)

	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function closeRental(req, res) {
	const { id } = req.params;

	try {
		const rental = await db.query(`
			SELECT 
				rentals.*, 
				"pricePerDay" 
			FROM 
				rentals 
			JOIN 
				games ON games.id = "gameId" 
			WHERE 
				rentals.id = ${id}`);

		const returnDate = dayjs(Date.now())

		if (rental.rows.length == 0) return res.sendStatus(404);
		if (rental.rows[0].returnDate != null) return res.status(400).send('Rent already finished');

		const rentedDays = returnDate.diff(dayjs(rental.rows[0].rentDate), 'day');
		const delay = rentedDays - rental.rows[0].daysRented

		if (delay > 0) {
			const delayFee = delay * rental.rows[0].pricePerDay
			console.log(rentedDays,delay,delayFee)
			await db.query(`
				UPDATE 
					rentals 
				SET 
					"delayFee" = '${delayFee}', 
					"returnDate" = '${returnDate.format('YYYY-MM-DD')}'
				WHERE id = ${id}`);
		} else {
			await db.query(`
				UPDATE 
					rentals 
				SET 
					"returnDate" = '${returnDate.format('YYYY-MM-DD')}'
				WHERE id = ${id}`);
		}
		res.sendStatus(200);
	} catch (err) {
		res.status(500).send(err.message)
	}
}


export async function deleteRental(req, res) {
	const { id } = req.params;

	const rental = await db.query(`SELECT * FROM rentals WHERE id = ${id}`);

	if (rental.rows.length == 0)
		return res.status(404).send('Rent does not exist');

	if (rental.rows[0].returnDate == null)
		return res.status(400).send(`This rent has not been closed`);

	await db.query(`DELETE FROM rentals WHERE id = ${id}`);

	res.sendStatus(200);
}