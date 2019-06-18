// chrome.tabs.onUpdated.addListener(function
//     (tabId, changeInfo, tab) {
//       // read changeInfo data and do something with it (like read the url)
//       if (changeInfo.url) {
//         alert("sending message");
//         chrome.tabs.sendMessage( tabId, {
//             message: 'hello!',
//             url: changeInfo.url
//           });
//         alert("sent message");
//         // alert(changeInfo.url);
        
//         // alert(window.location.pathname);
//         // do something here
//       }
//     }
//   );

// chrome.runtime.onMessage.addListener((msg, sender) => {
//     // First, validate the message's structure.
//     if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
//       // Enable the page-action for the requesting tab.
//       chrome.pageAction.show(sender.tab.id);
//     }
//   });

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse){
//        localStorage["total_elements"] = request.total_elements;

//        alert(localStorage["total_elements"]);
//        alert(request.total_elements);
//     }
// );

// chrome.runtime.onMessage.addListener(
//     function(message, callback) {
//       if (message == "start"){
//         alert(document.querySelectorAll('*').length);
//       }
//    });