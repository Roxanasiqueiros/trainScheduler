let firebaseConfig = {
    apiKey: "AIzaSyDlbVnOOi3biyS_mdOo7MAJi_0L7SRA7_c",
    authDomain: "train-schedule-a475e.firebaseapp.com",
    databaseURL: "https://train-schedule-a475e.firebaseio.com",
    projectId: "train-schedule-a475e",
    storageBucket: "",
    messagingSenderId: "710654280237",
    appId: "1:710654280237:web:bcbdfd7e13ea2c85782ea4"
}


    firebase.initializeApp(firebaseConfig);
     const database = firebase.database();
    console.log(database); 


$('#addTrainBtn').on("click", function () {
    console.log("clicked-here")

    let trainName = $("#trainNameInput").val().trim();
    let destination = $("#destinationInput").val().trim();
    let firstTrain = moment($("#timeInput").val().trim(), "HH:mm").format("HH:mm");
    let frequency = $("#frequencyInput").val().trim();

    let newTrain = {
        name: trainName,
        place: destination,
        freq: frequency,
        ftrain: firstTrain
    }

    database.ref().push(newTrain);
    console.log(newTrain.name);

    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#timeInput").val("");
    $("#frequencyInput").val("");

    return false;
});

//Firebase event for adding trains to the database and a row in the html when a user adds an entry

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
    
    let tName = childSnapshot.val().name;
    let tDestination = childSnapshot.val().place;
    let tFrequency = childSnapshot.val().freq;
    let tFirstTrain = childSnapshot.val().ftrain;
    let timeArr = tFirstTrain.split(":");
    let trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    let maxMoment = moment.max(moment(), trainTime);
    let Minutes;
    let tArrival;

    
       
  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;
    
    tArrival = moment().add(tMinutes, "m").format("hh:mm A");
  }
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);
  // Add each train's data into the table
  $("#trainTable > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
          tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
})