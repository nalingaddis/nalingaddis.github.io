# Web App for Exploring NASA's image archives

## Challenge
Use NASA's public API's to build a deployable web app that will allow users to search NASA's image archive and displays results in an intuitive, easy to navigate interface.   
*By Capital One*

## Solution
My web app is built using HTML, CSS, and vanilla JavaScript and is deployed via GitHub pages [here](https://nalingaddis.github.io). The website uses [Bootstrap](https://getbootstrap.com/) and [Lightbox2](https://lokeshdhakar.com/projects/lightbox2). 
   
[Bootstrap](https://getbootstrap.com/) is used for creating a mobile friendly interface via their grid system which allows rows and columns to stack neatly depending on the size of the screen. This creates both mobile friendly images and search buttons/fields.
   
[Lightbox2](https://lokeshdhakar.com/projects/lightbox2) is a module that allowed me to quickly implement a flexible lightbox which displays an images metadata, a link to the highest resolution image, and an "Add to favorites" button.  

Additional homemade bells and whitles include:
* Infinite scrolling - continous scrolling until the user has seen all results (loads images in batches of 100)
* Favorites Gallery - a seperate gallery for saving images and visiting them later
* Try Me - allows users to get search examples and ideas
* Full Size Images - requests the largest version of the image and displays it in a new tab
* Metadata captions - captions in the lightbox contain the metadata for each image
* Sticky navigation header - navigation header makes it easy and quick to navigate the app
* Cosmic Latte Theme - the site's color scheme is based on the average color of the universe [Cosmic Latte](https://apod.nasa.gov/apod/ap091101.html)
