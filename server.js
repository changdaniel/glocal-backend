var jsondata = require('./data.json');
var chicagocategorytree = require('./chicagocategorytree.json')
var questions = require('./questions.json')


var jsonreccomendations;

var jsonfilter = {
    minrating: 1,
    maxnoratings: 100,
    maxprice: 1,
    night_owl: true,
    categories: ["restaurants"],
    gem: true
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
        
        if(chicagocategorytree[parent] != null){
            
            for (const child of chicagocategorytree[parent].entries()) {

                children.push(child)
            }
        }
    })

    return children;
    
}

function parseFilters(questionnaire){

    var filter = {
    minrating: 1,
    minnoratings: 0,
    maxnoratings: 100,
    maxprice: 1,
    categories: [],
    gem: false
    };

    questionnaire["profileQuestions"].forEach(function(question){
        question["options"].forEach(function(option){
            if ("parentcategories" in option){};
            if ("childcategories" in option){
                option["childcategories"].forEach(function(childcat){
                    filter["categories"].push(childcat)    
                })
            };
            if ("gem" in option){
                filter["gem"] = option["gem"]
            };
            if ("minnoratings" in option){

                if (filter["maxnoratings"] > option["minnoratings"])
                {
                    filter["minnoratings"] = option["minnoratings"]
                }
            };
            if ("maxnoratings" in option){
                if (filter["minnoratings"] < option["maxnoratings"])
                {
                    filter["maxnoratings"] = option["maxnoratings"]
                }
            };
            if ("maxprice" in option){
                filter["maxprice"] = option["maxprice"]
            };
            if ("minrating" in option){
                filter["minrating"] = option["minrating"]
            };
        });
    });
    

    
    return filter;
}

function isDict(v) {
    return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
}


console.log(parseFilters(questions));

// ex: 2nd child-category for the first option of the 5th question
//console.log(questions["profileQuestions"][4]["options"][0]["childcategories"][1]); 

//console.log(filterNonMidnight(jsondata))
//console.log(jsondata[0].hours[0].open)

