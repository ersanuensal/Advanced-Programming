// class DataObjects {
//   constructor(from, to, name, description, color, personalData) {
//     this.from = from;
//     this.to = to;
//     this.name = name;
//     this.description = description;
//     this.color = color;
//     this.personalData = personalData;
//     this.LoadPreset = LoadPreset;
//   }
//
// }

// function reuseDataObj() {
//       var json = myDiagram.model.toJson();
//       var obj = JSON.parse(json);
//       // console.log(obj);
//
//       var reuseArray = [];
//
//       for (var i = 0; i < obj.linkDataArray.length; i++) {
//
//         if (!reuseArray.length) {
//
//           const addObj = new Link(
//             obj.linkDataArray[i].from,
//             obj.linkDataArray[i].to,
//             obj.linkDataArray[i].Name,
//             obj.linkDataArray[i].Description,
//             obj.linkDataArray[i].Color,
//             obj.linkDataArray[i].PersonalData,
//             obj.linkDataArray[i].LoadPreset,
//           );
//
//           let newLength = reuseArray.push(addObj);
//
//         } else {
//
//           for (var j = 0; j < reuseArray.length; j++) {
//
//             const addObj = new Link(
//               obj.linkDataArray[i].from,
//               obj.linkDataArray[i].to,
//               obj.linkDataArray[i].Name,
//               obj.linkDataArray[i].Description,
//               obj.linkDataArray[i].Color,
//               obj.linkDataArray[i].PersonalData,
//               obj.linkDataArray[i].LoadPreset,
//             );
//
//             if (reuseArray[j].name == addObj.name) {
//               console.log("glei");
//               break;
//             } else {
//
//               let newLength = reuseArray.push(addObj);
//               console.log("addet");
//               break;
//             }
//
//           }
//
//         }
//
//         //  console.log(reuseArray.length);
//
//
//         //    console.log(reuseArray[0].name);
//       }
//
//       console.log(reuseArray.length);
//       return reuseArray;
//



function saveAsPreset() {

  var preset = [];

  for (var i = 0; i < linkList.length; i++) {
    preset [i] = linkList[i];
    return preset[i].Name;
}


}
