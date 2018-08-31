# Restaurant Reviews

#### _Three Stage Project - For Mobile Web Specialist Certification Course_

## Project Overview: Stage 1

- Worked on a static design that lacks accessibility and convert the design to be fully responsive on different sized displays and accessible for screen reader use.
- Used cache API and a [ServiceWorker](https://developers.google.com/web/fundamentals/primers/service-workers/) to cache the data for the website so that any page (including images) that has been visited is accessible offline and to begin the process of creating a seamless offline experience for the users.

#### Specification:

You have been provided the code for a restaurant reviews website. The code has a lot of issues. It’s barely usable on a desktop browser, much less a mobile device. It also doesn’t include any standard accessibility features, and it doesn’t work offline at all. Your job is to update the code to resolve these issues while still maintaining the included functionality. 

#### Leaflet.js and Mapbox:

This repository uses [leafletjs](https://leafletjs.com/) with [Mapbox](https://www.mapbox.com/). You need to replace `<your MAPBOX API KEY HERE>` with a token from [Mapbox](https://www.mapbox.com/). Mapbox is free to use, and does not require any payment information. 

#### Note about ES6:

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write. 


## Project Overview: Stage 2

- Used asynchronous JavaScript to request data from the backend server instead of a local memory (file).
- Stored JSON responses in an offline database using [IndexedDB](https://developers.google.com/web/ilt/pwa/working-with-indexeddb/), which will create an app shell architecture.
- The site is optimized to meet performance benchmarks, which are tested using [Lighthouse](https://developers.google.com/web/tools/lighthouse/).


#### Specification:

You will be provided code for a [Node development server](https://github.com/udacity/mws-restaurant-stage-2) and a README for getting the server up and running locally on your computer. The README will also contain the API you will need to make JSON requests to the server. Once you have the server up, you will begin the work of improving your Stage One project code. You will use the fetch() API to make requests to the server to populate the content of your Restaurant Reviews app.

##### Local Development Server:

I've used this [Local Development API Server](https://github.com/udacity/mws-restaurant-stage-2) for fetching and posting JSON data.


## Project Overview: Stage 3

- Added a validated form submission that allows user to add a review for a restaurant even if there is a lack of connectivity (user is offline), It takes the user submission and store (defer) it until the connection restablishes to send back a POST request to the backend server.
- Added a favorite button that sends a PUT request to the backend server to update the favorite status of a restaurant, which works offline as well.
- The site is optimized to meet performance benchmarks, which are tested using [Lighthouse](https://developers.google.com/web/tools/lighthouse/).
    - Performance score better than 90.
    - Progressive Web App score better than 90.
    - Accessibility score better than 90.

#### Specification:
You will be provided code for an updated [Node development server](ttps://github.com/udacity/mws-restaurant-stage-3) and a README for getting the server up and running locally on your computer. The README will also contain the API you will need to make JSON requests to the server. Once you have the server up, you will begin the work of improving your Stage Two project code.

##### Local Development Server:

I've used this [Local Development API Server](https://github.com/udacity/mws-restaurant-stage-3) for fetching and posting JSON data.


## Getting Started

1. Download and install [Node.js](https://nodejs.org/en/download/).
2. Install dependencies `npm install`.
3. Download and run the [local development API server](https://github.com/udacity/mws-restaurant-stage-3).
4. Download and install [Python](https://www.python.org/).
5. Start up a simple HTTP server `python3 -m http.server 8000`. 
6. Visit [http://localhost:8000](http://localhost:8000)

