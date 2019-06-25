const url = "https://86ke5oq1na.execute-api.ap-southeast-1.amazonaws.com/default/mySimpleFunction";


var data = {
  "sentence": "default"
};

chrome.storage.sync.clear();
var keyqa = "this key has many words";
var key2 = "key2";
var key3 = "key3";
storeData(keyqa,122);
// storeUserPrefs(key2,keyqa);
// storeUserPrefs(key3,keyqa);
for (var a = 0; a < 3 ; a ++ ){
     // var key = "String";
     // console.log(key);
     // storeData(keyqa,a);
     // chrome.storage.sync.get(key,function(result){
     //      var dict = JSON.parse(result[key]);
     //      console.log("value of keyqa is " + dict.val)
     // })
}

 function storeUserPrefs(key,data) {
     
         testPrefs = JSON.stringify({
             'val': data
         });
     var jsonfile = {};
     jsonfile[key] = testPrefs;
     chrome.storage.sync.set(jsonfile, function () {
         console.log('Saved');
     });
 }

 
function storeData(key,data) {
     
     container = JSON.stringify({
         'val' : data
     });
 var jsonfile = {};
 jsonfile[key] = container;
 chrome.storage.sync.set(jsonfile, function () {
 });
}

// var value = "TestValueascascas";
// var keyqwe = "TestKey";
console.log("Script injected!");

// console.log("attempting to retrieve storage value BEFORE");
// chrome.storage.sync.get("mykey",function(result){
//      console.log("Value currently is " + result.key);
//      console.log("???");
//      if (result.key === undefined){
//           alert("Storage area is empty");
//      }
// })

var data2 = JSON.stringify(data);
// var x = document.getElementsByClassName("forum");
// console.log(x[0].innerHTML);
// console.log(x.length);
// console.log(x[0].childNodes[1].querySelector('a').innerHTML);    // Gets Title of Thread 0
// if (x[0].childNodes[1].querySelector('p') !== null){    // Gets Description of thread 0 (If it exists)
//   console.log(x[0].childNodes[1].querySelector('p').innerHTML);
// }   

var y = document.getElementsByClassName('discussion_post');    //For posts in conversation screen
console.log(y.length); // y.length == number of posts detected
// console.log(y[0].querySelector('p').innerHTML);
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
               storeData(key,i);
               // retrieve(key);
               retrieveStorage(x_row,i,key);
          }
         
          var td = document.createElement("td");
          td.innerHTML = "I hope this works " + i;
          if (i === 0){
               td.innerHTML = "Important?";
               x_row.insertBefore(td,x_row.childNodes[2]);
          } else{
               retrieve(key);
          }
          // if (i !== 0){
          //      var key = x_row.childNodes[1].querySelector('a').innerHTML;
          //      console.log(key);
          //      chrome.storage.sync.set({key: i}, function(){
          //           console.log("value is set to " + i);
          //      });

          //      chrome.storage.sync.get(['key'],function(result){
          //           console.log("Value currently is " + result.key);
          //           if (isEven(result.key)){
          //                console.log("even");
          //                td.innerHTML = "Even " + i;
                         
          //           } else {
          //                console.log ("odd");
          //                td.innerHTML = "Odd " + i;
                         
          //           }
          //      })
          
          // x_row.insertBefore(td,x_row.childNodes[2]);     
          // }    
     }
}

function retrieveStorage(element,i,key){
     var td = document.createElement("td");
     td.innerHTML = "I hope this works " + i;
     if (i === 0){
          td.innerHTML = "Important?";
     }
     chrome.storage.sync.get(key,function(result){
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
     // chrome.storage.sync.get(['key'],function(result){
     //      console.log("Value currently is " + result.key);
     //      if (isEven(result.key)){
     //      console.log("even");
     //      td.innerHTML = "Even " + i;               
     //      element.insertBefore(td,element.childNodes[2]);        
     // } else {
     //      console.log ("odd");
     //      td.innerHTML = "Odd " + i;
     //      element.insertBefore(td,element.childNodes[2]);
     // }    
     // element.insertBefore(td,element.childNodes[2]);
}
function retrieve(key){
     chrome.storage.sync.get(key,function(result){
     var dict = JSON.parse(result[key]);
     console.log("value of keyqa is " + dict.val)
})
}
for (var i = 0;i < y.length; i++ ){
     data = {
          "sentence" : y[i].querySelector('p').innerHTML
     };
     data2 = JSON.stringify(data);
     // console.log("Selected paragraph for post " + i + " is " + y[i].querySelector('p').innerHTML);
     ajaxPost(y[i].querySelector('p'));
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

