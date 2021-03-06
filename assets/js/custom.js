function enableJapaInput() {
    var japaCntBtn = document.getElementById('japaCntBtn');
    japaCntBtn.style.visibility = 'hidden';

    var japaCountForm = document.getElementById('japaCountForm');
    japaCountForm.style.display = 'block';
}

function submitJapaCount() {

    var name = document.getElementById('name').value;
    var mobileNo = document.getElementById('mobileNo').value;
    var date = document.getElementById('date').value
    var japaCount = document.getElementById('japaCount').value;

    var invalidDataMsg = document.getElementById('invalidDataMsg');
    

    if(name === '' || mobileNo === '' || date === '' || japaCount === '') {
        invalidDataMsg.style.display = 'block'
    }
    else {
        invalidDataMsg.style.display = 'none';
        //Start firebase    
        var japaCountData = {};
        japaCountData["date"] = date;
        japaCountData["japacount"] = japaCount;
        japaCountData["mobileno"] = mobileNo;
        japaCountData["name"] = name;

        updateDataToFirebase(japaCountData);
    }
}

function updateDataToFirebase(dataObject) {
    var submitJapaCount = document.getElementById('submitJapaCount');
    submitJapaCount.disabled = true;
    const dbRef = firebase.database().ref();
    const userjapacountRef = dbRef.child('userjapacount');
    var successDataMsg = document.getElementById('successDataMsg');
    userjapacountRef.push(dataObject, function() {
        successDataMsg.style.display = 'block'
        document.getElementById('name').value = "";
        document.getElementById('mobileNo').value = "";
        document.getElementById('date').value = "";
        document.getElementById('japaCount').value = "";
        submitJapaCount.disabled = false;
    });
}



async   function getAllJapaData() {
    const dbRef = firebase.database().ref();
    const userjapacountRef = dbRef.child('userjapacount');  
    var countOfJapa = Number(0); 
    
    userjapacountRef.on("child_added", snap => {
        var data = snap.val();
        countOfJapa += parseInt(data.japacount);
        document.getElementById('japaCountTotal').innerHTML = countOfJapa;
    }); 

    var newDate = new Date();
    
    document.getElementById('currentDateTime').innerHTML = new Date();

    const snapshot = await dbRef.once('child_added');
    const value = snapshot.val();
    var listOfMobileNos = [];
    
    for( var key in value ) {
        var japaDataJson = value[key];
        var currentKey = japaDataJson.mobileno;
        if(!listOfMobileNos.indexOf(currentKey) >= 0)
            listOfMobileNos.push(currentKey);
    }

    //Make mobile numbers unique
    var uniqueMobileNos = [];
    for(var i in listOfMobileNos){
        if(uniqueMobileNos.indexOf(listOfMobileNos[i]) === -1){
            uniqueMobileNos.push(listOfMobileNos[i]);
        }
    }

    var finalJapaDataByUser = [];

    for(var i=0; i<uniqueMobileNos.length; i++) {
        dbRef.child('userjapacount').orderByChild('mobileno').equalTo(uniqueMobileNos[i]).once("value", function(snapshot) {
            var userData = snapshot.val();
            var finalJapaDataUserJson = {};
            var japaC = Number(0);
            for( var key in userData) {
                var userDataJson = userData[key];
                finalJapaDataUserJson = {};
                japaC += parseInt(userDataJson.japacount);
                
                finalJapaDataUserJson["name"] = userDataJson.name;
                finalJapaDataUserJson["mobileno"] = userDataJson.mobileno;
            }
            finalJapaDataUserJson["japacount"] = japaC;
            
            finalJapaDataByUser.push(finalJapaDataUserJson);
            
        });
    }

    var userJapaList = document.getElementById('usersJapaList');
    
    for(var i=0; i<finalJapaDataByUser.length; i++) {
        var finalJapa = finalJapaDataByUser[i];
        var row = userJapaList.insertRow(-1);

        var nameCell = row.insertCell(0);
        nameCell.innerHTML = finalJapa["name"];

        var mobileNoCell = row.insertCell(1);
        mobileNoCell.innerHTML = finalJapa["mobileno"];

        var japaCountCell = row.insertCell(2);
        japaCountCell.innerHTML = finalJapa["japacount"];
    }


    console.log(finalJapaDataByUser);
    // const snapshot = await dbRef.once('child_added');
    // const value = snapshot.val();

    // var japaCountOfMembers = [];
    
    // for( var key in value ) {
    //     console.log( "Key is: " + key + " value is: " + value[key] );
    //     var japaDataJson = value[key];
    //     var currentKey = japaDataJson.mobileno;
    //     var japaCLocal = {};
    //     japaCLocal["name"] = japaDataJson.name;
    //     japaCLocal["mobileno"] = japaDataJson.mobileno;
    //     japaCLocal["japacount"] = japaDataJson.japacount;

    //     japaCountOfMembers.push(japaCLocal);
        
    //  }

    //  var japaCountMembersFinal = [];

    //  var japaCFinalInital = {};
    //  japaCFinalInital["name"] = japaCountOfMembers[0].name;
    //  japaCFinalInital["mobileno"] = japaCountOfMembers[0].mobileno;
    //  japaCFinalInital["japacount"] = japaCountOfMembers[0].japacount;

    //  japaCountMembersFinal.push(japaCFinalInital);

    //  for(var i=0; i<japaCountOfMembers.length; i++) {
    //     var currentObj = japaCountOfMembers[i];
    //     var currentMobile = currentObj.mobileno;
    //     console.log(japaCountOfMembers.length)
    //     for(var j=0; j<japaCountMembersFinal.length; j++) {
    //         var finalobj = japaCountMembersFinal[i];
            
    //         if(typeof finalobj !== "undefined") {

    //             console.log(finalobj.mobileNo);
    //             console.log(currentMobile);
            
    //             if(finalobj.mobileno == currentMobile) {
    //                 console.log('hi')
    //                 var count = Number(0);
    //                 count = parseInt(finalobj.japacount) + parseInt(currentObj.japacount);
    //                 finalobj["japacount"] = count;

    //                 japaCountMembersFinal.push(finalobj);
    //             }
    //         }
    //     }
        // for(var j=0; j<japaCountMembersFinal.length; j++) {
        //     var finalobj = japaCountMembersFinal[i];
        //     console.log('hi')
        //     if(finalobj.mobileno === currentMobile) {
        //         var count = Number(0);
        //         count = parseInt(finalobj.japacount) + parseInt(currentObj.japacount);
        //         finalobj["japacount"] = count;

        //         japaCountMembersFinal.push(finalobj);
        //     }
        // }
    
    // userjapacountRef.collection("userjapacount").get().then(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log("J" +  doc.data());
    //     });
    // });
}