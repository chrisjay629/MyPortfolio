var theFaves = document.getElementById('faves');
$('.painting')
	.bind('dragstart', function (evt) {
		evt.dataTransfer.setData('text', this.id);
		$('h2').fadeIn('fast');
	})
	.hover(
		function () { $('div', this).fadeIn(); },
		function () { $('div', this).fadeOut(); }
	);

$('#favorites')
	.bind('dragover', function (evt) {
		$('#favorites').css('background-color','gray');
		evt.preventDefault();
	})
	.bind('dragleave', function (evt) {
		$('#favorites').css('background-color','gray');
		evt.preventDefault();
	})
	.bind('dragenter', function (evt) {
		evt.preventDefault();
	})
	.bind('drop', function (evt) {
		var id = evt.dataTransfer.getData('text'),
			item = $('#' + id),
			favList = $("#faves"),
			prevFavItem = null;
			prevFavItem = $('<li />', {
				text : $('p:first', item).text(),
				data : { id : id }
			}).appendTo(favList);
		$('#favorites').css('background-color','rgba(68, 58, 58, 0.98)');

		saveFaves();

		evt.stopPropagation();
		return false;
	});

	function saveFaves() {
		localStorage.setItem('favorites', theFaves.innerHTML);
	};

	loadFaves("loadFaves");

	function loadFaves() {
		  // when the page loads
	  if ( localStorage.getItem('favorites') ) {
		theFaves.innerHTML = localStorage.getItem('favorites');
	  }
	};

	function printValue(sliderID, textbox) {
			var x = document.getElementById(textbox);
			var y = document.getElementById(sliderID);
			x.value = y.value;
	}

	window.onload = function() { printValue('slider', 'rangeValue') };

	$('#painting1').data({ id:1, price:20 });
	$('#painting2').data({ id:2, price:13 });
	$('#painting3').data({ id:3, price:7 });
	$('#painting4').data({ id:4, price:15 });
	$('#painting5').data({ id:5, price:20 });
	$('#painting6').data({ id:6, price:13 });
	$('#painting7').data({ id:7, price:16 });
	$('#painting8').data({ id:8, price:18 });
	$('#painting9').data({ id:9, price:10 });



	$(document).ready(function () {
		var theValue;

		$("#slider").change(function() {
			theValue = $("#rangeValue").val();
			filterItems(theValue) ;
		});
	});

	function filterItems(priceCriteria)
	{
		$.each($('#gallery div'), function(i, item) {
			$item = $(item);
			itemData = $item.data();
			if(itemData.price <= priceCriteria)
			{
				$item.animate({opacity: 1});
				itemData.matching = true;
			}
			else
			{
				$item.animate({opacity: 0.5});
				itemData.matching = false;
			}
		});
	}
