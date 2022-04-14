const oracledb = require("oracledb");
const express = require('express');

// Initialize App
const app = express();

// Assign route
app.use('/', (req, res, next) => {
res.render('index.pug');
});

app.listen(5000, () => {
console.log('App listening on port 5000');
});
//const app = oracledb();
//import oracledb from "C:/Users/3716s/AppData/Local/Microsoft/TypeScript/4.6/node_modules/@types/oracledb/index";
//import oracledb from "oracledb";

async function run() {

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });

    console.log("Successfully connected to Oracle Database");

    // Create a table

    await connection.execute(`begin
                                execute immediate 'drop table student';
                                exception when others then if sqlcode <> -942 then raise; end if;
                              end;`);

    await connection.execute(`create table student(std_name varchar(50), ID int)`);

    // Insert some data

    const sql = `insert into student values(:1, :2)`;

    const rows =
          [ ["Mrugen", 3 ],
            ["Darshi", 4 ] ];

    let result = await connection.executeMany(sql, rows);

    console.log(result.rowsAffected, "Rows Inserted");

    connection.commit();

    // Now query the rows back

    result = await connection.execute(
      `select * from student`,
      [],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    const rs = result.resultSet;
    let row;

    while ((row = await rs.getRow())) {
      
      console.log(row.STD_NAME, "has ID = ", row.ID);
    }

    await rs.close();

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

//f1();
run();