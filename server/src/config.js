
const serverDB = {
  client: 'mysql',
  connection: {
    host : process.env.MYSQL_HOST,
    port : process.env.MYSQL_PORT,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
  },
}

const devDB = {
  client: 'mysql',
  connection: {
    host : 'admin.hello.com',
    port : 3306,
    user : 'root',
    password : 'password',
    database : 'database'
  },
}

export default {
  db: __dirname.indexOf('/data') == 0 ? serverDB : devDB,
}
