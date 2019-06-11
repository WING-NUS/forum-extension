const url = "https://86ke5oq1na.execute-api.ap-southeast-1.amazonaws.com/default/mySimpleFunction";

$( "#btn" ).css( "border", "3px solid red" );

$(document).ready(function(){
     $("#btn").click(function(){
          var text = document.getElementById("inputA").value;
          data = {
               "sentence": text
             };
          data2 = JSON.stringify(data);
          ajaxPost();
          // alert("Initiated");
     });
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