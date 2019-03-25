$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDQimNeJpfgm_NS-ohBKpyX2NH6AG-5BB4",
        authDomain: "train-schedule-9adaa.firebaseapp.com",
        databaseURL: "https://train-schedule-9adaa.firebaseio.com",
        projectId: "train-schedule-9adaa",
        storageBucket: "train-schedule-9adaa.appspot.com",
        messagingSenderId: "777519522684"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $("#submit").on("click", (event) => {
        event.preventDefault();
        alert("Train Added to Schedule")

        var name = $("#train-name").val().trim();
        var destination = $("#destination").val().trim();
        var first = $("#first-train").val().trim();
        var frequency = $("#frequency").val().trim();

        // time math //
        var firstConversion = moment(first, "hh:mm").subtract(1, "years");
        console.log(firstConversion);
        var currentTime = moment();
        console.log("time: " + moment(currentTime).format("hh:mm"));
        var timeDiff = moment().diff(moment(firstConversion), "minutes");
        console.log(timeDiff)
        var remainder = timeDiff % frequency;
        console.log(remainder);
        var nextMin = frequency - remainder;
        console.log(nextMin);
        var nextTrain = moment().add(nextMin, "minutes");
        var nextTrainTime = (moment(nextTrain).format("hh:mm"));


        var tablerow = $("<tr>");
        $("#tbody").append(tablerow);

        // var nameInfo = $("<td>").text(name);
        // tablerow.append(nameInfo);
        // var destInfo = $("<td>").text(destination);
        // tablerow.append(destInfo);
        // var freqInfo = $("<td>").text(frequency);
        // tablerow.append(freqInfo);
        // var next = $("<td>").text(nextTrainTime);
        // tablerow.append(next);
        // var away = $("<td>").text(nextMin);
        // tablerow.append(away);

        database.ref().push({
            name: name,
            destination: destination,
            frequency: frequency,
            first: first
        });
    });

    database.ref().on("child_added", function(snapshot) {
        var sv = snapshot.val();

        var tr = $("<tr>")
        $("tbody").append(tr)

        var docName = $("<td>").text(sv.name);
        tr.append(docName);
        var docDest = $("<td>").text(sv.destination);
        tr.append(docDest);
        var docFrequency = $("<td>").text(sv.frequency);
        tr.append(docFrequency);

        var firstConversion = moment((sv.first), "hh:mm").subtract(1, "years");
        console.log(firstConversion);
        var currentTime = moment();
        console.log("time: " + moment(currentTime).format("hh:mm"));
        var timeDiff = moment().diff(moment(firstConversion), "minutes");
        console.log(timeDiff)
        var remainder = timeDiff % (sv.frequency);
        console.log(remainder);
        var nextMin = (sv.frequency) - remainder;
        console.log(nextMin);
        var nextTrain = moment().add(nextMin, "minutes");
        var nextTrainTime = (moment(nextTrain).format("hh:mm"));


        //need to adjust times when updated from firebase**************//
        var docNextTrainTime = $("<td>").text(nextTrainTime);
        tr.append(docNextTrainTime);
        var docNextMin = $("<td>").text(nextMin);
        tr.append(docNextMin);


    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});