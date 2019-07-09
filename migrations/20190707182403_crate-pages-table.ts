import * as Knex from 'knex'

const tableName = 'pages'

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable(tableName, (t) => {
    t.increments()
    t.string('url')
      .notNullable()
      .index()
    t.jsonb('content')
    t.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTable(tableName)
}

