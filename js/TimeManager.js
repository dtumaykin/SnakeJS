/*
 * TimeManager.js
 * 
 * Handles time. Ticks each n ms, calling a callback functions.
 * Can be pause or resetted.
 */

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

 	return this;
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
 	for(var idx in this.callbacks)
 	{
 		var callback = this.callbacks[idx]; // get current callback
 		switch (typeof callback)
 		{
 			case 'function': // if a function, call it
 				callback.call();
 				break;
 			case 'object': // if an object, parse arguments, and envoke func with the arguments
 				var args = new Array();

 				for(var argIdx in callback.args)
 					args.push(callback.args[argIdx]);

 				callback.func.apply(null, args); // envoke functions with right arguments
 				break;

 		}
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
 	this.callbacks.push(fn);
 }
 
 // Starts the timer
 TimeManager.prototype.Start = function()
 {
 	if(!this.running)
 	{
 		this.running = true;
 		this.t = setInterval(function(){ // set envoking interval
 			this.Tick.call(this)
 		}.bind(this), this.interval);
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
 	this.t = setTimeout(pauseTime || 1000, this.Start);
 }

 TimeManager.prototype.Pause = TimeManager.prototype.Wait;

 TimeManager.prototype.Reset = function()
 {
 	this.Stop();
 	this.m = 0;
 	this.s = 0;
 }

 TimeManager.prototype.GetSeconds = function()
 {
 	return this.s;
 }

 TimeManager.prototype.GetMinutes = function()
 {
 	return this.m;
 }

 // Returns time string with mm:ss format
 TimeManager.prototype.GetTime = function()
 {
 	var seconds = this.s,
 		minutes = this.m;

 		if(seconds < 10)
 			seconds = '0' + seconds;

 		if(minutes < 10)
 			minutes = '0' + minutes;

 		return minutes + ':' + seconds;
 }