const { Connection, Request } = require("tedious");
const { host, database } = require('./config');
 
// Create connection to database
const config = {
    server: `${host}`,
    authentication: { 
        type: "azure-active-directory-msi-app-service"
    },
    options: {
        encrypt: true,
        database: `${database}`,
        debug: {
          packet: true,
          data: true,
          payload: true,
          token: true,
          log: true
        },
    }
  };
const connection = new Connection(config);
 
// Attempt to connect and execute queries if connection goes through
connection.on('connect', err => {
  if (err) {
    console.error(err.message);
  } else {
    queryDatabase();
  }
});

connection.on('debug', function(text) {
    console.log(text);
  }
);
 
function queryDatabase() {
  console.log("Reading rows from the Table...");
 
  // Read all rows from table
  const request = new Request(
    `SELECT TOP (10) * FROM [SalesLT].[Customer]`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );
 
  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
    });
  });
 
  connection.execSql(request);
}