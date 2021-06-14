const uploadForm = document.querySelector('#uploadForm');

uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const inpFile = document.getElementById('inpFile');
    const sheetsName = document.getElementById('sheetsName');
    const appName = document.getElementById('appName');
    const appId = document.getElementById('appId');
    const appDescription = document.getElementById('appDescription');
    const appCOTS = document.getElementById('appCOTS');
    const appReleaseDate = document.getElementById('appReleaseDate');
    const appShutdownDate = document.getElementById('appShutdownDate');

    const endPoint = "/importAppsFromExcel";
    const formData = new FormData();

    formData.set("inpFile", inpFile.files[0]);
    formData.set('sheetsName', sheetsName.value);
    formData.set('appName', appName.value);
    formData.set('appId', appId.value);
    formData.set('appDescription', appDescription.value);
    formData.set('appCOTS', appCOTS.value);
    formData.set('appReleaseDate', appReleaseDate.value);
    formData.set('appShutdownDate', appShutdownDate.value);

    const response = await fetch(endPoint, {
        method: "post",
        body: formData
    });

    const data = await response.json();

    // console.log(data);

    const appsFromExcel = data.data;

    console.log(appsFromExcel);



    const allNewApps = [];

    for (const app of appsFromExcel) {

        const newApp = {
            Key: app['Key'],
            Name: app['Name'],
            Version: "",
            Description: app['Description'],
            COTS: "COTS",
            Release: new Date(app['Release']).toISOString(),
            Shutdown: app["Shutdown"] ? new Date(app["Shutdown"]).toISOString() : '',
            color: "blue",
            dateToday: ""
        };

        allNewApps.push(newApp);
    }

    myDiagram.model.addNodeDataCollection(allNewApps);

});
