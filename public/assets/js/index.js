$(function(){
	$('.menu').click(function(){
		$('.menuList').animate({right:0},300);
		$('.menuLittle').show();
		$('.container').animate({right:250},300);
		$(this).hide();
	})
	$('.menuList span').click(function(){
		$('.menuList').animate({right:-250},300);
		$('.menuLittle').hide();
		$('.menu').show();
		$('.container').animate({right:0},300);
	})

	
})