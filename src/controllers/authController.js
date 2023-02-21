import { db } from "../database/database.js";

export async function listCustomers(req, res) {
  try {
    const customers = await db.query('SELECT * FROM customers')
    res.send(customers.rows)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params

  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id = ${id}`)

    if (customer.rows.length == 0) res.sendStatus(404)

    res.send(customer.rows[0])
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function registerCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body

  const registeredCustomer = await db.query(`SELECT * FROM customers WHERE cpf = '${cpf}'`)

  if (registeredCustomer.rows.length != 0) return res.status(409).send('Customer already registered')

  try {
    await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${name}', '${phone}', '${cpf}', '${birthday}')`)
    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function updateCustomer(req, res) {
  const {id} = req.params
  const {name, phone, cpf, birthday} = req.body

  try {
    const registeredCpf = await db.query(`SELECT * FROM customers WHERE cpf = '${cpf}'`)

    if (registeredCpf.rows.length != 0 && registeredCpf.rows[0].id != id) return res.status(409).send('cpf already registered')

    await db.query(`UPDATE customers SET name = '${name}', phone = '${phone}', cpf = '${cpf}', birthday = '${birthday}' WHERE id = '${id}'`)

    res.sendStatus(200)
  } catch (err) {
    res.status(500).send(err.message)
  }
}