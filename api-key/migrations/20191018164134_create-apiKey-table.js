exports.up = function(knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    .createTable("apiKeys", tbl => {
      tbl.increments();
      tbl
        .text("key", 128)
        .unique()
        .notNullable();
      tbl
        .text("user_id")
        .unique()
        .notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("apiKeys");
};
