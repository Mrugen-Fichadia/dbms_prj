const oracledb = require("oracledb");


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
            ["Hari", 4 ] ];

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

//run();


async function create_tables() {

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });

    console.log("Successfully connected to Oracle Database");

    // Create a table
/*
    await connection.execute(`create table airport (airport_name varchar(100) primary key,city varchar(50),state varchar(50),hanger_capacity int, no_of_terminal int)`);

    await connection.execute(`CREATE TABLE administrative (employee_id varchar(150), work varchar(100))`);
    
    await connection.execute(`CREATE TABLE airport_airlines (airline_id int, name varchar(100), no_of_planes varchar(50), PRIMARY KEY (airline_id))`);

    await connection.execute(`CREATE TABLE airport_authority (employee_id varchar(100), employee_role varchar(100))`);

    await connection.execute(`CREATE TABLE airport_city (city_name varchar(50), state varchar(50) , country varchar(50), PRIMARY KEY (city_name,state))`);

    await connection.execute(`CREATE TABLE airport_contains ( airport_name varchar(100), airline_id int, PRIMARY KEY (airport_name, airline_id))`);

    await connection.execute(`CREATE TABLE airport_service( service_date date, plane_id int, cost int,PRIMARY KEY (service_date))`);

    await connection.execute(`CREATE TABLE airport_ticket(ticket_id int, flight_code varchar(150), passenger_id int, passport_number int,book_date date , class varchar(50) , seat_no int , price int, corporate varchar(3) , PRIMARY KEY (ticket_id))`);

    await connection.execute(`CREATE TABLE employee(employee_id varchar(150) , first_name varchar(150) , middle_name varchar(150) , last_name varchar(150) , airport_name varchar(200) , address_street varchar(200) , city varchar(50) , state varchar(50) , phone_number int, gender varchar(50) , job_type varchar(100) ,salary int, PRIMARY KEY (employee_id))`);

    await connection.execute(`CREATE TABLE employee_to_passenger_serve (passenger_id int, employee_id varchar(150))`);

    await connection.execute(`CREATE TABLE engineer ( employee_id varchar(100), type varchar(100))`);

    await connection.execute(`CREATE TABLE flight ( flight_code varchar(150) , to_destination varchar(150) , from_depature varchar(150) , plane_id int, arrival_time int, arrival_date int, depature_date int, depature_time int, airline_id int, PRIMARY KEY (flight_code))`);

    //await connection.execute(`drop table illegeal_offense_table`);
    await connection.execute(`CREATE TABLE illegal_offense( passenger_id int primary key, offense varchar(50), action_taken varchar(50) , cop_name varchar(50))`);
    //await connection.execute(`insert into illegal_offense values( 1113, 'carrying gun', 'jailed', 'S.Dave')`);

    await connection.execute(`CREATE TABLE passenger ( passenger_id int, passport_number int, PRIMARY KEY (passenger_id))`);

    await connection.execute(`CREATE TABLE passenger_1 ( passenger_id int,  first_name varchar(150) , middle_name varchar(150) , last_name varchar(150) , street varchar(150) , city varchar(100) , date_of_birth int, flight_code varchar(150) , PRIMARY KEY (passenger_id))`);

    await connection.execute(`CREATE TABLE passenger_2 ( passport_number int, first_name varchar(150), middle_name varchar(150) , last_name varchar(150) , PRIMARY KEY (passport_number))`);

    await connection.execute(`CREATE TABLE plane ( plane_id int, airline_id int, capacity int, name varchar(150) , type varchar(100) , service_date date , PRIMARY KEY (plane_id))`);

    await connection.execute(`CREATE TABLE ticket_cancelled ( ticket_id int, ticket_charge int, date_of_cancel date )`);

    await connection.execute(`CREATE TABLE traffic_manager ( employee_id varchar(100) , shift varchar(70) )`);


    await connection.execute(`ALTER TABLE administrative
  ADD CONSTRAINT administrative_ibfk_1 FOREIGN KEY (employee_id) REFERENCES employee (employee_id)`);

    await connection.execute(`ALTER TABLE airport
  ADD CONSTRAINT airport_ibfk_1 FOREIGN KEY (city,state) REFERENCES airport_city (city_name,state)`);

    await connection.execute(`ALTER TABLE airport_authority
  ADD CONSTRAINT airport_authority_ibfk_1 FOREIGN KEY (employee_id) REFERENCES employee (employee_id)`);

    await connection.execute(`ALTER TABLE airport_contains
  ADD CONSTRAINT airport_contains_ibfk_1 FOREIGN KEY (airport_name) REFERENCES airport (airport_name)`);

    await connection.execute(`ALTER TABLE airport_contains
  ADD CONSTRAINT airport_contains_ibfk_2 FOREIGN KEY (airline_id) REFERENCES airport_airlines (airline_id)`);

    await connection.execute(`ALTER TABLE airport_service
  ADD CONSTRAINT airport_service_ibfk_1 FOREIGN KEY (plane_id) REFERENCES plane (plane_id)`);

    await connection.execute(`ALTER TABLE airport_ticket
  ADD CONSTRAINT airport_ticket_ibfk_1 FOREIGN KEY (passenger_id) REFERENCES passenger (passenger_id)`);

    await connection.execute(`ALTER TABLE airport_ticket
  ADD CONSTRAINT airport_ticket_ibfk_2 FOREIGN KEY (passport_number) REFERENCES passenger_2 (passport_number)`);

    await connection.execute(`ALTER TABLE airport_ticket
  ADD CONSTRAINT airport_ticket_ibfk_3 FOREIGN KEY (flight_code) REFERENCES flight (flight_code)`);

    await connection.execute(`ALTER TABLE employee
  ADD CONSTRAINT employee_ibfk_1 FOREIGN KEY (airport_name) REFERENCES airport (airport_name)`);

    await connection.execute(`ALTER TABLE employee_to_passenger_serve
  ADD CONSTRAINT employee_to_passenger_serve_ibfk_1 FOREIGN KEY (employee_id) REFERENCES employee (employee_id)`);

    await connection.execute(`ALTER TABLE employee_to_passenger_serve
  ADD CONSTRAINT employee_to_passenger_serve_ibfk_2 FOREIGN KEY (passenger_id) REFERENCES passenger (passenger_id)`);

    await connection.execute(`ALTER TABLE engineer
  ADD CONSTRAINT engineer_ibfk_1 FOREIGN KEY (employee_id) REFERENCES employee (employee_id)`);

    await connection.execute(`ALTER TABLE flight
  ADD CONSTRAINT flight_ibfk_1 FOREIGN KEY (airline_id) REFERENCES airport_airlines (airline_id)`);

    await connection.execute(`ALTER TABLE flight
  ADD CONSTRAINT flight_ibfk_2 FOREIGN KEY (plane_id) REFERENCES plane (plane_id)`);

    await connection.execute(`ALTER TABLE illegeal_offense
  ADD CONSTRAINT illegeal_offense_ibfk_1 FOREIGN KEY (passenger_id) REFERENCES passenger (passenger_id)`);

    await connection.execute(`ALTER TABLE passenger
  ADD CONSTRAINT passenger_ibfk_1 FOREIGN KEY (passport_number) REFERENCES passenger_2 (passport_number)`);

    await connection.execute(`ALTER TABLE passenger_1
  ADD CONSTRAINT passenger_1_ibfk_1 FOREIGN KEY (passenger_id) REFERENCES passenger (passenger_id)`);

    await connection.execute(`ALTER TABLE passenger_1
  ADD CONSTRAINT passenger_1_ibfk_3 FOREIGN KEY (flight_code) REFERENCES flight (flight_code)`);

    await connection.execute(`ALTER TABLE plane
  ADD CONSTRAINT plane_ibfk_1 FOREIGN KEY (airline_id) REFERENCES airport_airlines (airline_id)`);

    await connection.execute(`ALTER TABLE plane
  ADD CONSTRAINT plane_ibfk_2 FOREIGN KEY (service_date) REFERENCES airport_service (service_date)`);

    await connection.execute(`ALTER TABLE ticket_cancelled
  ADD CONSTRAINT ticket_cancelled_ibfk_1 FOREIGN KEY (ticket_id) REFERENCES airport_ticket (ticket_id)`);

    await connection.execute(`ALTER TABLE traffic_manager
  ADD CONSTRAINT traffic_manager_ibfk_1 FOREIGN KEY (employee_id) REFERENCES employee (employee_id)`);
*/
    //Insert some data
/*
    const sql = `INSERT INTO airport_city VALUES (:1, :2, :3)`;

    const rows = [
      ['Ahmedabad', 'Gujarat', 'India'],
      ['Bengaluru', 'Karnataka', 'India'],
      ['Hyderabad', 'Telangana', 'India'],
      ['Surat', 'Gujarat', 'India'],
      ['Visakhapatnam', 'Andhra Pradesh', 'India']
    ];

    const sql = `INSERT INTO airport VALUES(:1, :2, :3, :4, :5)`;

    const rows = [
      ['Kempegowda_International_Airport', 'Bengaluru', 'Karnataka', '45', '3'],
      ['Rajiv_Gandhi_International_Airport', 'Hyderabad', 'Telangana', '40', '3'],
      ['Sardar_Vallabhbhai_Patel_International_Airport', 'Ahmedabad', 'Gujarat', '40', '3'],
      ['Surat_International_Airport', 'Surat', 'Gujarat', '50', '3'],
      ['Visakhapatnam_Airport', 'Visakhapatnam', 'Andhra Pradesh', '40', '4']
    ];


    const sql = `INSERT INTO airport_airlines VALUES (:1, :2, :3)`;

    const rows = [
      ['11', 'Rajiv_Gandhi_International_Airport', '4'],
      ['22', 'Kempegowda_International_Airport', '3'],
      ['33', 'Sardar_Vallabhbhai_Patel_International_Airport', '6'],
      ['44', 'Surat_International_Airport', '5'],
      ['55', 'Visakhapatnam_Airport', '3']
    ];

    
    const sql = `INSERT INTO employee VALUES (:1, :2, :3,:4,:5,:6,:7,:8,:9,:10,:11,:12)`;

    const rows = [
      ['111', 'Hritik', 'R', 'Roshan', 'Rajiv_Gandhi_International_Airport', 'Hyderabad', 'Hyderabad', 'Telangana', 111, 'Male', 'Pilot', 100000],
      ['222', 'Mrugen', '.', 'Fichadia', 'Surat_International_Airport', 'Surat', 'Surat', 'Gujarat', 222, 'Male', 'Co-pilot', 85000],
      ['333', 'Shraddha', 'S', 'Kapoor', 'Sardar_Vallabhbhai_Patel_International_Airport', 'Bopal', 'Ahmedabad', 'Gujarat', 333, 'Female', 'Hostess', 75000],
      ['444', 'Vatsal', '.', 'Barai', 'Kempegowda_International_Airport', 'Benglore', 'Bengaluru', 'Karnataka', 444, 'Male', 'Host', 70000]
    ];
  
    
    const sql = `INSERT INTO plane VALUES(:1, :2, :3,:4,:5,:6)`;

    const rows = [
      ['1', '11', 40, 'Rajiv_Gandhi_International_Airport', 'Internatioinal', null],
      ['2', '22', 45, 'Kempegowda_International_Airport', 'National',null],
      ['3', '33', 40, 'Sardar_Vallabhbhai_Patel_International_Airport', 'International_National', null],
      ['4', '44', 50, 'Surat_International_Airport', 'InterState', null],
      ['5', '55', 40, 'Visakhapatnam_Airport', 'National', null]
    ];
    
    const sql = `INSERT INTO airport_service VALUES (:1, :2, :3)`;

    const rows = [
      ['05-April-22', 5, 20500],
      ['10-April-2022', 3, 17000],
      ['12-April-2022', 4, 12500],
      ['18-April-2022', 2, 15000],
      ['24-April-22', 1, 10000]
    ];
  
    */
  
    await connection.execute(`create or replace trigger chk_person_ticket before insert on airport_ticket for each row
declare
x int:=0;
begin
	select count(*) into x from airport_ticket where airport_ticket.flight_code=:new.flight_code and airport_ticket.passenger_id=:new.passenger_id;

	if(x != 0)then
		raise_application_error(-20000,'You have already booked one ticket for this flight...!!');
	end if;
end;
`);

 
    //await connection.execute(`INSERT INTO passenger_1 VALUES (1113, 'Surat', 'Surat', '15-mar-03', '1111')`);
    //await connection.execute(`insert into airport_ticket values(501,'1111',1111,1234,'3-may-22','eco',13,5000,'yes')`);
    //await connection.execute(`insert into airport_ticket values(503,'1111',1113,1236,sysdate,'eco',10,6500,'yes')`);
    //await connection.execute(`delete from illegal_offense`);
    //await connection.execute(`insert into flight values('1212', 'Mumbai', 'Ahmedabad', '3', '33', '6-oct-22', '7-oct-22', '2300', '0300')`);
    //await connection.execute(`delete from flight where flight_code='1212'`);
    //await connection.execute(`update plane set service_date='6-jan-22' where plane_id=3`);
    //await connection.execute(`create table ticket_cancelled(ticket_id int, charge int, date_of_cancel date)`);


    connection.commit();

    // Now query the rows back

    const result = await connection.execute(
      `select * from flight`,
      [],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    const rs = result.resultSet;
    let row;
    row = await rs.getRows()
    console.log(row);

/*
    while ((row = await rs.getRow())) {

      console.log(row.AIRPORT_NAME, " , ", row.CITY, ", ",row.STATE,", ", row.HANGER_CAPACITY);
    }
    
*/
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


//create_tables();


async function p1(TICKET_ID, FLIGHT_CODE , PASSENGER_ID,  PASSPORT_NUMBER, CLASS , SEAT_NO, PRICE,CORPORATE) {    //Ticket booking procedure

  let connection;
  try {
    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });

    console.log("Successfully connected to Oracle Database");
    let result = await connection.execute(`declare
    seat int;
    res varchar(20);
  begin
    seat := available_seats(${FLIGHT_CODE});
    if(seat > 0) then
      
      :res:= 'Ticket booked...!!';
    else
      :res:='Seats Full..!!';
    end if;

    :seat := available_seats(${FLIGHT_CODE});
  end;`, {
      seat: {dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 150},
      res: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 150 }
    });
    
    connection.commit();
    console.log(result.outBinds);

    console.log("\n\nTicket Details: ");

    result = await connection.execute(
      `select * from airport_ticket where ticket_id=${TICKET_ID}`,
      [],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    const rs = result.resultSet;
    let row;
    row = await rs.getRows();
    console.log(row);

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

p1(502, '1111', 1112, 1235, "bus", 15, 7000, "no");

/*
a int:=${TICKET_ID};
    b int:=${PASSENGER_ID};
    c int := ${PASSPORT_NUMBER};
    d varchar(10) := ${CLASS};
    e int := ${SEAT_NO},
    f int := ${PRICE},
    g varchar(150):= ${FLIGHT_CODE}
*/

async function p2(passport_number, first_name,  middle_name , last_name , passenger_id , street , city , date_of_birth , flight_code ) {

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });

    console.log("Successfully connected to Oracle Database");

    await connection.execute(`begin passenger_procedure(${passport_number}, ${first_name}, ${middle_name}, ${last_name}, ${passenger_id}, 
      ${street},${city}, ${date_of_birth}, ${flight_code}); end;`);

    connection.commit();
    console.log("Passenger Added...!!");
    console.log("\nDetails of added passenger: \n");

    let result = await connection.execute(
      `select * from passenger_1 where passenger_id=${passenger_id}`,
      [],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    const rs = result.resultSet;
    let row;
    row = await rs.getRows()
    console.log(row);
    
    result = await connection.execute(
      `select * from passenger_2 where passport_number=${passport_number}`,
      [],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    const rs1 = result.resultSet;
    
    row = await rs1.getRows();
    console.log(row);
    
    

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

//p2(1234, 'Mrugen', '.', 'Fichadia', 1111, 'Ahmedabad', 'Ahmedabad', '15-nov-02', '1111');


async function p3(PASSENGER_ID ,  offense , action_taken , cop_name) {

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });
    console.log("Successfully connected to Oracle Database");

    await connection.execute(`begin
    illegeal_offense_procedure(${PASSENGER_ID},${offense},${action_taken},${cop_name});
    end;
    `);
    
    connection.commit();

    console.log("Illegal Offence  Added...!!");
    console.log("\nDetails added: \n");

    let result = await connection.execute(
      `select * from illegal_offense where passenger_id=${PASSENGER_ID}`,
      [],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    const rs = result.resultSet;
    let row;
    row = await rs.getRows();
    console.log(row);


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

//p3(1113, 'carrying gun', 'jailed', 'S. Dave');

async function p4(EMPLOYEE_ID , first_name , middle_name , last_name , airport_name , address_street , city , state , phone_number, gender , job_type , salary) {

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });

    console.log("Successfully connected to Oracle Database");

    // Create a table
    

    await connection.execute(`begin employee_registration_procedure(${EMPLOYEE_ID}, ${first_name}, ${middle_name}, ${last_name}, ${airport_name}, 
      ${address_street},${city}, ${state}, ${phone_number}, ${gender}, ${job_type}, ${salary}); end;`);

    connection.commit();
    console.log("Employee  Added...!!");
    console.log("\nDetails of added employee: \n");

    let result = await connection.execute(
      `select * from employee where employee_id =${EMPLOYEE_ID}`,
      [],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    const rs = result.resultSet;
    let row;
    row = await rs.getRows();
    console.log(row);
    

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

//p4('444', 'Vatsal', '.', 'Barai', 'Kempegowda_International_Airport', 'Benglore', 'Bengaluru', 'Karnataka', 2563987, 'Male', 'Host', 70000);

async function p5(flight_code , to_destination , from_depature , plane_id , arrival_time , arrival_date , depature_date , depature_time , airline_id ) {

  let connection;
  try {

    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });

    console.log("Successfully connected to Oracle Database");

    // Create a table
    
    await connection.execute(`begin flight_planning_procedure(${flight_code}, ${to_destination}, ${from_depature}, ${plane_id}, ${arrival_time}, 
      ${arrival_date},${depature_date}, ${depature_time}, ${airline_id}); end;`);

    connection.commit();
    
    console.log("Flight Plan Added...!!");
    console.log("\nDetails of added flight: \n");

    let result = await connection.execute(
      `select * from flight where flight_code =${flight_code}`,
      [],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    const rs = result.resultSet;
    let row;
    row = await rs.getRows()
    console.log(row);
    
    

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

//p5('1111', 'Banglore', 'Ahmedabad', '2', '1200', '7-jun-22', '6-jun-22', '0700', '22');


async function p6(TICKET_ID) {

  let connection;
  try {
    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });

    console.log("Successfully connected to Oracle Database");

    await connection.execute(`begin
      ticket_cancellation(${TICKET_ID});
      end;
    `);
   
    connection.commit();

    console.log("Ticket Cancelled...!!");
    console.log("\nDetails of Cancelled Ticket: \n");

    let result = await connection.execute(
      `select * from ticket_cancelled where  ticket_id =${TICKET_ID}`,
      [],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    let rs = result.resultSet;
    let row;
    row = await rs.getRows()
    console.log(row);

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


  // Create a table
  /*
    await connection.execute(`create or replace procedure ticket_cancellation(id int) as
refund int;
charge int;
amount int;
    begin 
        select price into amount from airport_ticket where ticket_id=id;
        refund := refund_calculator(id);
        charge := amount – refund;
        insert into ticket_cancelled values(id,charge,sysdate);
        delete from airport_ticket where ticket_id = id;
    end;
    `);
*/

//p6(503);


async function f1(b_dt) {   //age_calculator

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });

    console.log("Successfully connected to Oracle Database");
    
    const result = await connection.execute(`declare
    age int;
    begin
      :age := age_calculator('${b_dt}');
    end;
    `, {
      age: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 150 }
    });

    console.log("Age is: ",result.outBinds," years");
    

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


/*
    await connection.execute(`create or replace function next_service(id int) return date as
	t_month date;
  last_service date;
begin
  select service_date into last_service from plane where plane.plane_id=id;
	t_month:= add_months(last_service,3);
	
  return t_month;
    
end;
/
`);


await connection.execute(`create or replace function total_passenger_of_flight(code int) return int as
	cnt int;
begin
	select count(*) into cnt from airport_ticket where flight_code=code;
	return cnt;
end;
/`);

await connection.execute(`create or replace function age_calculator(b_dt date) return int as 
    mon int;
    years int;
    begin 
      mon:= months_between(sysdate,b_dt);
      years:=mon/12;  return years;
    end;
    `);
*/

//f1('07-dec-01');

async function f2(ID) {   //next_service

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });

    console.log("Successfully connected to Oracle Database");

    let result = await connection.execute(`declare
    dt date;
    begin
      :dt := next_service(${ID});
      dbms_output.put_line('Next Service Date is: '||dt);
    end;
    `,{
      dt: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 150 }
    });

    console.log("Next service date is: ",result.outBinds);
    

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

    // Create a table
    
/*
    await connection.execute(`create or replace function next_service(id int) return date as
	t_month date;
  last_service date;
begin
  select service_date into last_service from plane where plane.plane_id=id;
	t_month:= add_months(last_service,3);
  return t_month;
end;
`);
  */
//f2(3);

async function f3(code) {   //passenger_calc

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });

    console.log("Successfully connected to Oracle Database");

    let result = await connection.execute(`declare
    cnt int;
    begin
      :cnt := total_passenger_of_flight('${code}');
      dbms_output.put_line('Total number of passengers: '||cnt);
    end;
    `, {
      cnt: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 150 }
    });
    
    // Now query the rows back

    console.log(`Total no of passengers for flight code ${code} are: `,result.outBinds);
    

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

    // Create a table
    
/*
await connection.execute(`create or replace function total_passenger_of_flight(code int) return int as
	cnt int;
begin
	select count(*) into cnt from airport_ticket where flight_code=code;
	return cnt;
end;
`);
*/


//f3('1111');

async function f4(ID) {   //refund calculator

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });

    console.log("Successfully connected to Oracle Database");

    let result = await connection.execute(`declare
    amount int;
    begin
      :amount := refund_calculator(${ID});
    end;
    `, {
  amount: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 50 }
});
    
    // Now query the rows back

    console.log("Refund amount: Rs.",result.outBinds, );
    
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

//f4(501);

/*
    await connection.execute(`create or replace function refund_calculator(id int) return int as

fl_dt date;
code varchar(150);
amount int;
corp varchar(3);
refund int;

begin
    select flight_code into code from airport_ticket where ticket_id=id;
    select price into amount from airport_ticket where ticket_id=id;
    select corporate into corp from airport_ticket where ticket_id=id;
    select depature_date into fl_dt from flight where flight_code=code;
    
    if(corp='yes') then
      if(months_between(fl_dt,sysdate) > 3) then
        refund := amount*0.75;
        dbms_output.put_line('Refund: 75%');
		    dbms_output.put_line('Refund amount: Rs. '|| amount*0.75);
      elsif ((months_between(fl_dt,sysdate)) > 2) then
    		refund := amount*0.5;
        dbms_output.put_line('Refund: 50%');
		    dbms_output.put_line('Refund amount: Rs. '|| amount*0.50);
      elsif ((months_between(fl_dt,sysdate)) > 1) then
		    refund := amount*0.25;
        dbms_output.put_line('Refund: 25%');
		    dbms_output.put_line('Refund amount: Rs. '|| amount*0.25);
      else
        refund := 0;
		    dbms_output.put_line('Refund: 0%');
		    dbms_output.put_line('Refund amount: Rs. '|| 0);
      end if;
    else
      refund := 0;
      dbms_output.put_line('Refund: 0%');
      dbms_output.put_line('Payable amount: Rs. '|| 0);
    
    end if;

  return refund;
end;`);
    
    connection.commit();
 */
/*
    await connection.execute(`create or replace function refund_calculator(id int) return int as

flight_date date;
code varchar(150);
amount int;
corp varchar(3);
refund int;

begin
    select flight_code,price,corporate into code,amount,corp from airport_ticket where ticket_id=id;
    select depature_date into flight_date from flight where flight_code=code;
    
    if(corp='yes') then
      if(months_between(sysdate,flight_date) > 3) then
        refund := amount*0.75;
        dbms_output.put_line('Refund: 75%');
		    dbms_output.put_line('Refund amount: Rs. '|| amount*0.75);
      elsif ((months_between(flight_date,sysdate)) > 2) then
    		refund := amount*0.5;
        dbms_output.put_line('Refund: 50%');
		    dbms_output.put_line('Refund amount: Rs. '|| amount*0.50);
      elsif ((months_between(flight_date,sysdate)) > 1) then
		    refund := amount*0.25;
        dbms_output.put_line('Refund: 25%');
		    dbms_output.put_line('Refund amount: Rs. '|| amount*0.25);
      else
        refund := 0;
		    dbms_output.put_line('Refund: 0%');
		    dbms_output.put_line('Refund amount: Rs. '|| 0);
      end if;
    else
      refund := 0;
      dbms_output.put_line('Refund: 0%');
      dbms_output.put_line('Payable amount: Rs. '|| 0);
    
    end if;

  return refund;
end;
`);

    connection.commit();
    */
   
/*
    
    const result = await connection.execute(
      `select * from airport_ticket`,
      [],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    const rs = result.resultSet;
    let row;
    row = await rs.getRows()
    console.log(row);
*/

async function f5(code) {   //Empty seats calculator

  let connection;
  try {

    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(`declare
    seat int;
    begin
      :seat := available_seats('${code}');
    end;
    `,
  {
    seat: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 150 }
  });

    console.log("Available seats are: ",result.outBinds);
    
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

/*
    await connection.execute(`create or replace function available_seats(code int) return int as

    cnt int;
    seat int;
    pl_id int;
    empty_seat int;

  begin
      select count(*) into cnt from airport_ticket where flight_code=code;
      select plane_id into pl_id from flight where flight_code=code;
      select capacity into seat from plane where plane_id=pl_id;
      empty_seat:= seat-cnt;

    return empty_seat;
  end;
  /`);
    */
    

//f5('1111');

//f5()
//f4()
//f2()
//f1()

async function add(m,n) {   

  let connection;

  try {

    connection = await oracledb.getConnection({ user: "system", password: "mrugen", connectionString: "localhost/xepdb1" });

    console.log("Successfully connected to Oracle Database");
    
    await connection.execute(`create or replace function adder(a int, b int) return int as
    c int;
    begin
        c:=a+b;
        return c;
    end;
    `);
    
    // Now query the rows back

    const result = await connection.execute(
  `BEGIN
     :sum := adder( ${m},${n});
   END;`,
  {
    sum: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 150 }
  }
);

console.log("Sum is: ",result.outBinds);
    

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

//add(6,8);

