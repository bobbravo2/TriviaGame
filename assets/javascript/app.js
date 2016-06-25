$(document).ready(function() {
	var quoteLoading = {
			words: [],
			author: []
		};
	var quote = {
			words: [],
			author: []
		};
	var counterQuotes = 0;
	var first = true;
	var interval;
	var questionNumber=1;
	var time = 30;
	var isRunning = false;
	var randomNum;
	var pictureURL;
	var picture;
	var counterCorrect = 0;
	var counterIncorrect = 0;
	var counterUnanswered = 0;
	var rounds = 10;
	var colors = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857"];
	var numColor;

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
				repeatedQuote: {
					for(var i=0; i<quoteLoading.author.length; i++) {
						if (data.author == quoteLoading.author[i] || data.author == 'Umberto Eco') {
							break repeatedQuote;
						}
					}
					quoteLoading.words.push(data.quote);
					quoteLoading.author.push(data.author);
					counterQuotes++;
				}
				if (counterQuotes < 4) generateFourQuotes();
				else {
					if (first) {
						first = false;
						$('header').append('<button class="start">Start</button>');
						$('.start').css({
							'background-color': colors[numColor],
							'border-color': colors[numColor]
						});
						$('.start').on('mousedown',function() {
							$('.start').off('mousedown');
							animateTextAll();
							animateColor();
							setTimeout(start,500);
						});
					} else {
						animateTextAll();
						animateColor();
						setTimeout(erase,500);
					}
				}
			}
		});
	}
	// Get giphy
	function generateGiphy(randomNum, $this) {
		var search = encodeURIComponent(quote.author[randomNum]).replace(/%20/g, '+');
		$.ajax({
			url: 'https://api.giphy.com/v1/gifs/search?limit=1&fmt=json&api_key=dc6zaTOxFJmzC&q=' + search,
			success: function(data) {
				pictureURL = data.data[0].images.fixed_height.url;
				// Show answer
				if ($this.attr('data-num') == randomNum) {
					animateTextNot();
					setTimeout(function() {
						selection("true")
					},500);
				} else {
					animateTextNot();
					setTimeout(function() {
						selection("false")
					},500);
				}
			}
		});
	}
	function selection(correct) {
		// Turn off click
		$('.answers').off('mousedown', 'a');
		// Clear timer interval and change is running
		clearInterval(interval);
		isRunning = false;
		// Remove all questions and answer
		$('.question').remove();
		$('.answers').remove();
		// Show proper text for each situation
		if (correct == 'true') {
			counterCorrect++;
			$('.holder').append('<h1>Correct!</h1>');
		} else if (correct == 'false') {
			counterIncorrect++;
			$('.holder').append('<h1>Incorrect!</h1>');
			$('.holder').append('<h2>The Correct Answer was: ' + quote.author[randomNum] + '</h2>');
		} else {
			counterUnanswered++;
			$('.holder').append('<h1>Time is Up!</h1>');
			$('.holder').append('<h2>The Correct Answer was: ' + quote.author[randomNum] + '</h2>');
		}
		$('.holder').append('<img id="img-load" src="' + pictureURL + '">');
		// Wait for picture to load
		$('#img-load').load(function() {
			// Erase picture after 4 seconds
			picture = setInterval(function() {
				// Load reset counterQuotes and new quotes
				counterQuotes = 0;
				generateFourQuotes();
			},4000);
		});
	}
	function erase() {
		// Clear interval
		clearInterval(picture);
		// Clear holder
		$('.holder').empty();
		// Check the rounds
		if (counterCorrect+counterIncorrect+counterUnanswered < rounds) {
			// Change question number
			questionNumber++;
			$('.holder').append('<div class="number">Quote: ' + questionNumber + '</div>');
			// Reset timer
			time = 30;
			$('.holder').append('<div class="timer">Time Remaining: ' + time + '</div>');
			if (!isRunning) {
				timer();
			}
			// Readd question and answers divs
			$('.holder').append('<div class="question"></div>');
			$('.holder').append('<div class="answers"></div>');
			// Show new questions
			show();
		} else {
			$('.holder').append('<h1>All done, here\'s how you did!</h1>');
			$('.holder').append('<h2>Correct Answers: ' + counterCorrect + '</h2>');
			$('.holder').append('<h2>Incorrect Answers: ' + counterIncorrect + '</h2>');
			$('.holder').append('<h2>Unanswered: ' + counterUnanswered + '</h2>');
			$('.holder').append('<button class="start">Start Over?</button>');
			$('.start').css({
				'background-color': colors[numColor],
				'border-color': colors[numColor]
			});
			// Reset counters
			counterCorrect = 0;
			counterIncorrect = 0;
			counterUnanswered = 0;
			// Allow player to restart
			$('.start').on('mousedown',function() {
				// Turn off click so multiple starts doesn't happen
				$('.start').off('mousedown');
				animateTextAll();
				setTimeout(start,500);
			});
		}
	}
	function show() {
		// Copy quotes over
		quote = quoteLoading;
		// Erase quote loading
		quoteLoading = {
			words: [],
			author: []
		};
		// Select random quote of the four
		randomNum = Math.floor((Math.random()*3)+1);
		// Show random quote
		$('.question').append('<p><i class="fa fa-quote-left"></i> ' + quote.words[randomNum] + ' <i class="fa fa-quote-right"></i></p>');
		// Show all the of authors
		for (var i=0; i<quote.words.length; i++) {
			$('.answers').append('<a data-num="' + i + '">' + quote.author[i] + '</a>');
		}
		// Start click handler for selection
		$('.answers').on('mousedown', 'a', function() {
			$('.answers').off('mousedown', 'a');
			// Ajax request for picture
			var $this = $(this);
			generateGiphy(randomNum, $this);
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
				selection("time");
			}
		}, 1000);
	}
	function start() {
    // Remove start button beginning
		$('header').remove();
		// Remove start button end
		$('.holder').empty();
		// Add the question number
		$('.holder').append('<div class="number"></div>');
		// Add the time
		$('.holder').append('<div class="timer"></div>');
		// Add questions
		$('.holder').append('<div class="question"></div>');
		// Add answers
		$('.holder').append('<div class="answers"></div>');
		// Show the question number
		$('.number').text('Quote: ' + questionNumber);
    // Show the time
		$('.timer').text('Time Remaining: ' + time);
		// Reset timer
		time = 30;
		$('.timer').text('Time Remaining: ' + time);
		// Start timer
		if (!isRunning) {
			timer();
		}
    // Show the quotes
		show();
	}
	
	// Start with first request for quotes
	generateFourQuotes();

	// Animation
	function animateTextAll() {
		$(".holder").animate({
	    opacity: 0
	  }, 500, function() {
	  	$(this).animate({
	      opacity: 1
	    }, 500);
	  });
	}
	function animateTextNot() {
		$(".holder>*:not(.number):not(.timer)").animate({
	    opacity: 0
	  }, 500, function() {
	  	$(this).animate({
	      opacity: 1
	    }, 500);
	  });
	}

	function animateColor() {
		numColor = Math.floor((Math.random() * colors.length)+1);
		$('body').animate({
			backgroundColor: colors[numColor],
		  color: colors[numColor]
		}, 1000);
		$('.question').animate({
			borderBottomColor: colors[numColor]
		}, 1000);
		$('a:hover').animate({
			outlineColor: colors[numColor]
		}, 1000);
	}

});