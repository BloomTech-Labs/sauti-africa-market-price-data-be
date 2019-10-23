exports.up = function(knex) {
  return knex.schema.createTable('apiKeys', tbl => {
    tbl.increments()
    tbl
      .text('key', 128)
      .unique()
      .notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('apiKeys')
}
