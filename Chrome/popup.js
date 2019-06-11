function myFunction() {
     var text = 0;
     var text = document.getElementById("inputA").value;
     alert(text);
     document.getElementById("inputB").value = text;
}

function myFunction2() {
     var text = 0;
     var text = document.getElementById("inputA").value;
     alert("second function");
     document.getElementById("inputB").value = text;
}

// document.getElementById("qwerty").onclick = myFunction2;



const url = "https://86ke5oq1na.execute-api.ap-southeast-1.amazonaws.com/default/mySimpleFunction";
// const url = "www.google.com";

$( "#button2" ).css( "border", "3px solid red" );
// $(document).ready(function(){
//      $("#button2").click(function(){
//           $.get(url, function(data, status){
//           alert("Successful Get!")
//           //  alert("Data: " + data + "\nStatus: " + status);
//           }).always(function(){
//                alert("finished");
//           });
//           alert("text");
//      });
//    });



$(document).ready(function(){
     $("#button2").click(function(){
          var text = document.getElementById("inputA").value;
          data = {
               "sentence": text
             };
          data2 = JSON.stringify(data);
          ajaxPost();
          // alert("Initiated");
     });
});
// ajaxPost();


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
                    // alert("asdasdasdasd");
               }
               // alert("Failed Get :( " + xhr.responseText);
               $("#Response").text("Failure");
          }
     })
     // alert("Initiated");
}