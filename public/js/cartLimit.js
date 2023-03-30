function checkRange(id) {
	var quant = document.getElementById(id);
	if(quant.value < 0){
		quant.value = 0;
	} else if(quant.value > 99){
		quant.value = 99;
	}
}