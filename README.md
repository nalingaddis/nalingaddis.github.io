# Web App for Exploring NASA's image archives

## Challenge
Use NASA's public API's to build a deployable web app that will allow users to search NASA's image archive and displays results in an intuitive, easy to navigate interface.   
*By Capital One*

## Solution
My web app, NASA Image Search, is built using HTML, CSS, and vanilla JavaScript and is deployed via [GitHub pages](https://nalingaddis.github.io). The website uses [Bootstrap](https://getbootstrap.com/) and [Lightbox2](https://lokeshdhakar.com/projects/lightbox2). 
   
[Bootstrap](https://getbootstrap.com/) is used for creating a mobile friendly interface via their grid system which allows rows and columns to stack neatly, depending on the size of the screen. This creates both mobile friendly images and search buttons/fields.
   
[Lightbox2](https://lokeshdhakar.com/projects/lightbox2) is a module that allowed me to quickly implement a flexible lightbox which displays an image's metadata, a link to the highest resolution image, and an "Add to favorites" button.  

Additional bells and whistles include:
* Infinite scrolling - allows continous scrolling until the user has seen all results (loads images in batches of 100)
* Favorites Gallery - creates a seperate gallery for saving images and visiting them later
* "Try Me" Button - helps users with example searches and ideas
* Full Size Images - requests the largest version of the image and displays it in a new tab
* Metadata Captions - captions in the lightbox contain the metadata for each image
* Sticky Navigation Header - navigation header makes it easy and quick to navigate the app
* Cosmic Latte Theme - the site's color scheme is based on the average color of the universe, [Cosmic Latte](https://apod.nasa.gov/apod/ap091101.html)
