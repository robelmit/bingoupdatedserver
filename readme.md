### E COMMERCE APP NODE.JS

#### Technology Used 
 
 - Node.js 
 - Express.js
 - Mongodb 





api/v1/users

 get /cashiers        getallcashers
 delete  /:id delete user for admin
 post /    create a cashier














   const adds = await Ads.countDocuments();
  const users = await User.countDocuments();
  var todaystart = moment().startOf('day');
  // end today
  var thismonthstart = moment().startOf('month');   // set to the first of this month, 12:00 am
  var thisyearstart = moment().startOf('year');   // set to the first of this month, 12:00 am
  var thisweekstart = moment().startOf('week');
  var end = moment(todaystart).endOf('day');

  const todayadd = await Ads.find({ createdAt: { '$gte': todaystart, '$lte': end } })
  const thisweekadd = await Ads.find({ createdAt: { '$gte': thisweekstart, '$lte': end } })
  const thismonthadd = await Ads.find({ createdAt: { '$gte': thismonthstart, '$lte': end } })
  const todayuser = await User.find({ createdAt: { '$gte': todaystart, '$lte': end } })
  const thisweekuser = await User.find({ createdAt: { '$gte': thisweekstart, '$lte': end } })
  const thismonthuser = await User.find({ createdAt: { '$gte': thismonthstart, '$lte': end } })
  const thisyearuser = await User.find({ createdAt: { '$gte': thisyearstart, '$lte': end } })
  //users,
  //adds,
  if (users) {
    res.json({
      users,
      adds,
      todayadd,
      thisweekadd,
      thismonthadd,
      todayuser,
      thisweekuser,
      thismonthuser,
      thisyearuser
    })
  }
  else {

    res.status(404).json({
      message: "Error on sending"
    })
  }



  validation using joi  on every post request 
  security measures 
  professtional todos

  - game created ,deleted and update must include house
  - games should resturn game of a house 
  - total games ,tatal earning should return value of a house 
  - crud a house only for superadmin
  - analytics of a house for superadmin
  - analytics of house using isWon true only  and only check of a house 
  - when game is over go to setup pahge 
  - when game is reset go to setup page 
  - delay time selecting 
  - language 
  - cashier analytics 



get api/v1/houses/ get all houses
get api/v1/houses/:id get specific house 
post api/v1/houses/
    { name
     city
     detail
     isActive}
delete api/v1/houses/:id delete specific house 
put api/v1/houses/:id update specific house 
 { name
     city
     detail
     isActive}




analytics

tgringa 40 41