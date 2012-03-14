/*
 * TimeManager.js
 * 
 * Handles time. Ticks each n ms, calling a callback function.
 * Can be pause or resetted.
 */

// TODO:
// Add args support for callbacks

 // Creates timer that ticks every `interval`. If `start` is true, timer starts automatically.
 // Array of callbacks functions `funcs` can be passed(as array of functions or as array of objects).
 // 
 // Objects should have the following format:
 // var callback = {
 // 		func: function()
 // 		args: {
 // 			arg1: value,
 // 			arg2: value
 // 			// etc.
 // 		}
 // }

 var TimeManager = function(interval, start, funcs){
 	this.interval = interval || 1000; // interval in ms
 	this.m = 0; // minutes
 	this.s = 0; // seconds
 	this.callbacks = funcs || new Array();
 	this.running = false;

 	if(start == true)
 		this.Start();
 }


 TimeManager.prototype.Tick = function()
 {
 	// update timer
 	this.s++;
 	if(this.s == 60)
 	{
 		this.s = 0;
 		this.m++;
 		if(this.m == 60)
 			this.m = 0;
 	}

 	// call the callbacks
 	for(var fn in this.callbacks)
 	{
 		fn();
 		// TODO: parse callbacks array and call functions with passed args
 	}
 }

 // Adds new callback function
 // You can pass function, or a callback object with following structure:
 // 
 // var callback = {
 // 		func: function()
 // 		args: {
 // 			arg1: value,
 // 			arg2: value
 // 			// etc.
 // 		}
 // }
 TimeManager.prototype.AddCallback = function(fn)
 {
 	this.callback.append(fn);
 }
 
 // Starts the timer
 TimeManager.prototype.Start = function()
 {
 	if(!this.running)
 	{
 		this.running = true;
 		this.t = setInterval(this.interval, this.Tick);
 	}
 }

 // Stops the timer
 TimeManager.prototype.Stop = function()
 {
 	if(this.running)
 	{
 		this.running = false;
 		clearInterval(this.t);
 	}
 }

 //Stops the time, waits for puaseTime and Starts the timer
 TimeManager.prototype.Wait = function(pauseTime)
 {
 	this.Stop();
 	this.t = setTimeout(pauseTime, this.Start);
 }
