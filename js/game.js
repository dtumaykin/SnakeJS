(function(){
//hide JS disable message
$('#nojs').hide();
$('div.intro').css('padding-top', '0')

//testing plus & minus
var plus = $('#plus'),
	minus = $('#minus'),
	diffLevel = $('span.currentDifficulty'),
	currDiffLevel = parseInt(diffLevel.text());

	plus.on('click', function(){
		diffLevel.text(++currDiffLevel);
	});

	minus.on('click', function(){
		diffLevel.text(--currDiffLevel || ++currDiffLevel);
	});

//test div generation
var map = $('div.map').hide(),
	rows = 10,
	divsPerRow = 25;

	map.css("heigth", rows * 10 + 'px')
	
	for(var i = 0; i < rows; i++)
	{
		var row = $('<div></div>').addClass("gridRow");
		for(var j = 0; j < divsPerRow; j++)
			row.append($('<div></div>').addClass("gridDiv"));
		map.append(row);
	}

	//map visualization
	map.slideToggle("slow") //slide down map div
		.delay(100)
		.find('div.gridDiv').each(function(i){
			$(this).css("opacity", 0)
					.delay(i*5)//((Math.floor(Math.random() * 100))*5) //i*5
					.animate({
						opacity: 1,
					}, 1000)
					//.css("background", 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')' )
					;
			});



	//cell mouseover animation
	$('div.gridDiv').on('mouseenter', function(){
		$(this).animate({
			opacity: 0.8
		}, 300);
	});

	$('div.gridDiv').on('mouseleave', function(){
		$(this).animate({
			opacity: 1
		}, 300);
	});



//timer test
var time = $('span.clock'),
	timeText = time.text(),
	m = parseInt(timeText.split(":")[0]),
	s = parseInt(timeText.split(":")[1]),
	updatedTime = function(){

			var rm,
				rs; 

			if(s == 59)
			{
				s = 0;
				m++;
				if(m == 59)
					m = 0;
			}
			s++;

			rm = m;
			rs = s;

			if(m < 10)
				rm = '0' + m;
			if(s < 10)
				rs = '0' + s;

			return 	rm + ":" + rs;

	}
	t = setInterval(function(){ //timer
		time.text(updatedTime());
	}, 1000);

	//fun effects etc
	$('div.intro').animate(
	{
		'padding-top': 90
	}, 500);
})();
