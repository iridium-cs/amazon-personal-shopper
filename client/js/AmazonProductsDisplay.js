class AmazonProductsDisplay {

    constructor(amazonProductsPresenter) {
        this.amazonProductsPresenter = amazonProductsPresenter;
        this.products = [];
    }

    init() {
        this.productsDisplayContainer = $('#amazonProductsDisplayContainer');
        this.productsDisplayCreate();
        this.productsDisplayProducts = $('#productsDisplayProducts');
        this.backToProductsFinderButton = $('#backToProductFinder');
        this.filterButton = $('#filterButton');
        this.addSelectedProductsToCart = $('#addSelectedProductsToCart');
        this.productsDisplayEventsInit();

        // test data for 1 row can be made to the display UI
        // const productsSample = [{name: 'test products', imageUrl: '/.jpg', url: '.html', price: '30', stars: '3', starsCount:'200', asin: 'B077SCNCHF'}];
        // this.productsDisplayEvent_showProducts(productsSample);
    }

    // productsDisplayCreate - inserts it's html into the dom
    productsDisplayCreate() {
        this.productsDisplayContainer.html('');
        let str = `
        <h2>Products</h2>
        <div id="productsDisplayHeaders" class="tableHeader columns">
            <div class="column"><h5>Image</h5></div>
            <div class="column is-one-third"><h5>Description</h5></div>
            <div class="column centerText"><h5>Price</h5></div>
            <div class="column centerText"><h5>Stars</h5></div>
            <div class="column centerText"><h5>Add to Order</h5></div>
            <div class="column centerText"><h5>Add to Favorites</h5></div>
        </div>

        <div class="columns filter">
          <div class="column is-one-third">Name<input class="productKeyword" id="nameFilterIn" type="text" value="name"/></div>
          <div class="column centerText">Min Price<input class="productMinPrice centerText" id="minFilterIn"type="text" value="1" /></div>
          <div class="column centerText">Max Price<input class="productMaxPrice centerText" id="maxFilterIn" type="text" value="10" /></div>
          <div class="column centerText">Stars<input class="productStarRating centerText" id="starFilterIn"type="text" value="4" /></div>
          <div class="column centerText"><button id="filterButton">Filter</button></div>
        </div>

        <div id="productsDisplayProducts" class="tableBody"></div>
        <div id="productsDisplayFooters" class="tableFooter">
            <button id="backToProductFinder">Back to Product Finder</button><button id="addSelectedProductsToCart">Add Selected to Amazon Cart</button>
        </div>`;
        this.productsDisplayContainer.html(str).fadeIn();
    }

    // productsDisplayEventsInit - initializes button events for newly created html
    productsDisplayEventsInit() {
        this.backToProductsFinderButton.click(e => {
            this.productsDisplayProducts.html('');
            this.amazonProductsPresenter.productsDisplayEvent_backToProductsFinderClicked();
        });
        this.addSelectedProductsToCart.click(e => {
            let asins = this.helper_createProductAsinsArray();
            if (asins.length) {
                this.amazonProductsPresenter.productsDisplayEvent_addToCartClicked(asins);
            }
        });
        this.filterButton.click(e => {
            let criteria = this.helper_getFilterCriteria();
            this.productsDisplayEvent_filterProducts(this.products, criteria)
        });
    }



    // productsDisplayEventsInit - event from presenter that passes an array of products to this function to render a row for each product
    productsDisplayEvent_showProducts(products) {
      //this.productDisplayProducts.html('');
      this.products = products;
        products.forEach((product, i) => {
            let str = `
            <div class="productRow columns">
              <div class="column"><img src="${product.imageUrl}" width="200px" /></div>
              <div class="column is-one-third"><a target="_blank" href="${product.url}">${product.name}</a></div>
              <div class="column centerText">$${product.price}</div>
              <div class="column centerText">${product.stars}</div>
              <div class="column centerText"><input class="productSelected" type="checkbox" /><input type="hidden" class="asin" value="${product.asin}" /></div>
              <div class="column centerText"><input class="productFavorited" type="checkbox" /><input type="hidden" class="asin" value="${product.asin}" /></div>
            </div>
            `;
            this.productsDisplayProducts.append(str).fadeIn(200 + i * 50);
        });
    }

    productsDisplayEvent_filterProducts(products, criteria) {
      this.productsDisplayProducts.html('');
        products.filter(function(product){
          let nameMatch = product.name.toLowerCase().includes(criteria.name.toLowerCase());
          console.log('name match', nameMatch);
          let prodPrice = parseInt(product.price.replace(/[^0-9]/, ''));
          let stars = parseInt(product.stars.split(' ')[0]);
          console.log(prodPrice);
          console.log(stars);
          let priceMatch = (prodPrice <= criteria.maxPrice && prodPrice >= criteria.minPrice);
          let starMatch = stars >= criteria.stars;
          return (nameMatch && priceMatch && starMatch);
        }).forEach((product, i) => {
          console.log('')
            let str = `
            <div class="productRow columns">
              <div class="column"><img src="${product.imageUrl}" width="200px" /></div>
              <div class="column is-one-third"><a target="_blank" href="${product.url}">${product.name}</a></div>
              <div class="column centerText">$${product.price}</div>
              <div class="column centerText">${product.stars}</div>
              <div class="column centerText"><input class="productSelected" type="checkbox" /><input type="hidden" class="asin" value="${product.asin}" /></div>
            </div>
            `;
            this.productsDisplayProducts.append(str).fadeIn(200 + i * 50);
        });
    }

    // helper_createProductAsinsArray - loops thru the table and gathers the hidden asin values into an array
    helper_createProductAsinsArray() {
        let productAsins = [];
        let productRows = $('#productsDisplayProducts .productRow').length + 1;
        for (let i = 1; i < productRows; i++) {
            if ($('#productsDisplayProducts .productRow:nth-child(' + i + ') .productSelected').is(":checked")) {
                let asin = $('#productsDisplayProducts .productRow:nth-child(' + i + ') .asin').val();
                productAsins.push(asin);
            }
        }
        return productAsins;
    }

    helper_getFilterCriteria() {
        let criteria = {};
        criteria.name = $("#nameFilterIn").val();
        criteria.minPrice = parseInt($("#minFilterIn").val());
        criteria.maxPrice = parseInt($("#maxFilterIn").val());
        criteria.stars = parseInt($("#starFilterIn").val());
        console.log(criteria);
        return criteria;
    }

}
