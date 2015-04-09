$(function() {
  
  var handlers = {

    simplePrint : function (location){
      
      var new_location_div = $('<div>');
      new_location_div.addClass('location');
      new_location_div.data('l',location.l);
      new_location_div.data('city',location.name);

      var location_p = $('<p>').text(location.name)
      
      new_location_div.append(location_p);

      $('#search_result').append(new_location_div);
    },

    displayPrint : function (location,day){

      var display = $('<div>');
      display.addClass('display_on')
      location =  $('<p>').text('Location: ' + location);
      high_temp = $('<p>').text('Max. temp: ' + day.high.celsius + 'C / ' + day.high.fahrenheit + 'F');
      min_temp = $('<p>').text('Min. temp: ' + day.low.celsius + 'C / ' + day.low.fahrenheit + 'F');

      display.append(location,high_temp,min_temp);

      // "Thunderstorm" "Chance of Rain" "Overcast" "Partly Cloudy" "Rain" "Clear"

      $('#display_today').slideUp('slow');

      var condition = ['clear', 'sunny'].indexOf(day.conditions.toLowerCase())

      if (condition === -1 ) { 

       $('body').fadeTo('slow', 0, function()
        { 
          $(this).css('background-image', 'url("http://harrymoroz.com/wp-content/uploads/2014/04/1_See_It.jpg")');
        }).fadeTo('slow', 1);
       $('h1').css({'color': 'white'});
       $('.starter-template > p').css({'color': 'white'});
      }else{

        $('body').fadeTo('slow', 0, function()
        { 
          $(this).css('background-image', 'url("https://melodywren.files.wordpress.com/2011/04/p1040585.jpg")');
        }).fadeTo('slow', 1);
       $('h1').css({'color': 'rgb(#333)'});
       $('p').css({'color': 'rgb(#333)'});
      };

      setTimeout(function(){
        $('.display_on').remove();
        $('#display_today').append(display);
        $('#display_today').slideDown('400');
      }, '800');

    }

  }

  //when search submit button is pressed
  $('#search_form_submit').on('click keypress',  function(event) {
    event.preventDefault();
      
    var search_query = $('#search_field').val();
    if (!search_query) {
      $('.location').remove();
      return;
    };  
    $.ajax({
      url: 'http://autocomplete.wunderground.com/aq?query=' + search_query ,
      type: 'GET',
      dataType: 'jsonp',
      jsonp: 'cb', 
      })
        .done(function(search_api_answer) {
        $('.location').remove();  

      search_api_answer.RESULTS.filter(function(location){
         return location.type === 'city'
      }).forEach(handlers.simplePrint);
    });

    $('#search_form').trigger("reset");
        
  });

  //when location is selected
  $('#search_result').on('click', '.location', function(event) {
    event.preventDefault();
    
    var selected_location = $(this)

    var lCode = selected_location.data('l');
  
    $.ajax({
      url: 'http://api.wunderground.com/api/b95062094b6aa5b5/forecast/' + lCode + '.json',
      type: 'GET',
      dataType: 'json',
      // jsonp: 'cb',
    })
    .done(function(api_city_forecast) {
      todayForecast = api_city_forecast.forecast.simpleforecast.forecastday[0];
      cityForecast = selected_location.data('city');

      handlers.displayPrint(cityForecast,todayForecast);

    });
      
  });



});

