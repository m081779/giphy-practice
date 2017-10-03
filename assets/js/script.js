$(document).ready(function () {

//giphy application object
var giphy = {
		//initializing array to store buttons
		rating: '',
		buttonArr: [],	

		//method that creates and appends buttons
		createButton: function () {
			//clears any previous buttons so buttons aren't re-added
			$('.button-box').empty();
			//loop that creates buttons for every index of buttonArr
			for (var i = 0; i<giphy.buttonArr.length; i++) {
				//creates a button element in memory with bootstrap classes
				var btn = $('<button class="button btn btn-primary btn-large">');
				//sets text of the button to the string at index i and appends btn to .button-box
				btn.text(giphy.buttonArr[i])
				   .appendTo('.button-box');
			}//end of for loop
		},//end of createButton method

		//method that executes an ajax request and displays results to screen
		showGiphy: function () {

			//empties .display of previous gifs
			$('.display').empty();
			//code that structures the ajax query url
			giphy.queryURL = "https://api.giphy.com/v1/gifs/search";
			giphy.queryURL += '?' + $.param({
				'q': giphy.queryTerm,
				'api_key': "vM9vIaMqN7X9I2ar4hHiG2SD8bYv5Zgm",
				'limit': "10",
				'rating': giphy.rating
			});
			console.log(giphy.queryURL);
			//ajax request
			$.ajax({
				url: giphy.queryURL,
				method: 'GET'
		    }).done(function(obj) {
		    	//loops through all of the gifs returned in the request
	    		for (var i = 0; i<obj.data.length; i++) {
	    			//creates an image element in memory
					var img = $("<img class='img'>");
					//sets attributes that store urls for still and animated gifs, and the current state
					img.attr({
						'src':  obj.data[i].images.fixed_height_still.url,
						'data-animate': obj.data[i].images.fixed_height.url,
						'data-still': obj.data[i].images.fixed_height_still.url, 
						'data-state':'still'
					//and appends them to the element with class 'display'	
					}).appendTo('.display');
				}//end of for loop
		    });//end of done method
		}//end of showGiphy method

	}//end of giphy object

////////////////////////////event listeners////////////////////////////

	$('.rating').on('click', function () {
		giphy.rating = $(this).attr('id');
		if (giphy.rating==='any') {
			giphy.rating = ' '
		}
	});

	//click event that creates a button for text entered as input
	$('#search').on('click', function () {
		//conditional prevents empty buttons from being created
		if ($('#queryTerm').val()!=='') {
			giphy.rating = '';
			//sets queryTerm to the value of the input text
			giphy.queryTerm = $('#queryTerm').val().trim();
			//pushing queryTerm into buttonArr for storage	
			giphy.buttonArr.push(giphy.queryTerm);
			//clearing the input
			$('#queryTerm').val('');
			//running createButton method to display new button to screen
			giphy.createButton();
		}
	});

	//click event that executes showGiphy when queryTerm button is clicked
	$(document).on('click','.button',function () {
		if (!giphy.rating){
			$('#rating-text').addClass('highlight');
		}
		else {
			$('#rating-text').removeClass('highlight');
			//sets current queryTerm to the text of clicked button
			giphy.queryTerm = $(this).text();
			//executes showGiphy method
			giphy.showGiphy();
		}
		giphy.rating = '';
	});

	//keyup event that creates button on enter
	$('#queryTerm').on('keyup', function (event) {
		
		//conditional that checks if enter button is pressed and input has value
		if (event.keyCode===13 && $('#queryTerm').val()!=='') {
			//if enter is pressed...
			//...sets queryTerm to the value of the input text
			giphy.queryTerm = $('#queryTerm').val().trim();
			//pushing queryTerm into buttonArr for storage	
			giphy.buttonArr.push(giphy.queryTerm);
			//clearing the input
			$('#queryTerm').val('');
			//running createButton method to display new button to screen
			giphy.createButton();
		}
	});

	//delegated click event for newly created .img buttons that pauses/unpauses them
	$(document).on('click', '.img', function () {
		//conditional checks if 'data-state' is still or animated,
		//toggles url for animated or still image, and toggles the state to match
		if ($(this).attr('data-state')==='still') {
			$(this).attr('src', $(this).attr('data-animate'));
			$(this).attr('data-state', 'animate');
		} else {
			$(this).attr('src', $(this).attr('data-still'));
			$(this).attr('data-state', 'still');
		}
	});
	//creates button for any queryTerms that are stored in buttonArr on load
	giphy.createButton();
});//end of document ready function

