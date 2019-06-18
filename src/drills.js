require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})



function searchByProductName(searchTerm) {
  knexInstance
    .select('id AS Product ID', 'name', 'price', 'category')
    // just for fun wanted to play with column names
    .from('shopping_list')
    .where(
      'name',
      'ILIKE',
      `%${searchTerm}%`
    )
    .then(result => console.log(`Your results are:`, result))
}

searchByProductName('steak')

function paginateResults(pageNumber) {
  const productsPerPage = 6
  const offset = productsPerPage * (pageNumber - 1)
  knexInstance
    .select('id AS Prod ID', 'name', 'price AS Current Price', 'category')
    // again, playing with column names in the return
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => console.log(`Your matching results are`, result))
}

paginateResults(2)

function getRecentItems(daysAgo) {
  knexInstance
    .select('name', 'price', 'category', 'date_added')
    .count('date_added')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .groupBy('name', 'price', 'category','date_added')
    .orderBy([
      { column: 'name', order: 'ASC'},
      { column: 'date_added', order: 'DESC'}
    ])
    .then(result => console.log(result))
}

// getRecentItems(2);

function getTotalCost() {
  knexInstance
    .select('category')
    .sum('price AS Total Price')
    .from('shopping_list')
    .groupBy('category')
    .orderBy([
      { column: 'category', order: 'ASC'},
    ])
    .then(result => console.log(result))
}
getTotalCost();
