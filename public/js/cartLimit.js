function checkRange(id) {
	var quant = document.getElementById(id);
	if(quant.value < 0){
		quant.value = 0;
	} else if(quant.value > 99){
		quant.value = 99;
	}
	$('#'+id+'form').submit();
}

function minusQuantity(id){
	var currValue = $('#'+id).attr('value');
	currValue--;
	$('#'+id).attr('value', currValue);
	checkRange(id);
}

function plusQuantity(id){
	var currValue = $('#'+id).attr('value');
	currValue++;
	$('#'+id).attr('value', currValue);
	checkRange(id);
}