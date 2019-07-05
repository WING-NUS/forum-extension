const url = "https://86ke5oq1na.execute-api.ap-southeast-1.amazonaws.com/default/mySimpleFunction";

// // chrome.storage.sync.clear();


// console.log("Script injected!");

// // var data2 = JSON.stringify(data);
// // var x = document.getElementsByClassName("forum");
// // console.log(x[0].innerHTML);
// // console.log(x.length);
// // console.log(x[0].childNodes[1].querySelector('a').innerHTML);    // Gets Title of Thread 0
// // if (x[0].childNodes[1].querySelector('p') !== null){    // Gets Description of thread 0 (If it exists)
// //   console.log(x[0].childNodes[1].querySelector('p').innerHTML);
// // }   

var y = document.getElementsByClassName('discussion_post');    //For posts in conversation page
console.log("Number of Discussion posts detected = " + y.length); // y.length == number of posts detected

// ///////////////////////////////////////////////////////
// ///////////////////  THREAD VIEW //////////////////////
// ///////////////////////////////////////////////////////

if (y.length === 0 ){ // if not within the conversation page
     var x = document.getElementsByClassName('forum-list');
     console.log(x.length);
     // console.log(x[0].innerHTML);
     for (var i = 0;i<x[0].querySelectorAll('tr').length;i++) {
          // console.log("Iteration: " + i);
          var x_row = x[0].querySelectorAll('tr')[i];    //Select row x
          if (i !== 0){
               var key = x_row.childNodes[1].querySelector('a').innerHTML;
               retrieveStorage(x_row,i,key);
          }
         
          var header = x[0].querySelector("thead").querySelector("tr");
          
          var td = document.createElement("td");
          if (i === 0){       // Check if its the first row (Header)
               td.innerHTML = "Important?";          
               header.insertBefore(td,header.childNodes[2]);
          }
     }
}



// ///////////////////////////////////////////////////////
// /////////////  CONVERSATION VIEW //////////////////////
// ///////////////////////////////////////////////////////
// if (y.length > 0){
          
//      var a = document.getElementsByClassName('page-header');
//      var threadTitle = a[0].childNodes[0].childNodes[0].innerHTML;
//      console.log("length of a: "+ a.length);
//      console.log(threadTitle);
//      var random = Math.random() * 100;
//      random = Math.floor(random);
//      random = random%2;
//      storeData(threadTitle,random);
//      console.log("Random number generated: " + random);
// }

if (y.length > 0){
     var wordcount = 0;
     var latestPostTime = 0;
     for (var i = 0;i < y.length; i++ ){
          // data = {
          //      "sentence" : y[i].querySelector('p').innerHTML
          // };
          // data2 = JSON.stringify(data);
          // ajaxPost(y[i].querySelector('p'));

          var postbody = y[i].getElementsByClassName('body')[0].querySelectorAll('p');
          for (var k = 0; k < postbody.length;k++){
               // console.log(posts[k].innerHTML);
               wordcount += postbody[k].innerHTML.split(" ").length;
          }
          console.log("Current word at post " + i + " is " + wordcount);
          var timestamp = y[i].getElementsByClassName('timestamp')[0];
          console.log(timestamp.innerHTML);
          var time = Date.parse(reformatDate(timestamp.innerHTML));
          if (latestPostTime < time){
               latestPostTime = time;
          }
          
     }

     var data = {};

     var x = document.getElementsByClassName('page-header');
     var threadTitle = x[0].childNodes[0].childNodes[0].innerHTML;

     var data = [0,wordcount,0,0.2];
     var data2 = JSON.stringify(data);
     console.log(data2);
     console.log(latestPostTime);
     ajaxPost(x[0],latestPostTime);
     retrieve(threadTitle);
}

// ///////////////////////////////////////////////////////
// ///////////////////  FUNCTIONS ////////////////////////
// ///////////////////////////////////////////////////////


function appendMsg(element,message){
     var div = document.createElement("DIV");
     div.id = "odd";
     var para = document.createElement("P");
     para.innerHTML = message;
     div.appendChild(para);
     element.appendChild(div);
}

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

function reformatDate(date){       //Reformats date(as a String) from month dd, yyyy hh:mm, removes year
     var temp = date.split(" ");
     var newDate = temp[0] + " " + temp[1] + " " + temp[3];
     return newDate;
}

function ajaxPost(element,timestamp){
     $.ajax({
          type:"POST",
          data: data2,
          url:url,
          success: function(data,status){
               // var temp = JSON.stringify(data);
               // temp = JSON.parse(temp);
               console.log("Predictions probabilities for [0] " + data["0"]);
               
               console.log("Predictions probabilities for [1] " + data["1"]);
               var msg = "Probabilities: {0}:" + data["0"] + ", {1}:" + data["1"];
               console.log(msg);
               appendMsg(element,msg);
               if (data["0"] > data["1"]){
                    storeData(threadTitle,0,timestamp);
                    console.log(timestamp);
               } else {
                    storeData(threadTitle,1,timestamp);
               }
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
     
     chrome.storage.sync.get(key,function(result){
          if (result[key] === undefined){
               console.log("No previous storage data!");
               td.innerHTML = "Conversation Unprocessed";
               element.insertBefore(td,element.childNodes[2]);
               return;
          }
          var dict = JSON.parse(result[key]);
          console.log("asdasdasdasdas " + dict.timestamp);
          if (dict.timestamp < 987495360000){
               td.innerHTML = "Requires Reprocessing";
               element.insertBefore(td,element.childNodes[2]);
               return;
          }
          if (dict.val == 0){
               td.innerHTML = "No attention required";
               element.insertBefore(td,element.childNodes[2]);  
          } else if (dict.val == 1) {
               td.innerHTML = "Attention required!!";
               var img = document.createElement("img");
               img.src = chrome.runtime.getURL('icon_128.png');
               td.appendChild(img); 
               element.insertBefore(td,element.childNodes[2]);
          } else {
               td.innerHTML = "Error! (Should not happen)";
               element.insertBefore(td,element.childNodes[2]);   
          }
     })
}

function storeData(key,data,timestamp) {
 
     container = JSON.stringify({
         'val' : data,
         'timestamp' : timestamp
     });
     console.log(timestamp);
    var jsonfile = {};
    jsonfile[key] = container;
    chrome.storage.sync.set(jsonfile, function () {
    });
}

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse){
  console.log(message);
  if (message.message === "clear"){
     console.log("Cache Cleared!");
     chrome.storage.sync.clear();
  }
}
 
// chrome.runtime.sendMessage({
//     total_elements: document.querySelectorAll('*').length // or whatever you want to send
//   });


function retrieve(key){
     chrome.storage.sync.get(key,function(result){
     var dict = JSON.parse(result[key]);
     console.log("value of key is " + dict.val);
     console.log("Value of timestamp = " + dict.timestamp);
     })
}

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
