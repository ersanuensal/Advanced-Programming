function saveDatabaseConnectionString() {



  var databaseEndpoint = document.getElementById("databaseEndpoint").value;
  var databaseUsername = document.getElementById("databaseUsername").value;
  var databasePassword = document.getElementById("databasePassword").value;
  var databasePort = document.getElementById("databasePort").value;
  var databaseName = document.getElementById("databaseName").value;


  var databaseConnection = {
    endpoint: databaseEndpoint,
    username: databaseUsername,
    password: databasePassword,
    port: databasePort,
    database: databaseName
  };

  var data = JSON.stringify(databaseConnection);

  console.log(data);

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
