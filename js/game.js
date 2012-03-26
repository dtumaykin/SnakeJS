(function(){
//hide JS disable message
$('#nojs').hide();
$('div.intro').css('padding-top', '0')

	//fun effects etc
	$('div.intro').animate(
	{
		'padding-top': 90
	}, 500);
})();



var Snake = {
	init: function( config ) {
		this.config = config;
		this.self = this;
		this.lastKey = 'W';
		this.points = 0;
		this.paused = false;

		this.CleanUp();

		// game field
		this.map = {
			rows: [],
			cells: []
		}

		// snake - array of objects {x,y}
		this.snake = [];

		// init the map
		this.config.map.div.empty();
		this.InitMap();

		// bind the events
		this.BindEvents();

		// add timers
		this.CreateTimers();

		// spawn snake
		this.SpawnSnake();

		// spawn food
		this.SpawnFood();
	},

	InitMap: function() {
		var map = this.config.map;

		map.div.hide();
		map.div.css("heigth", map.cols * map.cellSize + 'px');

		for(var i = 0; i < map.rows; i++)
		{
			// create new row
			var row = $('<div></div>').addClass(map.css.rowClass);

			// append cells to row
			for(var j = 0; j < map.cols; j++)
			{	
				var cell = $('<div></div>').addClass(map.css.cellClass);
				cell.data('state', 'nothing');
				// cell.data('pendingUpdate', 'true');
				this.map.cells.push(cell);
				row.append(cell);
			}

			// append row to game div and map container
			this.map.rows.push(row);
			map.div.append(row);
		}

		// map visualization
		map.div .slideToggle("slow") //slide down map div
				.delay(100)
				.find('div.' + map.css.cellClass).each(function(i){ // animate each grid piece
													$(this).css("opacity", 0)
															.delay(i*5)//((Math.floor(Math.random() * 100))*5) //i*5
															.animate({
																opacity: 1,
															}, 1000)
															//.css("background", 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')' )
															;
													});
		
	},

	BindEvents: function() {
		var self = this,
			diffSpan = this.config.currentDifficultySpan;

		self.diffLvl = parseInt(diffSpan.text());

		// bind + and - events
		this.config.time.plusButton.on('click', function() {
			diffSpan.text((self.diffLvl < 20) // limit max level to 20
				? ++self.diffLvl
				: self.diffLvl);

			// broadcast diffChanged event
			$(Snake).trigger("diffChanged", self.diffLvl);
		});

		this.config.time.minusButton.on('click', function() {
			diffSpan.text(--self.diffLvl || ++self.diffLvl);

			// broadcast diffChanged event
			$(Snake).trigger("diffChanged", self.diffLvl);
		});	

		// bind mouseover effects
		this.map.cells.forEach(function(item) {
						item.on('mouseenter', function(){
						$(this).animate({
							opacity: 0.8
						}, 300)});
		});

		this.map.cells.forEach( function(item) {
						item.on('mouseleave', function(){
						$(this).animate({
							opacity: 1
						}, 300)});
		});

		// bind keyboard events
		$('body').on('keydown', function(e)
		{
			var key = String.fromCharCode(e.which);

			if(key == 'P')
			{
				if(!self.paused)
				{
					self.paused = true;
					self.tmClock.Stop();
					self.tmTick.Stop();
				}
				else
				{
					self.paused = false;
					self.tmClock.Start();
					self.tmTick.Start();
				}
				return;
			}

			//filter keys
			key = (key == 'W' ||
					key == 'A' ||
					key == 'S' ||
					key == 'D')
					? key
					: self.lastKey;

			// can't go throw itself
			if(key == 'W' && self.lastKey == 'S')
				key = 'S';
			if(key == 'S' && self.lastKey == 'W')
				key = 'W';
			if(key == 'A' && self.lastKey == 'D')
				key = 'D';
			if(key == 'D' && self.lastKey == 'A')
				key = 'A';

			self.lastKey = key;
		});

		// increment difficulty with time
		$(Snake).bind("incDiff", function()
				{
					self.IncDiff();	
				});

		this.config.time.incCheckbox.on("click", function()
		{
			if(this.checked)
				$(Snake).bind("incDiff", function()
				{
					self.IncDiff();	
				});
			else
				$(Snake).unbind("incDiff");
		});

	},

	CreateTimers: function() {
		var self = this;

		// clock timemanager
		this.tmClock = new TimeManager(1000, true);
		this.tmClock.AddCallback({
			func: this.UpdateTime,
			args: {
				div: this.config.time.clockDiv,
				tm: this.tmClock
			}
		});

		// tick timemanager
		this.tmTick = new TimeManager(1000, true);

		// handle difficulty changes
		$(Snake).bind("diffChanged", function(){
			var newInterval = (self.diffLvl < 10) ? self.diffLvl * 100 : 900 + self.diffLvl*5;
			self.tmTick.ChangeInterval(1100 - newInterval);
		});

		// move snake each tick
		self.tmTick.AddCallback(self.MoveSnake);

		// refresh map each tick
		this.tmTick.AddCallback(this.RefreshMap);
	},

	UpdateTime: function(clockDiv, tm){
		clockDiv.text(tm.GetTime());
	},

	GetCell: function(x, y) {
		if (y < 0 || y >= Snake.config.map.cols) {return undefined;}
		if (x < 0 || x >= Snake.config.map.rows) {return undefined;}
		return Snake.map.cells[x*Snake.config.map.cols + y];
	},

	RefreshMap: function() {
		var self = Snake,
			updateQueue = $.grep(self.map.cells, function(el){
				return el.data('pendingUpdate') == 'true';
			});


		// animate all cells
		$(updateQueue).each(function(i, el){
			var cellState = el.data('state');
			switch(cellState){
				case "snakehead":
					el.animate({
						backgroundColor: "#36F"
					}, 200);
					break;
				case "snakebody":
					el.animate({
						backgroundColor: "#69F"
					}, 200);
					break;
				case "apple":
					el.animate({
						backgroundColor: "#5F5"
					}, 600);
					break;
				case "nothing":
					el.animate({
						backgroundColor: "#FFF"
					}, 200);
					break;
			}
			el.data('pendingUpdate', 'false');
		});
	},

	SpawnSnake: function() {
		this.GetCell(4, 12).data('state', 'snakehead').data('pendingUpdate', 'true');
		this.snake.push({x: 4, y: 12});
		this.GetCell(5, 12).data('state', 'snakebody').data('pendingUpdate', 'true');
		this.snake.push({x: 5, y: 12});
	},

	MoveSnake: function() {
		var self = Snake,
			head = self.snake[0],
			newHead = head,
			inc = false;

			// shiftArrX = [-1, 0, 1, 0]
			// shiftArrY = [0, -1, 0, 1]

		switch(self.lastKey) {
			case 'W':
				if(self.GetCell(head.x-1, head.y))
					newHead = {
						x: head.x-1,
						y: head.y
					};
				else
					self.Finish();
				break;
			case 'A':
				if(self.GetCell(head.x, head.y-1))
					newHead = {
						x: head.x,
						y: head.y-1
					};
				else
					self.Finish();
				break;
			case 'S':
				if(self.GetCell(head.x+1, head.y))
					newHead = {
						x: head.x+1,
						y: head.y
					};
				else
					self.Finish();
				break;
			case 'D':
				if(self.GetCell(head.x, head.y+1))
					newHead = {
						x: head.x,
						y: head.y+1
					};
				else
					self.Finish();
				break;
		}

		// if apple
		if(self.GetCell(newHead.x, newHead.y).data('state') == 'apple')
		{
			inc = true;
			self.SpawnFood();
			self.IncPoints();
		}

		// if head changed, update the array
		if(head.x != newHead.x || head.y != newHead.y)
		{
			self.snake.unshift(newHead); // insert new head

			// update cells
			self.GetCell(newHead.x, newHead.y).data('state', 'snakehead').data('pendingUpdate', 'true');
			self.GetCell(head.x, head.y).data('state', 'snakebody').data('pendingUpdate', 'true');

			if(!inc) { // if snake is not incremented
				var tail = self.snake.pop(); // remove old tail
				self.GetCell(tail.x, tail.y).data('state', 'nothing').data('pendingUpdate', 'true');
			}
		}

		// if head is inside body
		if($.grep(self.snake, function(el, i){
			return i != 0 && el.x == newHead.x && el.y == newHead.y; 
		}).length > 0)	
			self.Finish();

	},

	Finish: function() {
		// stop timers
		this.tmTick.Stop();
		this.tmClock.Stop();

		var endGame = $('<div></div>').addClass('endgame'),
			endGameText = "<h3>The end! You scored " + this.points + " points.</h3>",
			restartButton = $('<button></button>').addClass('restartButton btn').text("Replay").hide();

		endGame.html(endGameText).hide();
		this.config.map.div.prepend(endGame);

		$('div.endgame').slideToggle().append(restartButton);
		$('button.restartButton').delay(1000).slideToggle().on('click', function(){
			Snake.init(config);
		});

	},

	CleanUp: function() {

		this.config.points.text('0');
		this.config.currentDifficultySpan.text('1');

		$(Snake).unbind("incDiff");
		$(Snake).unbind("diffChanged");

		this.config.time.plusButton.unbind("click");
		this.config.time.minusButton.unbind("click");

	},

	SpawnFood: function() {
		var foodX = Math.floor(Math.random()*this.config.map.rows),
			foodY = Math.floor(Math.random()*this.config.map.cols);

		if(this.GetCell(foodX, foodY).data('state') == "snakebody")
			Snake.SpawnFood();
		else
			this.GetCell(foodX, foodY).data('state', 'apple').data('pendingUpdate', 'true');
	},

	IncPoints: function() {
		this.config.points.text(++this.points + " Points");
		if(this.points % this.config.incCoeff == 0)
			$(Snake).trigger("incDiff", this.points);
	},

	IncDiff: function() {
		var self = Snake,
			diffSpan = this.config.currentDifficultySpan;

			diffSpan.text((self.diffLvl < 9) // limit max level to 9
							? ++self.diffLvl
							: self.diffLvl);

			$(Snake).trigger("diffChanged", self.diffLvl);
	}

};

var config = {
	map: {
		div: $('div.map'),
		rows: 10,
		cols: 25,
		cellSize: 10,
		css: {
			rowClass: "gridRow",
			cellClass: "gridDiv"
		}
	},
	time: {
		clockDiv: $('span.clock'),
		plusButton: $('#plus'),
		minusButton: $('#minus'),
		incCheckbox: $('#increasing')
	},
	currentDifficultySpan: $('span.currentDifficulty'),
	points: $('#points'),
	incCoeff: 3
};

Snake.init(config);

// custom event test
// yes jquery is awesome
// $(Snake).on("diffChanged", function(e, newDiffLevel){
// 	console.log("New diff:" + newDiffLevel);
// });

