class DataObjects {
  constructor(from, to, name, description, color, personalData) {
    this.from = from;
    this.to = to;
    this.name = name;
    this.description = description;
    this.color = color;
    this.personalData = personalData;
  }

}

function reuseDataObj() {
      var json = myDiagram.model.toJson();
      var obj = JSON.parse(json);
      // console.log(obj);

      var reuseArray = [];

      for (var i = 0; i < obj.linkDataArray.length; i++) {

        if (!reuseArray.length) {

          const addObj = new DataObjects(
            obj.linkDataArray[i].from,
            obj.linkDataArray[i].to,
            obj.linkDataArray[i].Name,
            obj.linkDataArray[i].Description,
            obj.linkDataArray[i].Color,
            obj.linkDataArray[i].PersonalData,
          );

          let newLength = reuseArray.push(addObj);

        } else {

          for (var j = 0; j < reuseArray.length; j++) {

            const addObj = new DataObjects(
              obj.linkDataArray[i].from,
              obj.linkDataArray[i].to,
              obj.linkDataArray[i].Name,
              obj.linkDataArray[i].Description,
              obj.linkDataArray[i].Color,
              obj.linkDataArray[i].PersonalData,
            );

            if (reuseArray[j].name == addObj.name) {
              console.log("glei");
              break;
            } else {

              let newLength = reuseArray.push(addObj);
              console.log("addet");
              break;
            }

          }

        }

        //  console.log(reuseArray.length);


        //    console.log(reuseArray[0].name);
      }

      console.log(reuseArray.length);
      return reuseArray;

  }
