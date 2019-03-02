/************* Initialize Search Elements On the Page  *************/
//Elements on the page
const searchButton = document.getElementById("searchButton");
  //Array of Input Fields
const inputFields = document.querySelectorAll(".inputField")

//Allows the user to search with the "enter" key
inputFields.forEach(function(elem){
  elem.addEventListener("keyup",function(event){
    if(event.keyCode === 13){searchButton.click();}
  });
});

/************* Making API Calls  *************/
//NASA's API addresses
const rootAddress = "https://images-api.nasa.gov"
const searchExt = "/search?media_type=image&" //always return images

//Creating an XMLHttpRequest object and response object
const request = new XMLHttpRequest();
let response;

//Defining behavior upon request response
request.onreadystatechange = function(){
  if(request.readyState == 4){
    if(request.status == 200){
       processResponse(request.responseText);
    } else if(request.status == 400){
      alert("Bad Request");
    } else if(request.state == 404){
      alert("Requested resource doesn't exist")
    } else {
      alert("API did not respond as expected")
    }
  }
};

//Calls NASA's Search API, uses seachBar's text for q
function callSearchAPI(q){
  request.open("GET",buildSearchRequest());
  request.send();
}

//Creates the Address for API call
function buildSearchRequest(){
  let ext = [];
  inputFields.forEach(function(elem){
    if(elem.value !== ""){
      ext.push(encodeURIComponent(elem.id) + "=" + encodeURIComponent(elem.value));
    }
  });
  //Joins the root, search, and query
  return rootAddress+searchExt+ext.join("&");;
}

/************* Procesing API Response's  *************/
function processResponse(responseText){
  response = JSON.parse(responseText);
  console.log(response);
  
  let imagePane = document.getElementById("imagePane");

  let searchCount = document.getElementById("searchCount");
  searchCount.textContent = response.collection.metadata["total_hits"] + " search results.";
}