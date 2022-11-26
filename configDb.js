import * as dotenv from 'dotenv';
dotenv.config();

export const configDb={
        host     : process.env.MYSQL_HOST || 'localhost',
        user     : process.env.MYSQL_USERNAME || 'root',
        password : process.env.MYSQL_PASSWORD || '',
        database : process.env.MYSQL_DATABASE || 'myreactsite'
}
console.log('adatbázis:',configDb.database,'-',configDb.host)