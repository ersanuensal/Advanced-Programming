const uploadForm = document.querySelector('#uploadForm');

uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const inpFile = document.getElementById('inpFile');

    const endPoint = "/importAppsFromExcel";
    const formData = new FormData();

    formData.append("inpFile", inpFile.files[0]);

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
            Name: app['Name Application'],
            Version: "",
            Description: app['Description'],
            COTS: "",
            Release: app['Start Date'],
            Shutdown: "",
            color: "blue",
            dateToday: ""
        };

        allNewApps.push(newApp);
    }

    myDiagram.model.addNodeDataCollection(allNewApps);

});
