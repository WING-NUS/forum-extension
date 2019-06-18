

// // Inform the background page that 
// // this tab should have a page-action.
// chrome.runtime.sendMessage({
//     from: 'content',
//     subject: 'showPageAction',
//   });
  
//   // Listen for messages from the popup.
//   chrome.runtime.onMessage.addListener((msg, sender, response) => {
//     // First, validate the message's structure.
//     if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
//       // Collect the necessary data. 
//       // (For your specific requirements `document.querySelectorAll(...)`
//       //  should be equivalent to jquery's `$(...)`.)

//       var domInfo = {
//         total: document.querySelectorAll('*').length,
//         inputs: document.querySelectorAll('input').length,
//         buttons: document.querySelectorAll('button').length,
//       };
  
//       // Directly respond to the sender (popup), 
//       // through the specified callback.
//       response(domInfo);
//     }
//   });

const url = "https://86ke5oq1na.execute-api.ap-southeast-1.amazonaws.com/default/mySimpleFunction";

var data = {
  "sentence": "text one two three! asd_ asd"
};

console.log(data);

var data2 = JSON.stringify(data);
ajaxPost();

function ajaxPost(){
  $.ajax({
       type:"POST",
       data: data2,
       url:url,
       success: function(data,status){
            // alert(status);
            // alert("Successful Get!  " + data);
            console.log(data);
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

function gotMessage(message, sender, sendResponse){
  console.log(message);
  if (message.txt === "start"){
    start();
  }
  
}

function start(){
    alert("started");
}


// chrome.runtime.sendMessage({
//     total_elements: document.querySelectorAll('*').length // or whatever you want to send
//   });

