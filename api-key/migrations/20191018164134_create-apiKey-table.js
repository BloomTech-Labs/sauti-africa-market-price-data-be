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
      .date('reset_start')
      .notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('apiKeys')
}

