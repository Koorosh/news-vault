import knex from 'knex';

export enum Tables {
  PAGES = 'pages',
}

export default knex({
  client: process.env.DB_CLIENT,
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
  }
})
