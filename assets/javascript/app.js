$(document).ready(function() {
	var quoteLoading = {
			words: [],
			author: []
		};
	var quote = {
			words: [],
			author: []
		};
	var counter = 0;
	var first = true;
	var interval;
	var time = 30;
	var isRunning = false;
	var randomNum;
	var pictureURL;
	var picture;

	// Get quotes
	function generateFourQuotes() {
		$.ajax({
			headers: {
				"X-Mashape-Key": "1r3SUQqvVMmsh7OI2X0f945OfE46p150Pt1jsnTWlWnhFjVEoy",
	    	"Accept": "application/json",
	    	"Content-Type": "application/x-www-form-urlencoded"
			},
			url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies',
			dataType: 'json',
			success: function(data) {
				quoteLoading.words.push(data.quote);
				quoteLoading.author.push(data.author);
				counter++;
				if (counter < 4) generateFourQuotes();
				else {
					console.log(quoteLoading.words);
					console.log(quoteLoading.author);
					if (first) {
						first = false;
						$('.holder').append('<button class="start">Start</button>');
						$('.start').on('click',start);
					}
				}
			}
		});
	}
	// Get giphy
	function generateGiphy() {
		var search = encodeURIComponent(quote.author[randomNum]).replace(/%20/g, '+');
		console.log(search);
		$.ajax({
			url: 'http://api.giphy.com/v1/gifs/search?limit=1&fmt=json&api_key=dc6zaTOxFJmzC&q=' + search,
			success: function(data) {
				pictureURL = data.data[0].images.fixed_height.url;
			}
		});
	}
	function selection(correct) {
		// Turn off click
		$('.holder').off('click', 'a');
		// Clear timer interval and change is running
		clearInterval(interval);
		isRunning = false;
		// Remove all questions and answer
		$('.holder').children().remove();
		if (correct) {
			$('.holder').append('<h1>Correct!</h1>');
		} else {
			$('.holder').append('<h1>Incorrect!</h1>');
			$('.holder').append('<h2>The Correct Answer was: ' + quote.author[randomNum] + '</h2>');
		}
		$('.holder').append('<img src="' + pictureURL + '">');
		// Erase picture after 3 seconds
		picture = setInterval(erase,5000);
		// Load reset counter and new quotes
		counter = 0;
		generateFourQuotes();
	}
	function erase() {
		// Clear interval
		clearInterval(picture);
		// Clear holder
		$('.holder').empty();
		// Reset timer
		time = 30;
		$('.holder').append('<div class="timer">Time Remaining: ' + time + '</div>');
		if (!isRunning) {
			timer();
		}
		// Show new questions
		show();
	}
	function show() {
		// Copy quotes over
		quote = quoteLoading;
		// Erase quote loading and counter
		quoteLoading = {
			words: [],
			author: []
		};
		/*// Load reset counter and new quotes
		counter = 0;
		generateFourQuotes();*/
		// Select random quote of the four
		randomNum = Math.floor((Math.random()*3)+1);
		// Ajax request for picture
		generateGiphy();
		// Show random quote
		$('.holder').append('<p>"' + quote.words[randomNum] + '"</p>');
		// Show all the of authors
		for (var i=0; i<quote.words.length; i++) {
			$('.holder').append('<a data-num="' + i + '">' + quote.author[i] + '</a>');
		}
		// Start click handler for selection
		$('.holder').on('click', 'a', function() {
			if ($(this).attr('data-num') == randomNum) {
				selection(true);
			} else {
				selection(false);
			}
		});
	}
	function timer() {
		isRunning = true;
		interval = setInterval(function() {
			time--;
			$('.timer').text('Time Remaining: ' + time);
			if (time == 0) {
				clearInterval(interval);
				isRunning = false;
				$('.timer').text('Time is up!');
			}
		}, 1000);
	}
	function start() {
		// Turn off click so multiple starts doesn't happen
		$('.start').off('click');
		// Remove start button
		$('.start').remove();
		// Add the time
		$('.holder').append('<div class="timer">Time Remaining: ' + time + '</div>');
		if (!isRunning) {
			timer();
		}
		// Show the quotes
		show();
	}
	
	// Start with first request for quotes
	generateFourQuotes();

});