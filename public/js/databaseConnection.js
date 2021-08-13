function saveDatabaseConnectionString() {


  // Values that will be saved in the config file
  var databaseEndpoint = document.getElementById("databaseEndpoint").value;
  var databaseUsername = document.getElementById("databaseUsername").value;
  var databasePassword = document.getElementById("databasePassword").value;
  var databasePort = document.getElementById("databasePort").value;
  var databaseName = document.getElementById("databaseName").value;

  // Object of the connection settings
  var databaseConnection = {
    endpoint: databaseEndpoint,
    username: databaseUsername,
    password: databasePassword,
    port: databasePort,
    database: databaseName
  };

  // storing connection data as a json string
  var data = JSON.stringify(databaseConnection);


  // sending connection string to html
  fetch('http://localhost:3000/settings', {
    method: 'Post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });

  
  window.location.replace("http://localhost:3000/greeter");
  document.getElementById('connectAlert').classList.remove('hide')

}
