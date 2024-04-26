import mysql from 'mysql2/promise';
const connection = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'transcribe_ai',
};
console.log(connection)
  const pool = mysql.createPool(connection);


  export default pool;