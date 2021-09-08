// Importing pg Client
​
const { Client } = require('pg')
​
// connect to the db server
​
const client = new Client('postgres://localhost:5432/juicebox-dev')
​
async function getAllUsers() {
  const { rows } = await client.query(`SELECT * FROM users;`)
  return rows
}
​
/*
    When createUser is called, its actually expecting an OBJECT
    im destructuring username and password from that object that comes in
​
    ex:
        user = { username: 'travis', password: '123'}
        createUser(user)
*/
​
async function createUser({ 
  username, 
  password,
  name,
  location
 }) {
  try {
    const { rows } = await client.query(
      `
        INSERT INTO users (username, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [username, password, name, location]
    )
​
    return rows[0]
  } catch (error) {
    throw error
  }
}
​
// export for use in other files
module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser
}