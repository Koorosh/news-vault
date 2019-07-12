const tableName = 'pages'

exports.up = function(knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments()
    t.string('url')
      .notNullable()
      .index()
    t.jsonb('content')
    t.timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable(tableName)
};


