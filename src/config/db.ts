import knex from 'knex';

export enum Tables {
  PAGES = 'pages',
}

export default knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
})
