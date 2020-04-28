const { host, database } = require('./config');

var Connection = require('tedious').Connection;
 
// Create connection to database
const config = {
    server: `${host}`,
    authentication: { 
        type: "azure-active-directory-msi-app-service"
    },
    options: {
        encrypt: true,
        database: `${database}`,
        trustServerCertificate: true,
        debug: {
          packet: true,
          data: true,
          payload: true,
          token: true,
          log: true
        },
    }
  };

var connection = new Connection(config);

connection.on('connect', function(err) {
  if(err) {
    console.log('Error: ', err)
  }
  // If no error, then good to go...
  executeStatement();
});

var Request = require('tedious').Request;

function executeStatement() {
  request = new Request("SELECT TOP (1000) * FROM [SalesLT].[SalesOrderHeader]", function(err, rowCount) {
    if (err) {
      console.log(err);
    } else {
      console.log(rowCount + ' rows');
    }
  });

  request.on('row', function(columns) {
    columns.forEach(function(column) {
      console.log(column.value);
    });
  });

  connection.execSql(request);
}