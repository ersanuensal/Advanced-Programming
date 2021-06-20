const uploadForm = document.querySelector('#uploadForm');
const endPoint = "/importAppsFromExcel";


uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();


    uploadToServer()


    // const allNewApps = [];

    // for (const app of appsFromExcel) {

    //     const newApp = {
    //         Key: app['Key'],
    //         Name: app['Name'],
    //         Version: "",
    //         Description: app['Description'],
    //         COTS: "COTS",
    //         Release: new Date(app['Release']).toISOString(),
    //         Shutdown: app["Shutdown"] ? new Date(app["Shutdown"]).toISOString() : '',
    //         color: "blue",
    //         dateToday: ""
    //     };

    //     allNewApps.push(newApp);
    // }

    // myDiagram.model.addNodeDataCollection(allNewApps);

});

const uploadToServer = async function () {
    const inpFile = document.getElementById('inpFile');
    const headerRow = document.getElementById('headerRow');

    const firstRowIsHeader = headerRow.checked

    const formData = new FormData()

    formData.set("inpFile", inpFile.files[0]);
    formData.set('firstRowIsHeader', firstRowIsHeader);

    const response = await fetch(endPoint, {
        method: "post",
        body: formData
    });

    const data = await response.json();

    if (data.firstRowIsHeader == true) {
        console.log("first row is header");
    }

    console.log(data)
}


const getAppsFromExcel = function () {

    const sheetsName = document.getElementById('sheetsName');
    const appName = document.getElementById('appName');
    const appId = document.getElementById('appId');
    const appDescription = document.getElementById('appDescription');
    const appCOTS = document.getElementById('appCOTS');
    const appReleaseDate = document.getElementById('appReleaseDate');
    const appShutdownDate = document.getElementById('appShutdownDate');

    const formData = new FormData();

    formData.set('sheetsName', sheetsName.value);
    formData.set('appName', appName.value);
    formData.set('appId', appId.value);
    formData.set('appDescription', appDescription.value);
    formData.set('appCOTS', appCOTS.value);
    formData.set('appReleaseDate', appReleaseDate.value);
    formData.set('appShutdownDate', appShutdownDate.value);

}