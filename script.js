//Elements on the page
let searchButton = document.getElementById("searchButton")
let searchBar = document.getElementById("searchBar");

//Allows the user to search with the "enter" key
searchBar.addEventListener("keyup",function(event){
  if(event.keyCode === 13){
    searchButton.click();
  }
});

//NASA's API addresses
const rootAddress = "https://images-api.nasa.gov"
const searchExt = "/search"

//Creating an XMLHttpRequest object
const request = new XMLHttpRequest();

//Defining behavior upon request response
request.onreadystatechange = function(){
  if(request.readyState === 4){
    if(request.status === 200){
       console.log(request.responseText);
    } else {
      alert("API did not respond as expected");
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
  var text = searchBar.value;
  if(text != ""){
    callSearchAPI(text);
  }
}
