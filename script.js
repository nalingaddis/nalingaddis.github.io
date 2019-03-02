var searchBar = document.getElementById("searchBar");

function search(event){
  if(event.keyCode === 13){
    event.preventDefault();
    document.getElementById("searchButton").click();
  }
}

searchBar.addEventListener("keyup",search(event))
