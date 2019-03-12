/************* Initialize Search Elements On the Page *************/
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
  //Advanced Search Button Functionality
function showAdvanced(){
  let advancedSearch = document.getElementById("advancedSearch");
  if(advancedSearch.style.display === "block"){
    advancedSearch.style.display = "";
  } else {
    advancedSearch.style.display = "block";
  }
}
  //List of Example searchs, taken from NASA https://spaceplace.nasa.gov/sign-here-glossary/en/
let examples = ["Andromeda Galaxy","asteroids","arms","astronauts","astronomy","atom","aurora","axis","Big Bang",
"Big Dipper","binary star","black dwarf","black hole","brown dwarf","carbon","celestial","chromosphere","cloud","cold",
"comet","constellation","Crab Nebula","dust","Earth","electromagnetic","element","elliptical galaxy","energy","force",
"frequency","fusion","galactic","galactic center","galaxy","gamma rays","gas","gravity","heat","heliocentric","heliopause",
"heliosphere","hydrocarbon","hydrogen","image","infrared","interstellar","Jupiter","life","light","light-year",
"Little Dipper","local group","luminosity","magnetosphere","magnitude","Mars","mass","matter","Mercury","meteor",
"Milky Way","molecule","moon","NASA","nebula","Neptune","neutron star","North Star","observatory","orbit","Orion","oxygen",
"parallax","photometer","photosphere","planet","Polaris","pulsar","quasar","radiation","radio waves","ray","red giant",
"reflection","rocket","rotate","satellite","Saturn","shine","solar system","space","Space Shuttle","spectrograph","spectrum",
"spiral arms","star","starlight","stellar","Sun","sunspot","supergiant","supernova","telescope","temperature","theory",
"transparent","ultraviolet","universe","Ursa Major","Ursa Minor","Venus","visible light","water","wavelength","waves",
"Whirlpool Galaxy","white dwarf","x-ray"]
function makeExample(){
  inputFields[0].value = examples[Math.floor(Math.random() * examples.length)];
}

/************* Creating the gallery columns *************/
let cols = []; //Array for holding the galleries columns
const numOfCols = 4; //Determines the MAX number of columns create, NEEDS TO BE factor of 12

//Creating columns for adding the images
for(i=0; i<numOfCols; i++){
  let col = document.createElement("div");
  let classname = "col-sm-12 col-md-";
  classname += (Math.ceil(12/numOfCols)).toString(); //Edits the column widths in BS Grid based on numOfCols
  col.className = classname;

  document.getElementById("gallery").appendChild(col);
  cols[cols.length]=col;
}

/************* Onscroll Effect for Infinite Scrolling  *************/
const loadDistFromBottom = 2000; //Distance for bottom when the next page will be loaded
  //Disables bottom of page detection while autoscroll is active
let isAutoScrolling = false; //Prevents bugs and excess loading
let nextHTTPRequest = null;

window.onscroll = function(event){
  //If the user is near the bottom of the page, and it is not autoscrolling 
  if((window.innerHeight + window.scrollY) >= document.body.offsetHeight - loadDistFromBottom 
      && !isAutoScrolling && nextHTTPRequest != null){
      callSearchAPI(nextHTTPRequest);
      console.log("scroll detected");
  }
};

/************* Instantiating Lozad Module  *************/
const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();

/************* API Call Handling *************/
//NASA's API addresses
const rootAddress = "https://images-api.nasa.gov/";
const searchExt = "search?media_type=image&"; //always return images
const assetExt = "asset/";

//Creating an XMLHttpRequest objects
const searchRequest = new XMLHttpRequest();
const assetRequest = new XMLHttpRequest();

//Behavior for Search Response
searchRequest.onreadystatechange = function(){
  if(searchRequest.readyState === 4){
    if(searchRequest.status === 200){
       processSearchResponse(searchRequest.responseText);
    } else if(searchRequest.status === 400){
      alert("Bad Request");
    } else if(searchRequest.state === 404){
      alert("Requested resource doesn't exist");
    } else {
      alert("API did not respond as expected");
    }
  }
};

//Behavior for Asset Request
assetRequest.onreadystatechange = function(){
  if(assetRequest.readyState === 4){
    if(assetRequest.status === 200){
       processAssetResponse(assetRequest.responseText);
    } else if(assetRequest.status === 400){
      alert("Bad Request");
    } else if(assetRequest.state === 404){
      alert("Requested resource doesn't exist");
    } else {
      alert("API did not respond as expected");
    }
  }
};

/****** Search Calls ******/
//Calls NASA's Search API
function callSearchAPI(address=buildSearchRequest()){
  searchRequest.open("GET",address);
  searchRequest.send();
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
  return rootAddress+searchExt+ext.join("&");
}

/****** Asset Calls ******/
function callAssetAPI(nasa_id){
  assetRequest.open("GET",rootAddress+assetExt+nasa_id);
  assetRequest.send();
}

/************* Procesing API Response's *************/

/****** Search Response ******/
function processSearchResponse(responseText){
  let searchResponse; //Response object for search request
  searchResponse = JSON.parse(responseText);
  
  console.log(searchResponse);

  showResultsCount(searchResponse);  //Displays the number of search results

  let address = searchResponse.collection.href; //The address of the request
  let isNewSearch = (address.search("page=") === -1); //If the request is the first page, then it is a new search
  if(isNewSearch){clearGallery()} //Clears the image gallery if this was a new search
  
  displayImages(searchResponse);  //Displays the new images

  //Sets the next request address if it exists
  if(searchResponse.collection.links !== undefined){
    let i = 0; //temporary indexer, used to account for previous page links
    if(searchResponse.collection.links[i].prompt === "Previous"){
      if(searchResponse.collection.links.length === 2){i++;} 
      else{nextHTTPRequest = null; return;}
    }
    nextHTTPRequest = searchResponse.collection.links[i].href;
  } else {
    nextHTTPRequest = null;
  }

  //Scrolling down is not needed on mobile, and looks clunky
  if(screen.width > 720 && isNewSearch){scrollDown(300);} //Only scrolls on new search
}

//Scroll down to make results viewable
function scrollDown(scrollDistance){
  isAutoScrolling = true; //Disables infinite scroll
  scrollDownRecu(0,scrollDistance); //Calling recursive function
}

//Recursive function for scrolling
function scrollDownRecu(deltaScroll, scrollDistance){
  window.scrollBy(0,1); //Scroll
  if(deltaScroll < scrollDistance){ //Base case
    scrolldelay = setTimeout(scrollDownRecu,1,deltaScroll+1,scrollDistance); //Recusive step
  } else {
    isAutoScrolling = false; //Enables infinite scroll
  }
}

//Prints the number of search results
function showResultsCount(response){
  let resultsCount = document.getElementById("resultsCount");
  resultsCount.textContent = response.collection.metadata["total_hits"] + " search results.";
}

//Clears images from the gallery, by column
function clearGallery(){
  cols.forEach(function (col){
    while(col.firstChild){col.removeChild(col.firstChild);}
  });
}

//Creates the structure and image instances for the gallery
function displayImages(response){
  //Counter for dividing images amoungst columns
  let counter = 0;

  //Iterating through images
  response.collection.items.forEach(function(item){
    //Creating the anchor containing the image
    let anc = document.createElement("a");
    anc.innerHTML = '<img class="lozad" src=' + item.links[0]["href"]+'>'; //sets img source equal to the image address
    anc.setAttribute("href", item.links[0]["href"]); //set up for the lightbox
    anc.setAttribute("data-lightbox", "space"); //added lightbox magic

    //Building Caption from Meta Data
    let caption = '"' + item.data[0]["title"] + '" taken at ' + item.data[0]["center"] + " on " + item.data[0]["date_created"].substring(0,10) + " - " + item.data[0]["description"];
    anc.setAttribute("data-title", caption);

    //Appending to alternating columns
    cols[counter%numOfCols].appendChild(anc);
    counter++;
  });
}

//Get assets for item in a search response
function getItemAssets(item){
  callAssetAPI(item.data[0]["nasa_id"]);
}

/****** Asset Response ******/
let assetResponse; //Response Object for asset request
function processAssetResponse(responseText){
  assetResponse = JSON.parse(responseText);
  console.log(assetResponse);
}