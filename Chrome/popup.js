const url = "https://86ke5oq1na.execute-api.ap-southeast-1.amazonaws.com/default/mySimpleFunction";

// alert("Hello world from contentscripts");

//  chrome.runtime.onMessage.addListener(
//      function(request, sender, sendResponse) {
//        // listen for messages sent from background.js
//        if (request.message === 'hello!') {
//          alert(request.url) // new url is now in content scripts!
//        }
//    });

// Update the relevant fields with the new data.
// const setDOMInfo = info => {
//      document.getElementById('total').textContent = info.total;
//      document.getElementById('inputs').textContent = info.inputs;
//      document.getElementById('buttons').textContent = info.buttons;
//    };
   
//    // Once the DOM is ready...
//    window.addEventListener('DOMContentLoaded', () => {
//      // ...query for the active tab...
//      chrome.tabs.query({
//        active: true,
//        currentWindow: true
//      }, tabs => {
//        // ...and send a request for the DOM info...
//        chrome.tabs.sendMessage(
//            tabs[0].id,
//            {from: 'popup', subject: 'DOMInfo'},
//            // ...also specifying a callback to be called 
//            //    from the receiving end (content script).
//            setDOMInfo);
//      });
//    });

// $("#Response").text("Total number of elements on this page: " + localStorage["total_elements"]);

function popup() {
     
     chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
     console.log(tabs);
     var activeTab = tabs[0];
     console.log(activeTab);
     console.log(activeTab.id);
     chrome.tabs.sendMessage(activeTab.id, {"message": "clear"});
     alert("Message sent");
    });
 }
 
 document.addEventListener("DOMContentLoaded", function() {
   document.getElementById("btn").addEventListener("click", popup);
 });

function ajaxPost(){
     $.ajax({
          type:"POST",
          data: data2,
          url:url,
          success: function(data,status){
               // alert(status);
               // alert("Successful Get!  " + data);
               $("#Response").text(data);
          },
          error: function (jqxhr,statusCode){
               alert(jqxhr.status);
               try{
                    jsonValue = jQuery.parseJSON( jqxhr.responseText );
               } catch(err) {
                    alert(err);
               } finally {
               }
               $("#Response").text("Failure");
          }
     })
}