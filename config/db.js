import mysql from 'mysql2/promise';
const connection = {
  host: 'sql6.freesqldatabase.com',
  user: 'sql6704225',
  password: 'WcCquLMmeD',
  database: 'sql6704225',
};
(connection)
  const pool = mysql.createPool(connection);


  export default pool;