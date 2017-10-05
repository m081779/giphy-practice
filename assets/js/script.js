$(document).ready(function () {

//giphy application object
var giphy = {
		//initializing variables
		rating: '',
		response: '',
		buttonArr: [],	

		//method that creates and appends buttons
		createButton: function () {
			//clears any previous buttons so buttons aren't re-added
			$('.button-box').empty();
			//writes headline to .button-box once buttons are created
			$('.button-box').html('<h4>Click a button below to display images</h4>');
			//loop that creates buttons for every index of buttonArr
			for (var i = 0; i<giphy.buttonArr.length; i++) {
				//creates div to hold .removeButton and .itemButton
				var divButton = $('<div class="divButton">')
				//creates a div in memory with itemButton class
				var itemButton = $('<div class="itemButton"></div>');
				//writes the search text to the div
				itemButton.text(giphy.buttonArr[i]);
				//creates a div in memory with removeButton class
				var removeButton = $('<div class="removeButton">')
				//gives it text of 'X'
				removeButton.text('X');
				//appends removeButton and itemButton to divButton
				divButton.append(removeButton,itemButton)
				//appends divButtons to .button-box
				divButton.appendTo('.button-box');
			}//end of for loop
		},//end of createButton method

		//method that dynamically creates carousel structure
		showCarousel: function () {
			$('.carousel-box').empty();
			//dynamically creates the carousel structure so that the generateCarouselItems method can populate it
			var carouselElement = '<div id="myCarousel" class="carousel slide spaceBelow" data-ride="carousel">'+
								'<ol class="carousel-indicators"></ol>'+
								'<div class="carousel-inner" role="listbox"></div>'+
								'<a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">'+
								'<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>'+
								'<span class="sr-only">Previous</span></a>'+
								'<a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">'+
								'<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'+
								'<span class="sr-only">Next</span></a></div>';
			//inserts the carouselElement in the correct spot in the DOM
			$(carouselElement).appendTo('.carousel-box');
		},

		//method that loops through response and generates carousel items
		generateCarouselItems: function () {
			//loops through all of the gifs returned in the request
    		for (var i = 0; i<giphy.response.data.length; i++) {
    			//creates an image element in memory
				var img = $("<img class='img img-thumbnail'>");
				//creates .item div's to store images for carousel
				var div = $('<div class="item">');
				//creates li's for the indicator circles on carousel
				var li = $('<li>');
				//sets data-target and data-slide-to for carousel
				li.attr({
					'data-target': '#myCarousel',
					'data-slide-to': i
				});
				//appends new li's to .carousel-indicators
				$(li).appendTo('.carousel-indicators');
				//sets attributes that store urls for still and animated gifs, and the current state
				img.attr({
					'src':  giphy.response.data[i].images.fixed_height_still.url,
					'data-animate': giphy.response.data[i].images.fixed_height.url,
					'data-still': giphy.response.data[i].images.fixed_height_still.url, 
					'data-state':'still',
					'alt': 'giphy' + i
					
				//and appends them the .item container
				}).appendTo(div);
				//appends .item divs to .carousel-inner
				$(div).appendTo('.carousel-inner');
				//adds active class to first .item and li to initialize carousel
				$('.item').first().addClass('active');
				$('li').first().addClass('active');
			}//end of for loop
		},

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
			//ajax request
			$.ajax({
				url: giphy.queryURL,
				method: 'GET'
		    }).done(function(obj) {
		    	//stores reference to response object as a variable
		    	giphy.response = obj;
		    	//runs methods that generate and show the carousel of response data
		    	giphy.showCarousel();
		    	giphy.generateCarouselItems();
		    });//end of done method
		}//end of showGiphy method

	}//end of giphy object

////////////////////////////event listeners////////////////////////////


	//click event for rating buttons
	$('.rating').on('click', function () {
		//sets rating to the id of clicked button
		giphy.rating = $(this).attr('id');
		//conditional checks if 'any' button is clicked...
		if (giphy.rating==='any') {
			//...and sets it to blank to omit rating from the search
			giphy.rating = ' ';
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

	//delegated click event that executes showGiphy() when .itemButton is clicked
	$(document).on('click','.itemButton',function () {
		//conditional checks if a rating has been assigned for query...
		if (!giphy.rating){
			//...if not checkMe class is added to remind user
			$('#rating-text').addClass('checkMe');
		}

		else {
			//otherwise the checkMe class is removed
			$('#rating-text').removeClass('checkMe');
			//sets current queryTerm to the text of clicked button
			giphy.queryTerm = $(this).text();
			//executes showGiphy method
			giphy.showGiphy();
		}
		//sets the rating to blank to test every time a button is clicked
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
		} 
		else {
			$(this).attr('src', $(this).attr('data-still'));
			$(this).attr('data-state', 'still');
		}
	});
	//delegated click event that removes buttons when .removeButton is clicked
	$(document).on('click', '.removeButton', function () {
		//stores the value of itemButton's text as a variable
		var value = $(this).siblings().text();
		//removes the entire parent element
		$(this).parent().remove();
		//loop to find removed element in buttonArr
		for (var i = 0; i<giphy.buttonArr.length; i++) {
			//conditional checks if value to be removed is found...
			if (giphy.buttonArr[i]===value) {
				//...if so element is spliced out of array
				giphy.buttonArr.splice(i, 1);
			}
		}
		//conditional checks if buttonArr is empty...
		if (giphy.buttonArr.length===0) {
				//...if so it removes headline text
				$('.button-box').empty();
		}
	});

});//end of document ready function

