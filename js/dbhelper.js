/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/`;
  }

  /**
   * IndexedDB HELPER FUNCTIONS
   */
  // ----------------------------------------------------------
  /** Open IndexedDB */
  static openIndexedDB() {
    // If the browser doesn't support service worker, we don't care about having indexedDB
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    return idb.open('restaurant-reviews', 2, (upgradeDb) => {
      switch(upgradeDb.oldVersion) {
        case 0:
          let restaurantsStore = upgradeDb.createObjectStore('restaurants', {
            keyPath: 'id'
          });
          restaurantsStore.createIndex('by-date', 'createdAt');
        case 1:
          let reviewsStore = upgradeDb.createObjectStore('reviews', {
            keyPath: 'id'
          });
          reviewsStore.createIndex('by-restaurant', 'restaurant_id');
      }
    });
  }

  /* Add new data to an indexedDB store */
  static idbAdd(store, data) {
    return DBHelper.openIndexedDB().then((db) => {
      if (!db) return Promise.reject("Can't open indexedDB");

      let tx = db.transaction(store, 'readwrite');
      let keyValStore = tx.objectStore(store);
      if (data.length === undefined) {
        keyValStore.put(data);
      }
      else {
        data.forEach((keyVal) => keyValStore.put(keyVal));
        // data.map((keyVal) => keyValStore.put(keyVal));
      }
      return tx.complete;
    });
  }

  /** Read a value of a specific key (Integer) from an indexedDB store */
  static idbRead(store, key) {
    return DBHelper.openIndexedDB().then((db) => {
      if (!db) return Promise.reject("Can't open indexedDB");

      let tx = db.transaction(store);
      let keyValStore = tx.objectStore(store);
      return keyValStore.get(parseInt(key));
    }).then((val) => {
      if (val) {
        return Promise.resolve(val);
      } else {
        return Promise.reject("Can't find this key!");
      }
    });
  }

  /** Read a value of a specific key (Integer) from an indexedDB index */
  static idbReadAllByIndex(store, index, key) {
    return DBHelper.openIndexedDB().then((db) => {
      if (!db) return Promise.reject("Can't open indexedDB");

      let keyValStore = db.transaction(store).objectStore(store);
      let keyValIndex = keyValStore.index(index);
      return keyValIndex.getAll(parseInt(key));
    }).then((val) => {
      if (val.length) {
        return Promise.resolve(val);
      } else {
        return Promise.reject("Can't find this key!");
      }
    });
  }

  /**
   * Read a value of a specific key (Integer) from an indexedDB store
   * @return (Promise) with an array includes the value, transaction and ObjectStore
   */
  static idbReadWrite(store, key) {
    return DBHelper.openIndexedDB().then((db) => {
      if (!db) return Promise.reject("Can't open indexedDB");

      let tx = db.transaction(store, 'readwrite');
      let keyValStore = tx.objectStore(store);
      return keyValStore.get(parseInt(key)).then((val) => {
        if (val) {
          return Promise.resolve([val, tx, keyValStore]);
        } else {
          return Promise.reject("Can't find this key!");
        }
      });
    });
  }

  /** Read all data from an indexedDB store */
  static idbReadAll(store) {
    return DBHelper.openIndexedDB().then((db) => {
      if (!db) return Promise.reject("Can't open indexedDB");

      let tx = db.transaction(store);
      let keyValStore = tx.objectStore(store);
      return keyValStore.getAll();
    }).then((data) => {
      if (data.length) {
        return Promise.resolve(data);
      } else {
        return Promise.reject("Can't find data!");
      }
    });
  }
  // ----------------------------------------------------------

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    // Get data from indexedDB if existed
    DBHelper.idbReadAll('restaurants').then((restaurants) => {
      console.log("Fetched all restaurants:", restaurants);
      callback(null, restaurants);
    }).catch(error => {
      console.log(error);

      // Get data from the network if not existed in indexedDB and Update it
      fetch(DBHelper.DATABASE_URL + 'restaurants').then((response) => {
        return response.json();
      }).then((restaurants) => {
        DBHelper.idbAdd('restaurants', restaurants).then(() => {
          console.log('Data successfully added');
        }).catch(error => {
          console.log(error);
        });
        callback(null, restaurants);
      }).catch((error) => {
        callback(error, null);
      });
    });

    /*
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const restaurants = JSON.parse(xhr.responseText);
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
    */
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist!', null);
        }
      }
    });

    /*
     DBHelper.idbRead('restaurants', id).then((restaurant) => {
     console.log("Fetched restaurant:", restaurant);
     callback(null, restaurant);
     }).catch(error => {
     console.log(error);

     fetch(DBHelper.DATABASE_URL + `restaurants/${id}`).then((response) => {
     return response.json();
     }).then((restaurant) => {
     callback(null, restaurant);
     }).catch((error) => {
     callback(error, null);
     });
     });
     */
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}`);
  }

  /**
   * Fetch all reviews by restaurant id.
   */
  static fetchReviewsByRestaurantId(id) {
    // Get data from indexedDB if existed
    return DBHelper.idbReadAllByIndex('reviews', 'by-restaurant', id).then((storedReviews) => {
      console.log('Offline stored reviews:', storedReviews);
      return Promise.resolve(storedReviews);
    }).catch((error) => {
      console.log(error);

      // Get data from the network if not existed in indexedDB and Update it
      return fetch(`${DBHelper.DATABASE_URL}reviews/?restaurant_id=${id}`).then((response) => {
        return response.json();
      }).then((reviews) => {
        DBHelper.idbAdd('reviews', reviews).then(() => {
          console.log('Data successfully added');
        }).catch(error => {
          console.log(error);
        });
        console.log('Reviews are:', reviews);
        return Promise.resolve(reviews);
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  /**
   * Send the new user review to the server
   */
  static sendNewReviewToServer(review) {
    // delete review.createdAt;  // Delete the createAt property from review object

    fetch(`http://localhost:1337/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then((response) => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        return response.json();
      }
    }).then((review) => {
      if (review) {
        console.log('Successfully sent review!', review);

        // Add the review to the indexedDB
        DBHelper.idbAdd('reviews', review).then(() => {
          console.log('Data successfully added');
        }).catch(error => {
          console.log(error);
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Handle offline status (Defer offline review to send when get online)
   */
  static sendNewReviewWhenOnline(review) {
    console.log('Review to be sent when online: ', review);

    // Store the reviews locally
    // localStorage.setItem('reviews', JSON.stringify(reviews));

    // Waiting for online status
    window.addEventListener('online', (e) => {
      console.log('Browser is online again!');
      // let storedReviews = JSON.parse(localStorage.getItem('reviews'));

      // Update and clean the offline reviews UI
      const offlineReviews = document.querySelectorAll(".offline-review");
      offlineReviews.forEach(elem => {
        elem.classList.remove("offline-review");
        elem.querySelector(".offline-label").remove();
      });

      // Send the review to the server
      console.log(review);
      DBHelper.sendNewReviewToServer(review);

      // if (storedReviews !== null) {
      //   console.log(storedReviews);
      //   console.log(typeof storedReviews);
      //   storedReviews = storedReviews.reverse();
      //
      //   // Send each review to the server
      //   storedReviews.forEach((review) => DBHelper.sendNewReviewToServer(review));
      //   console.log('Reviews sent to the server');
      //
      //   localStorage.removeItem('reviews'); // remove the reviews locally
      // }
    });
  }

  /**
   * Update restaurant favorite status
   */
  static updateFavoriteStatus(restaurantId, isFavorite) {
    fetch(`${DBHelper.DATABASE_URL}restaurants/${restaurantId}/?is_favorite=${isFavorite}`, {
      method: 'PUT'
    }).then((response) => {
      console.log('[Server] Favorite status changed');
      DBHelper.idbReadWrite('restaurants', restaurantId).then((data) => {
        const [restaurant, tx, restaurantStore] = data;
        restaurant.is_favorite = isFavorite;
        restaurantStore.put(restaurant);
        return tx.complete;
      }).then(() => {
        console.log('[IndexedDB] Favorite status successfully changed');
      }).catch(error => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  }


  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      });
      marker.addTo(newMap);
    return marker;
  } 
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

}


// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    console.log('SW registration worked');
  }).catch(err => {
    console.log('Registration failed!!');
  });
}
