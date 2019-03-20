/************* Initializing Globals and Page Elements *************/
  //Main search button
var searchButton = document.getElementById("searchButton");
  //Array of input fields, used for creating search query
var inputFields = document.querySelectorAll(".inputField")  
  //Allows the user to search with the "enter" key
inputFields.forEach(function(elem){ //Iterating through input fields
  elem.addEventListener("keyup",function(event){ //Adding a key listener
    if(event.keyCode === 13){searchButton.click();} //Defining behavior
  });
});
  //"Advanced" button functionality, shows/hides the advanced fields
function showAdvanced(){
  let advancedSearch = document.getElementById("advancedSearch"); //div containing the advanced search fields
  if(advancedSearch.style.display === "block"){
    advancedSearch.style.display = "none"; //If it is showing, hide it
  } else {
    advancedSearch.style.display = "block"; // Else, show it
  }
}

  //Used for detecting bottom of page.... See Setion on Infinite Scrolling
var blockScrolling = false; //Prevents bugs and excess loading
  //Establishing for Future Reference
var favorites = document.getElementById("favorites"); //The closest div to the favorited images
var gallery = document.getElementById("gallery"); //The closest div to the search result images
var imageCount = document.getElementById("image-count"); //Show number of images in search/favorite
var favCounter = 0; //Counts the number of favorited images
var resultsCounter = 0; //Counts number of results returned
showResultsCount(); //Initializes the image count

  //Favorites Button Functionality
var favSection = document.getElementById("favorites-section"); //section containing favorites
var galSection = document.getElementById("gallery-section"); //section containing search results

favSection.style.display = "none"; //Hides favorites initially 

//Function for toggling between favorites/search results
function showFavorites(){
  document.body.scrollTop = 0; //Scroll to the top on Safari
  document.documentElement.scrollTop = 0; //Scroll to the top on everything else
  if(favSection.style.display === "none"){ //If favorites hidden
    galSection.style.display = "none"; //Hides gallery
    favSection.style.display = "block"; //Shows favorites
    showFavoritesCount(); //Shows the number of favorites at the top
    document.getElementById("favorites-button").textContent = "Results"; //Changes button text
    blockScrolling = true; //Disables infinite scrolling
  } else {
    galSection.style.display = "block"; //Shows Gallery
    favSection.style.display = "none"; //Hides Favorites
    showResultsCount(); //Shows the number of search results
    document.getElementById("favorites-button").textContent = "Favorites"; //Changes button text
    blockScrolling = false; //Enables infinte scrolling
  }
}
  //Basic Search Button
function search(){
  document.body.scrollTop = 0; //Scroll to the top on Safari
  document.documentElement.scrollTop = 0; //Scroll to the top on everything else
  if(galSection.style.display === "none"){showFavorites();} //If the search results are hidden, show them and hide favorites

  callSearchAPI(); //Calls the search API

  // Message at the bottom of the search results to inform user that they have seen all search results
  document.getElementById("gallery-message").textContent = "You've reached the edge of the universe, make a new search to continue exploring!"
}

  //List of Example searchs, taken from NASA https://spaceplace.nasa.gov/sign-here-glossary/en/
var examples = ["Andromeda Galaxy", "Apollo", "asteroids","arms","astronauts","astronomy","atom","aurora","axis","Big Bang",
"Big Dipper","binary star","black dwarf","black hole","brown dwarf","carbon","celestial","chromosphere","cloud","cluster","cold",
"comet","constellation","Crab Nebula","dust","Earth","electromagnetic","element","elliptical galaxy","energy","force",
"frequency","fusion","galactic","galactic center","galaxy","gamma rays","gas","gravity","heat","heliosphere","Horsehead nebula","hydrocarbon","hydrogen",
"image","infrared","interstellar","Jupiter","life","light","light-year","local group","luminosity","magnetosphere","magnitude",
"Mars","mass","matter","Mercury","meteor","Milky Way","molecule","moon","moon landing", "NASA","nebula","Neptune",
"neutron star","North Star","observatory","orbit","Orion","oxygen","parallax","photometer","planet","Polaris",
"pulsar","quasar","radiation","radio waves","ray","red giant","reflection","rocket","rotate","satellite","Saturn",
"shine","solar system","space","Space Shuttle","spectrograph","spectrum","spiral arms","star","starlight","stellar",
"Sun","sunspot","supergiant","supernova","telescope","temperature","theory","transparent","ultraviolet","universe",
"Ursa Major","Venus","visible light","water","wavelength","waves","Whirlpool Galaxy","white dwarf","x-ray"]
function makeExample(){
  inputFields[0].value = examples[Math.floor(Math.random() * examples.length)]; //Selects a random example and fills the search field with it
}

/************* Creating the gallery columns *************/
var numOfCols = 4; //Determines the MAX number of columns create, NEEDS TO BE factor of 12
var cols = []; //Array for holding the galleries columns

//Creating columns for gallery images
for(i=0; i<numOfCols; i++){
  let col = document.createElement("div"); //Creates a div
  let classname = "col-sm-12 col-md-"; //Sets class to bootstrap column, stacks on mobile 
  classname += (Math.ceil(12/numOfCols)).toString(); //Edits the column widths in BS Grid based on numOfCols
  col.className = classname;

  gallery.appendChild(col); //Append columns to document
  cols[cols.length]=col; //Append columns to cols array
}

/************* Onscroll Effects for Infinite Scrolling  *************/
var loadDistFromBottom = 3000; //Distance for bottom when the next page will be loaded
  //Disables bottom of page detection while autoscroll is active

var nextHTTPRequest = null; //Holds the next API request
var oldScroll = 0; //The previous scrollY position

window.onscroll = function(event){
  //If the user is near the bottom of the page and it is not autoscrolling and there is another request response to display
  if((window.innerHeight + window.scrollY) >= document.body.offsetHeight - loadDistFromBottom 
      && !blockScrolling && nextHTTPRequest != null){
      callSearchAPI(nextHTTPRequest); //Calls the next API
  }

  //Floating Search Header
  let header = document.getElementById("search-area"); //Floating header
  let top = document.getElementById("top"); //Top search area
  let newScroll = this.scrollY; //Establishing a new scrollY position
  //If the user is below the header and scrolling up, show the sticky header, else hid it
  if(window.pageYOffset > top.offsetHeight + top.offsetTop && oldScroll > newScroll){
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
  oldScroll = newScroll; //Updating the previous scrollY position
};

/************* API Call Handling *************/
//NASA's API addresses
var rootAddress = "https://images-api.nasa.gov/"; //Root address for calls
var searchExt = "search?media_type=image&"; //Search extension, will always return images
var assetExt = "asset/"; //Asset extension

//Creating an XMLHttpRequest objects
var searchRequest = new XMLHttpRequest();
var assetRequest = new XMLHttpRequest();

//Behavior for Search Response
searchRequest.onreadystatechange = function(){
  if(searchRequest.readyState === 4){
    if(searchRequest.status === 200){
       processSearchResponse(searchRequest.responseText); //Calls the function that displays the results
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
       processAssetResponse(assetRequest.responseText); //Calls the function that processes the metadata
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
function callSearchAPI(address=buildSearchRequest()){ //Default address is built using the user input in the UI
  searchRequest.open("GET",address);
  searchRequest.send();
}

//Creates the Address for API call
function buildSearchRequest(){
  let ext = []; //Array for holding uri encodings
  inputFields.forEach(function(elem){
    if(elem.value !== ""){ //For each non empty field
      ext.push(encodeURIComponent(elem.id) + "=" + encodeURIComponent(elem.value));//Adds the uri encoding to the array as a string
    }
  });
  //Joins the root, search, and query
  return rootAddress+searchExt+ext.join("&"); //Joins the uri encodings with &
}

/****** Asset Calls ******/
function callAssetAPI(nasa_id){ //Requires NASA Id for a media image
  assetRequest.open("GET",rootAddress+assetExt+nasa_id);
  assetRequest.send();
}

/************* Procesing API Response's *************/

/****** Search Response ******/
function processSearchResponse(responseText){ 
  let searchResponse; //Response object for search request
  searchResponse = JSON.parse(responseText); //Process as JSON
  
  resultsCounter = searchResponse.collection.metadata.total_hits; //Updates the results counter for number of search results
  showResultsCount();  //Displays the number of search results

  let address = searchResponse.collection.href; //The address of the request
  let isNewSearch = (address.search("page=") === -1); //If the request is the first page, then it is a new search
  if(isNewSearch){clearGallery()} //Clears the image gallery if this was a new search
  
  displayImages(searchResponse);  //Displays the new images

  //Sets the next request address if it exists
  if(searchResponse.collection.links !== undefined){
    let i = 0; //temporary indexer, used to account for previous page links
    if(searchResponse.collection.links[i].prompt === "Previous"){ //if the page has a previous link
      if(searchResponse.collection.links.length === 2){i++;} //If the page is a middle page, the next link will be the second item in the list
      else{nextHTTPRequest = null; return;} //If the only link is backwards, then we have reached the end
    }
    nextHTTPRequest = searchResponse.collection.links[i].href; //If the page doesn't have previous, it is the first page
  } else {
    nextHTTPRequest = null; //Anything else returns null
  }

  if(isNewSearch){scrollDown(300);} //Only scrolls on new search
}

//Scroll down to make results viewable
function scrollDown(scrollDistance){
  blockScrolling = true; //Disables infinite scroll
  scrollDownRecu(0,scrollDistance); //Calling recursive function
}

//Recursive function for scrolling
function scrollDownRecu(deltaScroll, scrollDistance){
  window.scrollBy(0,1); //Scroll
  if(deltaScroll < scrollDistance){ //Base case
    scrolldelay = setTimeout(scrollDownRecu,1,deltaScroll+1,scrollDistance); //Recusive step
  } else {
    blockScrolling = false; //Enables infinite scroll
  }
}

//Displays the number of search results
function showResultsCount(){
  imageCount.textContent = resultsCounter + " search results.";
}

//Displays the number of favorited images
function showFavoritesCount(){
  imageCount.textContent = favCounter + " favorited images.";
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
    //sets img source equal to the image address
    anc.innerHTML = '<img src="' + item.links[0].href+'"alt="'+item.data[0].title+'"/>';
    anc.setAttribute("href", item.links[0].href); //set up for the lightbox
    anc.setAttribute("data-lightbox", "results"); //added lightbox magic

    //Building Caption from Meta Data
      //Adding Favorites and Full Size Image buttons
    let caption = '<div class="row no-gutters"><div class="col-12"><button class="caption-button ripple" onclick="addFavImage()"> Add to Favorites </button></div><div class="col-12"><button class="caption-button ripple" onclick="callAssetAPI(\''
    +item.data[0].nasa_id+'\')"> Full Size </button></div></div>'; //Gets the Assets for the image, then displays largest one
      //Title
    if(item.data[0].title !== undefined){caption += '<div class="caption"> <u>Title</u> - "' + item.data[0].title + '"</div>';}
      //Date
    if(item.data[0].date_created !== undefined){caption += '<div class="caption"> <u>Date</u> - ' + item.data[0].date_created.substring(0,10) + '</div>';}
      //Center
    if(item.data[0].center !== undefined){caption += '<div class="caption"> <u>Center</u> - ' + item.data[0].center + '</div>';}
      //Description
    if(item.data[0].description !== undefined){
        // formating description
      let description = item.data[0].description;
      description = description.replace(/<a /g, '<a target="_blank"'); //makes all anchor in description open in a new tab
        //Adding Description
      caption += '<div class="caption"><u>Description</u></div>';
      caption += '<div class="caption-description">'+description+'</div>'
    }
      //Adding caption to anchor
    anc.setAttribute("data-title", caption);

    //Appending to alternating columns using counter
    cols[counter%numOfCols].appendChild(anc); // faster for more images than the reduce function in this use case
    counter++;
  });
}

/************* Favoriting Images *************/
var favCols = []; //Array for holding the galleries columns
//Creating columns for gallery images
for(i=0; i<numOfCols; i++){
  let col = document.createElement("div"); //Creating a div to act as a Bootstrap column
  let classname = "col-sm-12 col-md-"; //Giving the div the bootstrap Column class, col-sm-12 => stack columns on mobile
  classname += (Math.ceil(12/numOfCols)).toString(); //Edits the column widths in BS Grid based on numOfCols
  col.className = classname;

  favorites.appendChild(col); //Appending to the document
  favCols[favCols.length]=col; //Appending to the array
}

function addFavImage(){
  //Gets anchor from gallery
    //Saving for later
  let original = getLBAnchor(cols)[0];

  //Modifying the clone and appending to favorites section
  let clone = original.cloneNode(true);
    //Copying current caption
  caption = clone.getAttribute("data-title");
    //Replacing the Add to Favorites Buttom with a Remove from Favorites
  caption = caption.replace("Add to", "Remove from").replace("addFavImage","remFavImage");
    //Replacing the anchors caption
  clone.setAttribute("data-title", caption);
    //Adding the image to a different lightbox
  clone.setAttribute("data-lightbox", "favorites");
    //Appending to the shortest column, better in this use case because it accounts for deleted images
  favCols.reduce(function(a,b){
    if(a.children.length > b.children.length){return b;} else {return a;}
  }).append(clone);
    //Used to for user reference
  favCounter++;
    // Message to inform user that they have seen all of their saved images
  document.getElementById("favorites-message").textContent = "These are your favorite images. To favorite more images, click on an image in the search results image and 'Add to Favorites'.";
    
  //Changing the "Add to Favorites" button in the lightbox
    //Getting the button
  addedButton = document.getElementById("lightbox").children[1].children[0].children[0].children[0].children[0].children[0].children[0];
    //Disabling button
  addedButton.disabled = true;
    //Changing background color to green and disabling cursor
  addedButton.style = "background-color: #00AC90; cursor: not-allowed;";
    //Changing text to say "Added"
  addedButton.textContent = "Added to Favorites";

  //Changing the button permanently via the anchor
    //Get the caption of the image in the anchor
  caption = original.getAttribute('data-title');
    //Changes background color, disabling button and cursor
  caption = caption.replace('addFavImage()"','addFavImage()" style="background-color: #00AC90; cursor: not-allowed;" disabled');
    //Changing the text content
  caption = caption.replace("Add to Favorites", "Added To Favorites");
    //Implementing the change
  original.setAttribute("data-title", caption);
}

function remFavImage(){
  pair = getLBAnchor(favCols); //Get parent child pair from lightbox
  pair[1].removeChild(pair[0]); //Removes the child from the parent
  favCounter--;
  showFavoritesCount(); //Upated the Favorite Counter on screen

  //Changing the "Remove from Favorites" button in the lightbox
    //Getting the button
  removeButton = document.getElementById("lightbox").children[1].children[0].children[0].children[0].children[0].children[0].children[0];
    //Disabling button
  removeButton.disabled = true;
    //Changing background color to green and disabling cursor
  removeButton.style = "background-color: #BF5846; cursor: not-allowed;";
    //Changing text to say "Added"
  removeButton.textContent = "Removed from Favorites";
}

//Goes through each column and finds the anchor that is currently in the lightbox
function getLBAnchor(columns){
  for(j = 0; j<numOfCols; j++){
    for(i = 0; i<columns[j].children.length; i++){
      if(columns[j].children[i].href == document.getElementById("lightbox").children[0].children[0].children[0].src){
        return [columns[j].children[i], columns[j]];
      }
    }
  }
}

// Saving for future expansion, currently UN-USED
  //Get assets for item in a search response
function getItemAssets(item){
  callAssetAPI(item.data[0]["nasa_id"]);
}

/****** Asset Response ******/
var assetResponse; //Response Object for asset request
function processAssetResponse(responseText){
  assetResponse = JSON.parse(responseText); //Process as JSON

  //Opens Largest Version of Image
  let items = assetResponse.collection.items;
  //Items are sorted by size, Largest -> Smallest
  for(i=0; i<items.length; i++){
    //If the item is an image type, open it
    if(items[i].href.includes(".jpg") || items[i].href.includes(".png") || items[i].href.includes(".jpeg")){
      window.open(items[i].href); //Opening in a new tab
      break;
    }
  }
}