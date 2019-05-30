var jsondata = require('./ChicagoSearchDataV4.json');
var chicagocategorytree = require('./chicagocategorytree.json')
var questions = require('./questions.json')

var questions1 = require('./questions.1.json')
var questions2 = require('./questions.2.json')
var questions3 = require('./questions.3.json')


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

function filterMaxNoRatings(maxnoratings, locations) {

    var filteredlocations = [];

     locations.forEach(function(location){

        if(location.review_count <= maxnoratings)
        {
            filteredlocations.push(location)
        }
             
     });

     return filteredlocations;

}

function filterMinNoRatings(minnoratings, locations) {

    var filteredlocations = [];

     locations.forEach(function(location){

        if(location.review_count >= minnoratings)
        {
            filteredlocations.push(location)
        }
             
     });

     return filteredlocations;

}

function filterNonMidnight(locations){

    var overnight = false;
    var filteredlocations = [];

     locations.forEach(function(location){

        if(location.hours == undefined){
            
            //Locations like parks have no hours, so valid overnight
            overnight = true;
        }
        else{

            location.hours[0].open.forEach(function(day){

                if(day.is_overnight){overnight = true;}

            });
        }

            if(overnight){filteredlocations.push(location);}
            overnight = false;
           
     });

     return filteredlocations;
}



function breakParent(parents){

    var children = [];

    parents.forEach(function (parent) {
        
        if(chicagocategorytree[parent] != undefined){
            
            for (var key in chicagocategorytree[parent]) {

                children.push(key)
            }
        }
    })

    return children;
    
}

function parseQuestionFilters(questionnaire){

    var filter = {
    minrating: 1,
    minnoratings: 0,
    maxnoratings: 100,
    maxprice: 1,
    childcategories: [],
    parentcategories: [],
    gem: false,
    allcategories: []
    };
    
    
    questionnaire["profileQuestions"].forEach(function(question){
        question["options"].forEach(function(option){
            if ("parentcategories" in option){
                filter["parentcategories"] = filter["parentcategories"].concat(option["parentcategories"])
            }
            if ("childcategories" in option){
                filter["childcategories"] = filter["childcategories"].concat(option["childcategories"])
            }
            if ("gem" in option){
                filter["gem"] = option["gem"]
            }
            if ("minnoratings" in option){

                if (filter["maxnoratings"] > option["minnoratings"])
                {
                    filter["minnoratings"] = option["minnoratings"]
                }
            }
            if ("maxnoratings" in option){
                if (filter["minnoratings"] < option["maxnoratings"])
                {
                    filter["maxnoratings"] = option["maxnoratings"]
                }
            }
            if ("maxprice" in option){
                filter["maxprice"] = option["maxprice"]
            }
            if ("minrating" in option){
                filter["minrating"] = option["minrating"]
            }
        });
    });
    
    combinedcategories = combineCategories(filter["childcategories"], filter["parentcategories"]);
    filter['allcategories'] = removeDuplicateCategories(combinedcategories);
    return filter;
}

function removeDuplicateCategories(categories){
    
    var inserted = {};
    var uniquecategories = [];

    categories.forEach(function(category){

        if(inserted[category] == undefined){
            inserted[category] = true;
            uniquecategories.push(category)
        }
    })

    return uniquecategories;
}

function combineCategories(children, parents)
{

   
    var allcategories = [];
    allcategories = breakParent(parents);
    allcategories = allcategories.concat(children);

    return allcategories;

    

}

function addLocationsFromCategories(childcategories, locations){

    data = []
    // add data in correct categories

    locations.forEach(function(location){

        var valid = false

        if (("categories" in location)) {

            location["categories"].forEach(function(category){
                
                if (childcategories.includes(category["alias"])){
                    valid = true
                }
            });

            if (valid) {
                data.push(location)
            }

        }
             
     });

    return data

}

function removeduplicateLocations(locations){

    var inserted = {};
    var uniquelocations = [];

    locations.forEach(function(location){

        if(inserted[location.name] == undefined){
            inserted[location.name] = true;
            uniquelocations.push(location)
        }
    })

    return uniquelocations;

}





function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  

function filterAll(filterprofile, locations){

    // var filterprofile = {
    //     minrating: 1,
    //     minnoratings: 0,
    //     maxnoratings: 100,
    //     maxprice: 0,
    //     childcategories: [],
    //     parentcategories: [],
    //     gem: false,
    //     allcategories: []
    //     };
    if(locations.length >= 100){
        return filterRandomHundred(filterMinRating(filterprofile.minrating, filterMinNoRatings(filterprofile.minnoratings, filterMaxNoRatings(filterprofile.maxnoratings,filterMaxPrice(filterprofile.maxprice,removeduplicateLocations(locations))))));

    }
    else{
        return (filterMinRating(filterprofile.minrating, filterMinNoRatings(filterprofile.minnoratings, filterMaxNoRatings(filterprofile.maxnoratings,filterMaxPrice(filterprofile.maxprice,removeduplicateLocations(locations))))));

    }


}

function filterRandomHundred(locations){

    var array = []

    for(i = 0; i < locations.length; i++){
        array.push(i)
    }

    shuffledarray = shuffle(array);


    var newlocations = [];
    
    
    for(var x = 0 ; x < 100; x++)
    {
    
        newlocations.push(locations[shuffledarray[x]]);
    }

    return newlocations;

}

//console.log(parseQuestionFilters(questions))
var filt = parseQuestionFilters(questions3);
var loc = addLocationsFromCategories(filt["allcategories"], jsondata)

//var loc = addLocationsFromCategories(filt)

filterAll(filt,loc).forEach(function (test){
    console.log(test.name)
})

//console.log(jsondata.length)

// ex: 2nd child-category for the first option of the 5th question
//console.log(questions["profileQuestions"][4]["options"][0]["childcategories"][1]); 

//console.log(filterNonMidnight(jsondata))
//console.log(jsondata[0].hours[0].open)

