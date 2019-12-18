exports.up = function(knex) {
  return knex.schema.createTable('apiKeys', tbl => {
    tbl.increments()
    tbl
      .text('key', 128)
      .unique()
      .notNullable()
    tbl
      .text('user_id')
      .unique()
      .notNullable()
    tbl
      .date('date_generated')
      .notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('apiKeys')
}

/*
* added date_generated column
* added logic to create a new date and write to
  table so that we can calculate quota reset in Apikeyroute

* algorithm for calculating dates: 
  1) get date generated (in milliseconds) from table
  2) get today's date in milliseconds
  3) 
    todays_date - date generated --> yeilds differential in milliseconds

    dateRange = differential/1000*60*60*24

    if dateRange > 30, reset count in redis






*/