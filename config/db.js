import mysql from 'mysql2/promise';
const connection = {
  host: 'sql6.freesqldatabase.com',
  user: 'sql6702423',
  password: 'VQyiBeRKKj',
  database: 'sql6702423',
};
console.log(connection)
  const pool = mysql.createPool(connection);


  export default pool;