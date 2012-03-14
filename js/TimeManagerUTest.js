var timer = new TimeManager(1000, true);

// Testing callbacks
timer.AddCallback(function(){
	console.log('tick - function')
});

timer.AddCallback({
	func: function (val, val2)
		{
			console.log("tick - object, args:" + val + " " + val2);
		},
	args: {
		arg1: 10,
		arg2: 20
	}
})

// Testing time display
timer.AddCallback(function(){ // oh sweet callbacks
	console.log('minutes: ' + timer.GetMinutes());
	console.log('seconds: ' + timer.GetSeconds());
	console.log(timer.GetTime());
});