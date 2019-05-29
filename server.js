var jsondata = require('./ChicagoSearchDataV4.json');
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

        if(inserted[location.id] == undefined){
            inserted[location.id] = true;
            uniquelocations.push(location)
        }
    })

    return uniquelocations;

}



var filt = parseQuestionFilters(questions);
var loc = addLocationsFromCategories(filt["allcategories"], jsondata)
console.log(loc)
console.log(loc.length)

function filterAll(filterprofile, locations){

    var filterprofile = {
        minrating: 1,
        minnoratings: 0,
        maxnoratings: 100,
        maxprice: 0,
        childcategories: [],
        parentcategories: [],
        gem: false,
        allcategories: []
        };

        return filterMinRating(filterprofile.minrating, filterMinNoRatings(filterprofile.minnoratings, filterMaxNoRatings(filterprofile.maxnoratings,filterMaxPrice(filterprofile.maxprice,removeduplicateLocations(locations)))));


}

//console.log(parseQuestionFilters(questions))
var filt = parseQuestionFilters(questions)
//var loc = addLocationsFromCategories(filt)

console.log(filterAll(filt,loc))

//console.log(jsondata.length)

// ex: 2nd child-category for the first option of the 5th question
//console.log(questions["profileQuestions"][4]["options"][0]["childcategories"][1]); 

//console.log(filterNonMidnight(jsondata))
//console.log(jsondata[0].hours[0].open)

