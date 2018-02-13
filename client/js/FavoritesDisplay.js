class FavoritesDisplay {
  constructor(amazonProductsPresenter) {
    this.amazonProductsPresenter = amazonProductsPresenter;
    this.favorites = [];
  }

  init() {
    this.favoritesDisplayContainer = $("#favoritesDisplayContainer");
    this.favoritesDisplayCreate();
    this.getFavorites();
  }

  favoritesDisplayCreate(){
    this.favoritesDisplayContainer.html('');
    let str = `
    <h2>Favorites — Order Again<h2>
    <div id="productsDisplayHeaders" class="tableHeader columns">
    <div class="column"><h5>Image</h5></div>
    <div class="column is-one-third"><h5>Description</h5></div>
    <div class="column centerText"><h5>Price</h5></div>
    <div class="column centerText"><h5>Stars</h5></div>
    <div class="column centerText"><h5>Add to Order</h5></div>
    <div class="column centerText"><h5>Remove from Favorites</h5></div>
    </div>
    `;
    this.favoritesDisplayContainer.html(str);
  }

  getFavorites(){
    // user_id is stored as a string in the session under passport.user
    // The server will process this request by finding the user's favorites in the db,
    // then calling the API for updated product data, then returning said data.
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/getFavorites',
      success: this.insertRowHtml
    })
  }


  insertRowHtml() {
    //process API data

    //turn it into html
    let str = `

    `;
    $("#favoritesDisplayContainer").append(str);
  }
}