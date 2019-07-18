// retrieve("test");

// function retrieve(key){
//      chrome.storage.sync.get(key,function(result){
//      var dict = JSON.parse(result[key]);
//      console.log("value of key is " + dict.val);
//      })
// }
// // main();

// var key = "isOn";

// chrome.storage.sync.get(key,function(result){
//      if (result[key] === undefined){
//           storeData(key,true);
//           console.log("Undefined, switched to on");
//           main();
//           return;
//         }
        
//      var dict = JSON.parse(result[key]);
//      console.log("Switch is " + dict.val);
//      if (dict.val ===  true){
//           main();
//         }
// });

main();

function main(){

const url = "https://86ke5oq1na.execute-api.ap-southeast-1.amazonaws.com/default/mySimpleFunction";

var y = document.getElementsByClassName('discussion_post');    //For posts in conversation page
console.log("Number of Discussion posts detected = " + y.length); // y.length == number of posts detected

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
               retrieveStorage(x_row,i,key);
          }
         
          var header = x[0].querySelector("thead").querySelector("tr");
          
          
          var td = document.createElement("td");
          if (i === 0){       // Check if its the first row (Header)
               console.log("aa");
               var div = document.createElement("div");
               div.innerHTML = "";
               td.append(div);
               div.className = "tip";
               var span = document.createElement("span");
               span.innerHTML = "An Exclamation mark will be displayed for a forum thread if intervention is recommended";
               span.className = "tooltiptext";
               div.appendChild(span);
               // var div = document.createElement("DIV");
               // div.id = "alertThread";
               var icon = document.createElement("i");
               icon.className = "fa fa-question-circle";
               div.appendChild(icon);
               
               // span.className = "tooltiptext";
               // div.appendChild(span);
               header.insertBefore(td,header.childNodes[1]);
          }
     }
}



// ///////////////////////////////////////////////////////
// /////////////  CONVERSATION VIEW //////////////////////
// ///////////////////////////////////////////////////////

if (y.length > 0){
     var wordcount = 0;
     var latestPostTime = 0;
     for (var i = 0;i < y.length; i++ ){
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
     ajaxPost(x[0],latestPostTime);
     retrieve(threadTitle);
}

///////////////////////////////////////////////////////
///////////////////  FUNCTIONS ////////////////////////
///////////////////////////////////////////////////////


function appendMsg(element,message){
     var div = document.createElement("DIV");
     div.id = "noalertThread";
     var para = document.createElement("P");
     para.innerHTML = message;
     div.appendChild(para);
     element.appendChild(div);
}

function appendAlert(element,message){
     var div = document.createElement("DIV");
     div.id = "alertThread";
     var icon = document.createElement("i");
     icon.className = "fa fa-exclamation";
     icon.id = "inline";
     div.append(icon); 
     var para = document.createElement("P");
     var text = " " + message;
     para.innerHTML = text;
     div.appendChild(para);
     
     element.appendChild(div);
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
               var interventionProb = Math.round((data["1"]*100))/100.0;
               console.log("Predictions probabilities for [0] " + data["0"]);
               console.log("Predictions probabilities for [1] " + interventionProb);
               
               var msg = ("Probability of intervention required: " + interventionProb + "%");
               
               console.log(msg);
               if (data["0"] > data["1"]){
                    storeData(threadTitle,0,timestamp);
                    console.log(timestamp);               
                    msg = "This thread does not seem to require intervention (" + interventionProb + "%)";
                    appendMsg(element,msg);
               } else {
                    storeData(threadTitle,1,timestamp);    
                    msg = "Intervention is recommended for this thread (" + interventionProb + "%)";           
                    // appendMsgImg(element,msg, chrome.runtime.getURL('exclaimFilled.png'));
                    appendAlert(element,msg);
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
     td.id = "mark";
     
     chrome.storage.sync.get(key,function(result){
          if (result[key] === undefined){
               console.log("No previous storage data!");
               // var img = document.createElement("img");
               // img.src = chrome.runtime.getURL('questionMark.png');
               // td.appendChild(img);
               var icon = document.createElement("i");
               icon.className = "fa fa-question";
               td.append(icon);
               element.insertBefore(td,element.childNodes[1]);
               return;
          }
          var dict = JSON.parse(result[key]);

          // if (dict.timestamp < 987495360000){
          //      td.innerHTML = "Requires Reprocessing";
          //      element.insertBefore(td,element.childNodes[2]);
          //      return;
          // }

          if (dict.val == 0){
               td.innerHTML = ""; 
               var icon = document.createElement("i");
               // icon.className = "fa fa-window-minimize";
               // td.append(icon);
               element.insertBefore(td,element.childNodes[1]);  
          } else if (dict.val == 1) {
               td.innerHTML = "";
               var icon = document.createElement("i");
               icon.className = "fa fa-exclamation";
               td.append(icon); 
               element.insertBefore(td,element.childNodes[1]);
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

function retrieve(key){
     chrome.storage.sync.get(key,function(result){
     var dict = JSON.parse(result[key]);
     console.log("value of key is " + dict.val);
     })
}
}