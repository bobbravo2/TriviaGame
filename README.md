# Famous Quote Trivia
Week 5 homework for Rutgers Coding Bootcamp.

LIVE PREVIEW --> https://famous-quote-trivia.herokuapp.com/

## Screenshots

Main
------
![Main Image](/readme_images/main.png?raw=true"main.png")

Question | Correct
-------------|--------
![Question Image](/readme_images/question.png?raw=true"question.png") | ![Correct Image](/readme_images/correct.png?raw=true"correct.png")

Incorrect | Result
-------------|--------
![Incorrect Image](/readme_images/incorrect.png?raw=true"incorrect.png") | ![Result Image](/readme_images/result.png?raw=true"result.png")

## User Story
* Only one question will be shown at a time.
* The time limit will apply to each question, and when the time runs out, the game will show a screen with the correct answer, and then move on to the next question without user input.
* If the user chooses the correct answer, the game will show a screen letting them know the answer was correct, and then move on to the next question without user input.
* If the user chooses the incorrect answer, the game will show a screen with the correct answer, and then move on to the next question without user input.
* On the final screen, show the number of correct answers, incorrect answers, and an option to restart the game (without reloading the page).

## Technologies used
- HTML
- CSS (media queries, font-awesome, google fonts)
- JavaScript/jQuery
- AJAX for Random Famous Quotes API (mashape) & Giphy API

## How to Play

1. Click "Start" to begin
2. Read the question and click on the correct answer
3. Laugh at the giphy provided with your result
4. Review ending results and play again

## Built With

* Sublime Text
* Gimp

## Deployed With

* Heroku (PHP)

## Walk throughs of code

Most interesting JavaScript code
```
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
      // Recursively gets quotes until it reaches 4
      if (counterQuotes < 4) generateFourQuotes();
      else {
        // First question quotes add start button
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
        }
        // Other question quotes animate to next
        else {
          animateTextAll();
          animateColor();
          setTimeout(erase,500);
        }
      }
    }
  });
}
```

## Author

* [Matthew Bajorek](https://www.linkedin.com/in/matthewbajorek)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* All those hours spent playing Pokemon as a kid