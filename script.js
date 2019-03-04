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
  if(searchRequest.readyState == 4){
    if(searchRequest.status == 200){
       processSearchResponse(searchRequest.responseText);
    } else if(searchRequest.status == 400){
      alert("Bad Request");
    } else if(searchRequest.state == 404){
      alert("Requested resource doesn't exist");
    } else {
      alert("API did not respond as expected");
    }
  }
};

//Behavior for Asset Request
assetRequest.onreadystatechange = function(){
  if(assetRequest.readyState == 4){
    if(assetRequest.status == 200){
       processAssetResponse(assetRequest.responseText);
    } else if(assetRequest.status == 400){
      alert("Bad Request");
    } else if(assetRequest.state == 404){
      alert("Requested resource doesn't exist");
    } else {
      alert("API did not respond as expected");
    }
  }
};

/****** Search Calls ******/
//Calls NASA's Search API
function callSearchAPI(){
  searchRequest.open("GET",buildSearchRequest());
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
  return rootAddress+searchExt+ext.join("&");;
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

  showResultsCount(searchResponse);
  clearGallery();
  displayImages(searchResponse);
}

//Prints the number of search results
function showResultsCount(response){
  let resultsCount = document.getElementById("resultsCount");
  resultsCount.textContent = response.collection.metadata["total_hits"] + " search results.";
}

//Clears images from the gallery
function clearGallery(){
  let gallery = document.getElementById("gallery");
  while(gallery.firstChild){
    gallery.removeChild(gallery.firstChild);
  }
}

//Creates the structure and image instances for the gallery
function displayImages(response){
  let numOfCols = 4; //Determines the MAX number of columns create, factor of 12

  //Creating columns for adding the images
  let cols = [];
  for(i=0; i<numOfCols; i++){
    let col = document.createElement("div");
    col.className = "col-md-3 col-xs-12"; //requires manual edit for bootstrap grid layout
    document.getElementById("gallery").appendChild(col);
    cols[cols.length]=col;
  }

  //Counter for dividing images amoungst columns
  let counter = 0;

  //Iterating through images
  response.collection.items.forEach(function(item){
    //Creating the image instance
    let img = new Image();
    img.src = item.links[0]["href"];
    img.className = "lozad img-thumbnail";

    //Appending to alternating columns
    cols[counter%numOfCols].appendChild(buildThumbnail(img)); //builds thumbnail
    counter++;
  });
}

//Constructs div stack for image thumbnails
function buildThumbnail(img){
  //let col = document.createElement("div");
  let thumbnail = document.createElement("div");
  //col.className = "col-md-4";
  thumbnail.className = "thumbnail";
  thumbnail.appendChild(img);
  //col.appendChild(thumbnail);
  return thumbnail;
}

//Get assets for item in response
function getItemAssets(item){
  callAssetAPI(item.data[0]["nasa_id"]);
}

/****** Asset Response ******/
let assetResponse; //Response Object for asset request
function processAssetResponse(responseText){
  assetResponse = JSON.parse(responseText);
  console.log(assetResponse);
}