
function popup() {
     
     chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
     console.log(tabs);
     var activeTab = tabs[0];
     console.log(activeTab);
     console.log(activeTab.id);
     chrome.tabs.sendMessage(activeTab.id, {"message": "clear"});
    });
 }
 
 document.addEventListener("DOMContentLoaded", function() {
   document.getElementById("btn").addEventListener("click", popup);
   document.getElementById("onoff").addEventListener("click",toggle)
 });

var key = "isOn";

chrome.storage.sync.get(key,function(result){
  if (result[key] === undefined){
    storeData(key,true);
    document.getElementById("onoff").innerText="Turn Off";
    return;
  }
  var dict = JSON.parse(result[key]);
  console.log("Switch is " + dict.val);
  if (dict.val ===  true){
    document.getElementById("onoff").innerText="Turn Off";
  } else{
    document.getElementById("onoff").innerText="Turn On";
  }
});

function toggle(){
  chrome.storage.sync.get(key,function(result){
    if (result[key] === undefined){
      storeData(key,true);
      console.log("Undefined, switched to on");
      return;
    }
    var dict = JSON.parse(result[key]);
    console.log("Switch is " + dict.val);
    if (dict.val ===  true){
      storeData(key,false);
      console.log("Switched to false");
      document.getElementById("onoff").innerText="Turn On";
    } else{
      storeData(key,true);
      console.log("Switched to True");
      document.getElementById("onoff").innerText="Turn Off";
    }
  })

}

function retrieve(key){
  chrome.storage.sync.get(key,function(result){
  var dict = JSON.parse(result[key]);
  console.log("value of key is " + dict.val);
  })
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