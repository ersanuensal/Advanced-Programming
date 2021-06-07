const uploadForm = document.querySelector('#uploadForm');

uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const inpFile = document.getElementById('inpFile');

    const endPoint = "/importAppsFromCsv";
    const formData = new FormData();

    formData.append("inpFile", inpFile.files[0]);

    const response = await fetch(endPoint, {
        method: "post",
        body: formData
    });

    const data = await response.json();

    console.log(data);
});
