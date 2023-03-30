
$(document).ready(function(){
  $(".cartForm").on("submit", function(ev) {  
    if($(this).attr('action') != "/login"){
      var idToChange = $(this).attr('id');
      ev.preventDefault();
      // console.log(ev);
      // console.log($("#"+idToChange+" button").attr("value"))
      var valueToSend = $("#"+idToChange+" button").attr("value");
      var data = {submit: valueToSend};
      
      $.post("/addToCart", data, function(resp) {
        console.log("test")
      }) 
      Swal.fire({
        icon: 'success',
        title: 'Product added!',
        background: '#151515',
        color: '#EAEAEA',
        showConfirmButton: false,
        timer: 1500
      })
    }
  })

})