var jsondata = require('./data.json');



var jsonreccomendations;
var jsonfilter = {
    minrating: 1,
    maxnoratings: 100,
    maxprice: 1,   
}

function filterMinRating(minrating, locations) {

    var filteredlocations = [];

     locations.forEach(function(location){

        if(location.rating >= minrating)
        {
            filteredlocations.push(location)
        }
             
     });

     return filteredlocations;

}

function filterMaxPrice(maxprice, locations) {

    var filteredlocations = [];

     locations.forEach(function(location){



        if (location.price){
            
            var price = location.price.length;

        }
        else{
            var price = 0;
        }
            

        if(price <= maxprice)
        {
            filteredlocations.push(location)
        }
             
     });

     return filteredlocations;

}

function filterMaxNoReviews(maxnoreviews, locations) {

    var filteredlocations = [];

     locations.forEach(function(location){

        if(location.review_count <= maxnoreviews)
        {
            filteredlocations.push(location)
        }
             
     });

     return filteredlocations;

}

function filterMinNoReviews(minnoreviews, locations) {

    var filteredlocations = [];

     locations.forEach(function(location){

        if(location.review_count >= minnoreviews)
        {
            filteredlocations.push(location)
        }
             
     });

     return filteredlocations;

}



console.log(filterMinRating(5, filterMaxNoReviews(30, jsondata)).length)
