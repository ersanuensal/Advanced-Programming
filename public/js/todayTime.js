function getTodayTime() {

  const todaydate = new Date();

  var datetoday = todaydate.toISOString().split('T')[0];

//  console.log(datetoday);

  return datetoday;
}
