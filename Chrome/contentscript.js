const url = "https://86ke5oq1na.execute-api.ap-southeast-1.amazonaws.com/default/mySimpleFunction";

var data = {
  "sentence": "text one two three! asd_ asd"
};

console.log("Script injected!");
// console.log(localStorage["counter"]);

var data2 = JSON.stringify(data);
// var x = document.getElementsByClassName("forum");
// console.log(x[0].innerHTML);
// console.log(x.length);
// console.log(x[0].childNodes[1].querySelector('a').innerHTML);    // Gets Title of Thread 0
// if (x[0].childNodes[1].querySelector('p') !== null){    // Gets Description of thread 0 (If it exists)
//   console.log(x[0].childNodes[1].querySelector('p').innerHTML);
// }   

var y = document.getElementsByClassName('discussion_post');    //For posts in conversation screen
console.log(y.length);
console.log(y[0].querySelector('p').innerHTML);
// ajaxPost();

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

for (var i = 0;i < y.length; i++ ){
     data = {
          "sentence" : y[i].querySelector('p').innerHTML
     };
     data2 = JSON.stringify(data);
     ajaxPost(y[i].querySelector('p'));
     // if (localStorage["counter"] !== 0){
     //      localStorage["counter"] = 0;
     // } else {
     //      localStorage["counter"] = localStorage["counter"] + 1;
     // }
     // y[i].querySelector('p').appendChild(div);
}



function ajaxPost(element){
  $.ajax({
       type:"POST",
       data: data2,
       url:url,
       success: function(data,status){
            // alert(status);
            // alert("Successful Get!  " + data);
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
chrome.runtime.onMessage.addListener(gotMessage);

// function gotMessage(message, sender, sendResponse){
//   console.log(message);
//   if (message.txt === "start"){
//     start();
//   }
  
// }

// chrome.runtime.sendMessage({
//     total_elements: document.querySelectorAll('*').length // or whatever you want to send
//   });

