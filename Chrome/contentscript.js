const url = "https://86ke5oq1na.execute-api.ap-southeast-1.amazonaws.com/default/mySimpleFunction";

var data = {
  "sentence": "default"
};


// var value = "TestValueascascas";
// var key = "TestKey";
// console.log("Script injected!");

// console.log("attempting to retrieve storage value BEFORE");
// chrome.storage.sync.get(['key'],function(result){
//      console.log("Value currently is " + result.key);
//      console.log("???");
//      if (result.key === undefined){
//           alert("Storage area is empty");
//      }
// })

// chrome.storage.sync.set({key: value}, function(){
//      console.log("value is set to " + value);
//      console.log("Successful storage");
// });

// console.log("attempting to retrieve storage value AFTER");
// chrome.storage.sync.get(['key'],function(result){
//      console.log("Value currently is " + result.key);
//      console.log("asdasdaas");
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
          var x_row = x[0].querySelectorAll('tr')[i];    //Select row x
          // console.log(x_row.innerHTML);
          var td = document.createElement("td");
          td.innerHTML = "I hope this works";
          if (i === 0){
               td.innerHTML = "Important?";
          }
          // x_row.appendChild(td);
          var x_row_elements = td.querySelectorAll('td');
          if (i !== 0){
               var key = x_row.childNodes[1].querySelector('a').innerHTML;
               console.log(key);
               chrome.storage.sync.set({key: i}, function(){
                    console.log("value is set to " + i);
                    console.log("Successful storage");
               });

               chrome.storage.sync.get(['key'],function(result){
                    console.log("Value currently is " + result.key);
                    console.log("asdasdaas");
                    if (isEven(result.key)){
                         console.log("even");
                         td.innerHTML = "Even";
                         
                         x_row.insertBefore(td,x_row.childNodes[2]);
                    } else {
                         console.log ("odd");
                         td.innerHTML = "Odd";
                         
                         x_row.insertBefore(td,x_row.childNodes[2]);
                    }
               })
               
          }    
     }


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

