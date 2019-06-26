const url = "https://86ke5oq1na.execute-api.ap-southeast-1.amazonaws.com/default/mySimpleFunction";

// chrome.storage.sync.clear();

var data = {};



console.log("Script injected!");

// var data2 = JSON.stringify(data);
// var x = document.getElementsByClassName("forum");
// console.log(x[0].innerHTML);
// console.log(x.length);
// console.log(x[0].childNodes[1].querySelector('a').innerHTML);    // Gets Title of Thread 0
// if (x[0].childNodes[1].querySelector('p') !== null){    // Gets Description of thread 0 (If it exists)
//   console.log(x[0].childNodes[1].querySelector('p').innerHTML);
// }   

var y = document.getElementsByClassName('discussion_post');    //For posts in conversation page
console.log(y.length); // y.length == number of posts detected

///////////////////////////////////////////////////////
///////////////////  THREAD VIEW //////////////////////
///////////////////////////////////////////////////////

if (y.length === 0 ){ // if not within the conversation page
     var x = document.getElementsByClassName('forum-list');
     console.log(x.length);
     // console.log(x[0].innerHTML);
     for (var i = 0;i<x[0].querySelectorAll('tr').length;i++) {
          // console.log("Iteration: " + i);
          var x_row = x[0].querySelectorAll('tr')[i];    //Select row x
          if (i !== 0){
               var key = x_row.childNodes[1].querySelector('a').innerHTML;
               // console.log(key);
               // storeData(key,i);
               // retrieve(key);
               retrieveStorage(x_row,i,key);
          }
         
          var td = document.createElement("td");
          td.innerHTML = "I hope this works " + i;
          if (i === 0){       // Check if its the first row (Header)
               td.innerHTML = "Important?";
               x_row.insertBefore(td,x_row.childNodes[2]);
          }
          
     }
}



///////////////////////////////////////////////////////
///////////  CONVERSATION THREAD //////////////////////
///////////////////////////////////////////////////////

for (var i = 0;i < y.length; i++ ){
     data = {
          "sentence" : y[i].querySelector('p').innerHTML
     };
     data2 = JSON.stringify(data);
     ajaxPost(y[i].querySelector('p'));
}


///////////////////////////////////////////////////////
///////////////////  FUNCTIONS ////////////////////////
///////////////////////////////////////////////////////

function appendOdd(element){
     var div = document.createElement("DIV");
     div.id = "odd";
     var para = document.createElement("P");
     para.innerHTML = "This Post has an ODD number of words";
     div.appendChild(para);
     element.appendChild(div);
}

function appendEven(element){
     var div = document.createElement("DIV");
     div.id = "even";
     var para = document.createElement("P");
     para.innerHTML = "This Post has an EVEN number of words";
     div.appendChild(para);
     element.appendChild(div);
}

function isEven(number){
     if(number%2 === 0){
          return true;
     } else
          return false;
}

function ajaxPost(element){
  $.ajax({
       type:"POST",
       data: data2,
       url:url,
       success: function(data,status){
            console.log("Number of words:" + data);
            console.log(typeof(data));
            if (isEven(data)){
               appendEven(element);
               console.log("Is Even!");
            } else {
               appendOdd(element);
               console.log("NOT IS EVEN!");
            }
          //   alert(message);
       },
       error: function (jqxhr,statusCode){
            alert(jqxhr.status);
            try{
                 jsonValue = jQuery.parseJSON( jqxhr.responseText );
            } catch(err) {
                 alert(err);
            } finally {
            }
            console.log("failure");
       }
  })
}

function retrieveStorage(element,i,key){
     var td = document.createElement("td");
     td.innerHTML = "I hope this works " + i;
     if (i === 0){
          td.innerHTML = "Important?";
     }
     chrome.storage.sync.get(key,function(result){
          if (result[key] === undefined){
               console.log("No previous storage data!");
               td.innerHTML = "Conversation Unprocessed";
               element.insertBefore(td,element.childNodes[2]);
               return;
          }
          var dict = JSON.parse(result[key]);
          console.log("value of " + key +" is " + dict.val);
          if (isEven(dict.val)){
               td.innerHTML = "Even " + i;
               element.insertBefore(td,element.childNodes[2]);  
          } else{
               td.innerHTML = "Odd " + i;
               element.insertBefore(td,element.childNodes[2]);
          }
     })
}
// chrome.runtime.onMessage.addListener(gotMessage);

// function gotMessage(message, sender, sendResponse){
//   console.log(message);
//   if (message.txt === "start"){
//     start();
//   }
  
// }

// chrome.runtime.sendMessage({
//     total_elements: document.querySelectorAll('*').length // or whatever you want to send
//   });


// function retrieve(key){
//      chrome.storage.sync.get(key,function(result){
//      var dict = JSON.parse(result[key]);
//      console.log("value of keyqa is " + dict.val)
// })
// }

// function storeUserPrefs(key,data) {
     
//      testPrefs = JSON.stringify({
//          'val': data
//      });
//  var jsonfile = {};
//  jsonfile[key] = testPrefs;
//  chrome.storage.sync.set(jsonfile, function () {
//      console.log('Saved');
//  });
// }


// function storeData(key,data) {
 
//  container = JSON.stringify({
//      'val' : data
//  });
// var jsonfile = {};
// jsonfile[key] = container;
// chrome.storage.sync.set(jsonfile, function () {
// });
// }