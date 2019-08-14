///////////////////////////////////////////
///// Code for checking if extension "isOn", set by user using the button in popup
//////////////////////////////////

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

     var y = document.getElementsByClassName('discussion_post');    // Retrieves array of 'discussion_posts"
     console.log("Number of Discussion posts detected = " + y.length);

     ///////////////////////////////////////////////////////
     ///////////////////  THREAD VIEW //////////////////////
     ///////////////////////////////////////////////////////

     if (y.length === 0 ){ // If number of discussion posts == 0 -> thread view page
          var x = document.getElementsByClassName('forum-list'); // Retrives thread list
          for (var i = 0;i<x[0].querySelectorAll('tr').length;i++) {        //For every thread, check storage for processed info (if any)
               var x_row = x[0].querySelectorAll('tr')[i];
               if (i !== 0){
                    var key = x_row.childNodes[1].querySelector('a').getAttribute('href');
                    console.log(x_row.childNodes[1].querySelector('a').getAttribute("href"));
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
                    var icon = document.createElement("i");
                    icon.className = "fa fa-question-circle";
                    div.appendChild(icon);
                    header.insertBefore(td,header.childNodes[1]); // Insert Tooltip (as first row)
               }
          }
     }



     // ///////////////////////////////////////////////////////
     // /////////////  CONVERSATION VIEW //////////////////////
     // ///////////////////////////////////////////////////////

     if (y.length > 0){    // If discussion posts detected -> Conversation view
          var wordcount = 0; 
          var latestPostTime = 0;
          for (var i = 0;i < y.length; i++ ){
               var postbody = y[i].getElementsByClassName('body')[0].querySelectorAll('p'); 
               for (var k = 0; k < postbody.length;k++){      // Counts and adds number of words in the post(s) and add to wordcount
                    // console.log(posts[k].innerHTML);
                    wordcount += postbody[k].innerHTML.split(" ").length;
               }
               console.log("Current word at post " + i + " is " + wordcount);
               // var timestamp = y[i].getElementsByClassName('timestamp')[0]; 
               // console.log(timestamp.innerHTML);
               // var time = Date.parse(reformatDate(timestamp.innerHTML));
               // if (latestPostTime < time){             //Keeps track of the timing of the latest post (Currently not used)
               //      latestPostTime = time;
               // }
          }

          var data = {};

          var x = document.getElementsByClassName('page-header');
          
          var pathname = window.location.pathname;
          console.log(pathname);

          var data = [0,wordcount,0,0.2];      // Formats data in 4x1 array (placeholder, wordcount , placeholder, placeholder)
          var data2 = JSON.stringify(data);    // Converts into JSON format
          ajaxPost(x[0],latestPostTime);       // POST function to AWS Lambda
     }

     ///////////////////////////////////////////////////////
     ///////////////////  FUNCTIONS ////////////////////////
     ///////////////////////////////////////////////////////


     function appendMsg(element,message){ // Appends message passed to function
          var div = document.createElement("DIV");
          div.id = "noalertThread";
          var para = document.createElement("P");
          para.innerHTML = message;
          div.appendChild(para);
          element.appendChild(div);
     }

     function appendAlert(element,message){ // Appends the alert message (for when intervention is predicted)
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

     function ajaxPost(element,timestamp){    // Function to make POST request to AWS Lambda
          $.ajax({
               type:"POST",
               data: data2,
               url:url,
               success: function(data,status){    // Callback function modifies DOM tree based on probabilities computed by the model
                    var interventionProb = Math.round((data["1"]*100))/100.0; 
                    console.log("Predictions probabilities for [0] " + data["0"]);
                    console.log("Predictions probabilities for [1] " + interventionProb);
                    
                    var msg = ("Probability of intervention required: " + interventionProb + "%");
                    
                    console.log(msg);
                    if (data["0"] > data["1"]){      // Based on whether intervention is probable, save result and append the DOM tree accordingly
                         storeData(pathname,0,timestamp);
                         console.log(timestamp);               
                         msg = "This thread does not seem to require intervention (" + interventionProb + "%)";
                         appendMsg(element,msg);
                    } else {
                         storeData(pathname,1,timestamp);    
                         msg = "Intervention is recommended for this thread (" + interventionProb + "%)"; 
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
                    var icon = document.createElement("i");
                    icon.className = "fa fa-question";
                    td.append(icon);
                    element.insertBefore(td,element.childNodes[1]);
                    return;
               }
               var dict = JSON.parse(result[key]);

               // if (dict.timestamp < 987495360000){    // Checks timestamp (not in use)
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

     chrome.runtime.onMessage.addListener(gotMessage); // Listener for clear storage message (From popup)

     function gotMessage(message, sender, sendResponse){
     console.log(message);
     if (message.message === "clear"){
          chrome.storage.sync.clear();
          console.log("Cache Cleared!");
     }
     }

     // function retrieve(key){    // Not in use
     //      chrome.storage.sync.get(key,function(result){
     //      var dict = JSON.parse(result[key]);
     //      console.log("value of key is " + dict.val);
     //      })
     // }
}