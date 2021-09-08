const { test } = require('picomatch')
const { client, getAllUsers, createUser } = require('./index')
​
// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    await client.query(`
        DROP TABLE IF EXISTS users;
      `)
​
    console.log('Dropped users table')
  } catch (error) {
    throw error // we pass the error up to the function that calls dropTables
  }
}
​
// this function should call a query which creates all tables for our database
async function createTables() {
  try {
    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
        );
      `)
​
    console.log('Created users table')
  } catch (error) {
    throw error 
    // we pass the error up to the function 
    // that calls createTables
  }
}
​
async function insertUsers() {
  try {
    let user1 = { 
      username: 'albert', 
      password: 'bertie99', 
      name: 'Albert Bert', 
      location: 'Bert Island',
      active: true 
    }
    let user2 = { 
      username: 'sandra', 
      password: '2sandy4me', 
      name: 'Sandra Sandy', 
      location: 'Sand Island',
      active: true 
    }
    let user3 = { 
      username: 'glamgal', 
      password: 'soglam', 
      name: 'Sogla Gogla', 
      location: 'SoglaGogilian',
      active: true 
    }
​
    const result1 = await createUser(user1)
    // console.log('User 1 result: ', result1)
    await createUser(user2)
    await createUser(user3)
​
    console.log('Inserted users...')
  } catch (error) {
    console.error('Error creating initial users', error)
  }
}
​
async function rebuildDB() {
  await dropTables()
  await createTables()
  await insertUsers()
}
​async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const result = await client.query(`
      UPDATE users
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return result;
  } catch (error) {
    throw error;
  }
}
// rebuildDB()
​
async function testDB() {
  const rows = await getAllUsers()
  //   let { rows } = result  OR result.rows
  console.log('rows', rows)
}
​
async function run() {
  try {
    client.connect()
    await rebuildDB()
    await testDB()
  } catch (error) {
    console.error(error)
  } finally {
    client.end()
  }
}
​ 
run()