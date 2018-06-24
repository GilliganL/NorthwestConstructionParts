
const state = {
    pageNum: 1,
    searchTerm: '',
    category: '' 
}

//access eBay api for user generated search
function getDataFromApi(searchTerm) {
const EBAY_SEARCH_URL = (`https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=LynseyPo-SWCWebsi-PRD-e2ccf98b2-a9811a7d&OPERATION-NAME=findItemsIneBayStores&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&keywords=${state.searchTerm}&storeName=diggersupply&GLOBAL-ID=EBAY-US&siteid=0&paginationInput.entriesPerPage=12&paginationInput.pageNumber=${state.pageNum}&callback=?`);

  $.getJSON(EBAY_SEARCH_URL, displayEbayData);

}

//Display error message with invalid search or item not in eBay inventory
function displayError(err) {

    const errorMessage = '<h4>Please contact us for this product</h4>'
    $('.search-results').prop('hidden', false).html(errorMessage);

}

function renderResult(result, index) {
  const indexNum = index + 1;
  //determine first of row and store for use in building html
  let newRow = [];
  let j = 1;
  while (j < 12) {
    newRow.push(j);
    j += 4;
  }   
  // div html template
  let currentPrice = parseFloat(`${result.sellingStatus[0].currentPrice[0].__value__}`);
  let displayPrice = currentPrice.toFixed(2);

  let template = `<div class="col-3">
    <div class="card">
    <h4 id="cardh4">${result.title}</h4>
    <a class="js-result-name" href="${result.viewItemURL}" target="_blank">
    <img src="${result.galleryURL}" alt="eBay item no. ${result.itemID}: ${result.title}" class="card-image">
    </a>
   <p>Category: ${result.primaryCategory[0].categoryName[0]}<br>
      Current Price: $${displayPrice}</p>
    </div>
   </div>`;
  // add row tag to first item in row
  if (newRow.includes(indexNum)) {
    template = `<div class="row">` + template;
  }
  // add ending tag to last item in row
  if (indexNum % 4 === 0) {
    template += `</div>`;
  }
  return template;
}

//watch submit of eBay search button
function watchEbaySubmit() {
  $('.ebay-form').submit(event => {
    event.preventDefault();
    state.category = '';
    state.pageNum = 1;
    const queryTarget = $(event.currentTarget).find('.js-query');
    state.searchTerm = queryTarget.val();
    queryTarget.val("");
    $('.js-query').attr('placeholder', state.searchTerm);
    

    getDataFromApi(state.searchTerm, displayEbayData);
  });
}

function displayEbayData(data) {
  //set array per type of search
  if (data.findItemsByCategoryResponse) {
        array = data.findItemsByCategoryResponse
  } else {
      array = data.findItemsIneBayStoresResponse
  }

  try {
      const resultArray = array[0].searchResult[0].item;
      const results = resultArray.map((item, index) => renderResult(item, index));
      /*join array of strings into one string and add to .search-results div. 
      show appropriate pagination buttons and page number */    
      $('.search-results').prop('hidden', false).html(results.join(''));
      $('.pageButtons').prop('hidden', false);
      $('.pageNumDisplay').html(`Page ${state.pageNum}`);
      if(state.pageNum == 1) {
        $('#prevButton').addClass('hidden');
        $('#nextButton').removeClass('hidden');
      } else {
        $('#prevButton').removeClass('hidden');
        $('#nextButton').removeClass('hidden');
      } 
    }
      catch(err) {
        displayError(err);
    }
  }

//access eBay api for preset category search
function getCategoryDataFromEbay(category) {
  console.log(category);

   const EBAY_CATEGORY_URL=(`https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByCategory&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=LynseyPo-SWCWebsi-PRD-e2ccf98b2-a9811a7d&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&categoryId=${state.category}&itemFilter(0).name=Seller&itemFilter(0).value(0)=diggersupply&paginationInput.entriesPerPage=12&paginationInput.pageNumber=${state.pageNum}&callback=?`);
   
       $.getJSON(EBAY_CATEGORY_URL, displayEbayData);
}

//show items by eBay category
function listenForCategoryButton() {

  $('.category-button').click(event => {

        event.preventDefault();
        state.searchTerm = '';
        state.pageNum = 1;
        const buttonPushed = $(event.currentTarget);
        state.category = buttonPushed.data().value;

        getCategoryDataFromEbay(state.category);
});
}

//handle pagination
function handlePageButtons() {
  console.log('handlePageButtons ran');
  $('#prevButton').click(event => {
      event.preventDefault();
      makePagination(-1);
  });
  $('#nextButton').click(event => {
      event.preventDefault();
      makePagination(1);
  });
}

function makePagination(step) {

   state.pageNum += step;
    if (state.category) {
      getCategoryDataFromEbay(state.category);
    } else {
      console.log(state.pageNum)
      getDataFromApi(state.searchTerm);
    }
}

//fix navigation bar to the top of the screen on scroll
function watchScroll() {
  $(document).scroll(function() {
    if(window.scrollY >= 570) {
      $('nav').addClass('fixed');
      $('.nav-name').removeClass('hidden');
    } else {
      $('nav').removeClass('fixed');
      $('.nav-name').addClass('hidden');
    }

  });
}

//google maps location
function initMap() {
  // The location of Uluru
  var uluru = {lat: 36.9989797, lng: -109.0473741};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 15, center: uluru});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});
}


function handleStartPage() {
  initMap();
  watchScroll();
  watchEbaySubmit();
  listenForCategoryButton();
  handlePageButtons();
}

$(handleStartPage);



