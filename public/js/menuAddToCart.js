$(document).ready(function(){
  $(".cartForm").on("submit", function(ev) {
    var idToChange = $(this).attr('id');
    ev.preventDefault();
    // console.log(ev);
    // console.log($("#"+idToChange+" button").attr("value"))
    var valueToSend = $("#"+idToChange+" button").attr("value");
    var data = {submit: valueToSend};
    $.post("/addToCart", data, function(resp) {
      console.log("test")
    }) 
  })
})