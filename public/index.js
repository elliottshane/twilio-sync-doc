$(document).ready(function() {
    $("#hourDate").datepicker().focus(function() {
        $("#hourDate").datepicker("show");
    
    });
});
var syncDoc = {}
function updateHours(){
    
}



$(function () {
  //We'll use message to tell the user what's happening
  var $message = $('#message');
  var $result = $('#postResult');
  var $UpdateHours = $('#updateHours')
  var $LoadUser =$('#loadUser')
var data
  //Our interface to the Sync service
  var syncClient;
  //We're going to use a single Sync document, our simplest
  //synchronisation primitive, for this demo
  var syncDoc;
  //Get an access token for the current user, passing a device ID
  //In browser-based apps, every tab is like its own unique device
  //synchronizing state -- so we'll use a random UUID to identify
  //this tab.
  $.getJSON('/token', function (tokenResponse) {
    //Initialize the Sync client
    syncClient = new Twilio.Sync.Client(tokenResponse.token, { logLevel: 'info' });

    //Let's pop a message on the screen to show that Sync is ready
   
    $result.html('Sync initialized!.....');
    $result.html($result.html() + '<br> Setting up stuff... ')
 
    //This code will create and/or open a Sync document
    //Note the use of promises
    syncClient.document('SyncHours').then(function(doc) {
      //Lets store it in our global variable
      syncDoc = doc;

      //Initialize game board UI to current state (if it exists)
       data = syncDoc.get();
      console.log(syncDoc)
      $('#postResult').html($result.html() + '<br>....'+JSON.stringify(data, null, "\t"));
      //Let's subscribe to changes on this document, so when something
      //changes on this document, we can trigger our UI to update
     // syncDoc.on('updated', updateTable);

    });

  });



 //set the data
  $UpdateHours.on('click', function () {
   var name = document.getElementById('hourUser').value;
  
   
  if(data.user){
    if(name in data.user){   
       var timeEntryData = data.user[name].timeEntries;
       var index= timeEntryData.length + 1
       
        var newTimeEntryData = 
                        
                     {
           "id":index,
           "type":document.getElementById('hourType').value,
           "date":document.getElementById('hourDate').value,
           "hours":document.getElementById('hourHours').value,
           "miles":document.getElementById('hourMiles').value,
           "notes":document.getElementById('hourNotes').value,
                     };
      
       data.user[name].timeEntries.push(newTimeEntryData);
      // console.log(users)
      // syncDoc.user = users;
   }
   else{
       users = data.user
       
        users[name] = {
            timeEntries:
          [{
            "id":1,
            "type":document.getElementById('hourType').value,
            "date":document.getElementById('hourDate').value,
            "hours":document.getElementById('hourHours').value,
            "miles":document.getElementById('hourMiles').value,
            "notes":document.getElementById('hourNotes').value,
        }],
        };
       data.user= users;
      
    //syncDoc.user[name].timeEntries = newTimeEntryData
       
   }
   
   
  } 
   else{
    users={}
        users[name] = {
           timeEntries:
         [{
           "id":1,
           "type":document.getElementById('hourType').value,
           "date":document.getElementById('hourDate').value,
           "hours":document.getElementById('hourHours').value,
           "miles":document.getElementById('hourMiles').value,
           "notes":document.getElementById('hourNotes').value,
       }],
       };
      
    
       data.user= users;
   }

    
     console.log(data) 
     //  updateTable();
    //Send updated document to Sync
    //his should trigger "updated" events on other clients
   syncDoc.update(data);
   var newDoc = syncDoc.get();
   
$('#hoursTable').html(JSON.stringify(newDoc.user, null, "\t"));
updateTable(name)
  });

$LoadUser.on('click', function () {
var name = document.getElementById('hourUser').value;
   updateTable(name)

})

function updateTable(name){
     // EXTRACT VALUE FOR HTML HEADER. 
     // ('Book ID', 'Book Name', 'Category' and 'Price')
     var col = [];
     for (var i = 0; i < data.user[name].timeEntries.length; i++) {
         for (var key in data.user[name].timeEntries[i]) {
             if (col.indexOf(key) === -1) {
                 col.push(key);
             }
         }
     }
     
     // CREATE DYNAMIC TABLE.
     var table = document.createElement("table");
     // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
     var tr = table.insertRow(-1);                   // TABLE ROW.
     for (var i = 0; i < col.length; i++) {
         var th = document.createElement("th");      // TABLE HEADER.
         th.innerHTML = col[i];
         tr.appendChild(th);
     }
     // ADD JSON DATA TO THE TABLE AS ROWS.
     for (var i = 0; i < data.user[name].timeEntries.length; i++) {
 
         tr = table.insertRow(-1);
 
         for (var j = 0; j < col.length; j++) {
             var tabCell = tr.insertCell(-1);
             tabCell.innerHTML = data.user[name].timeEntries[i][col[j]];
         }
     }
     
 
     var divContainer = document.getElementById("hoursTable");
     divContainer.innerHTML = "";
     divContainer.appendChild(table);
 
 } 

});
