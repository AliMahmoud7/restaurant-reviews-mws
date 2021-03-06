let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiYWxpbWFobW91ZDciLCJhIjoiY2pqdm1ncXQ4MHR4ZjNycnJobXFoYmwweiJ9.TMWFJkGRL-d-OYFfOfKbdw',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
};
 
/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const picture = document.getElementById('restaurant-img');
  picture.className = 'restaurant-img';
  const imgUrl = DBHelper.imageUrlForRestaurant(restaurant);
  const [imgUrlName, imgType] = [imgUrl, 'jpg'];
  const source1 = document.createElement('source');
  const source2 = document.createElement('source');
  const image = document.createElement('img');

  source1.setAttribute('media', '(min-width: 701px)');
  source1.setAttribute('srcset', `${imgUrlName}-800_2x.${imgType} 2x, ${imgUrlName}-800_1x.${imgType} 1x`);

  source2.setAttribute('media', '(max-width: 700px)');
  source2.setAttribute('srcset', `${imgUrlName}-400_2x.${imgType} 2x, ${imgUrlName}-400_1x.${imgType} 1x`);

  image.className = 'restaurant-img';
  image.src = `${imgUrlName}-800_1x.${imgType}`;
  image.setAttribute('srcset', `${imgUrlName}-800_2x.${imgType} 2x, ${imgUrlName}-400_1x.${imgType} 1x`);
  image.alt = `An Image of ${restaurant.name} Restaurant`;

  picture.append(source1);
  picture.append(source2);
  picture.append(image);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  DBHelper.fetchReviewsByRestaurantId(restaurant.id).then(reviews => {
    fillReviewsHTML(reviews.reverse());
  });

};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  title.setAttribute('tabindex', '0');
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    noReviews.id = 'no-reviews';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');

  if (!navigator.onLine && offlineReviews.length) {
    const offlineStatus = document.createElement('p');
    offlineStatus.classList.add('offline-label');
    offlineStatus.innerHTML = "Offline";
    li.classList.add("offline-review");
    li.appendChild(offlineStatus);
  }

  const wrappingDiv = document.createElement('div');
  wrappingDiv.className = 'name-date-container';
  wrappingDiv.setAttribute('role', 'heading');
  li.appendChild(wrappingDiv);

  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.className = 'review-name';
  wrappingDiv.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = `${new Date(review.createdAt).toLocaleString()}`;
  date.className = 'review-date';
  wrappingDiv.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.className = 'rating';
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Add the the review to the UI and Submit it
 */
const reviewForm = document.getElementById('review-form');
let offlineReviews = [];

reviewForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the default action (submit)

  // Getting the data from the review form
  let restaurantId = getParameterByName('id'); // Parsing URL parameters to get current id value
  let name = document.getElementById('name').value;
  let rating = document.getElementById('rating').value;
  let comments = document.getElementById('comments').value;


  const reviewObj = {
    restaurant_id: parseInt(restaurantId),
    name: name,
    rating: parseInt(rating),
    comments: comments.substring(0, 300),
    createdAt: new Date()
  };
  console.log(reviewObj);

  // Send review to the server
  if (!navigator.onLine) {  // Check if user is offline
    offlineReviews.push(reviewObj);
    DBHelper.sendNewReviewWhenOnline(reviewObj);
  }
  else {
    DBHelper.sendNewReviewToServer(reviewObj);
    offlineReviews = [];
  }

  // Adds the review to the DOM (UI)
  addNewReviewHTML(reviewObj);

  reviewForm.reset();
});

addNewReviewHTML = (review) => {
  // Remove no reviews element if there
  const noReviewsElem = document.getElementById('no-reviews');
  if (noReviewsElem) {
    noReviewsElem.remove();
  }
  const container = document.getElementById('reviews-container');
  const ul = document.getElementById('reviews-list');

  // Add the new review on top of reviews
  ul.insertBefore(createReviewHTML(review), ul.firstChild);
  container.appendChild(ul);
};



/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('aria-label', `${restaurant.name} Restaurant`);
  li.setAttribute('aria-current', 'page');
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
