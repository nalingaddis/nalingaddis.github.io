//Elements on the page
const searchButton = document.getElementById("searchButton");
  //Array of Input Fields
const inputFields = document.querySelectorAll(".inputField")

//Allows the user to search with the "enter" key
inputFields.forEach(function(elem){
  elem.addEventListener("keyup",function(event){
    searchButton.click();
  });
})

//NASA's API addresses
const rootAddress = "https://images-api.nasa.gov"
const searchExt = "/search"

//Creating an XMLHttpRequest object and response object
const request = new XMLHttpRequest();
let response;

//Defining behavior upon request response
request.onreadystatechange = function(){
  if(request.readyState == 4){
    if(request.status == 200){
       response = JSON.parse(request.responseText);
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
  request.open("GET",rootAddress+searchExt+"?q="+q);
  request.send();
}

//Handles input once search button is pressed
function search(){
  var text = inputFields[0].value;
  if(text != ""){
    callSearchAPI(text);
  }
}
