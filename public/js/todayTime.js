function getTodayTime() {

  const todaydate = new Date();

  var datetoday = todaydate.toISOString();

//  console.log(datetoday);

  return datetoday;
}
