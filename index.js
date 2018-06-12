const EBAY_CATEGORY_URL="http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByCategory&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=LynseyPo-SWCWebsi-PRD-e2ccf98b2-a9811a7d&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&categoryId=66927&itemFilter(0).name=Seller&itemFilter(0).value(0)=diggersupply&paginationInput.entriesPerPage=12&paginationInput.pageNumber=1"



function getDataFromApi(searchTerm, callback) {
const EBAY_SEARCH_URL = `https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=LynseyPo-SWCWebsi-PRD-e2ccf98b2-a9811a7d&OPERATION-NAME=findItemsIneBayStores&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&keywords=${searchTerm}&storeName=diggersupply&GLOBAL-ID=EBAY-US&siteid=0&paginationInput.entriesPerPage=12&paginationInput.pageNumber=1&callback=?`;
  
  $.getJSON(EBAY_SEARCH_URL, callback);
  console.log('getDataFromApi ran');
}

function renderResult(result, index) {
  const indexNum = index + 1;
  //determine first of row and store for use in building html
  let newRow = [];
  let j = 1;
  while (j < 12) {
    newRow.push(j);
    j += 3;
  }   
  // div html template
  let currentPrice = parseFloat(`${result.sellingStatus[0].currentPrice[0].__value__}`);
  let displayPrice = currentPrice.toFixed(2);

  let template = `<div class="col-4">
    <div class="card">
    <h4 id="cardh4">${result.title}</h4>
    <a class="js-result-name" href="${result.viewItemURL}" target="_blank">
    <img src="${result.galleryURL}" alt="eBay item no. ${result.itemID}: ${result.title}" class="card-image">
    </a>
   <p>Category:<br> ${result.primaryCategory[0].categoryName[0]}<br>
      Current Price: $${displayPrice}</p>
    </div>
   </div>`;
  // add row tag to first item in row
  if (newRow.includes(indexNum)) {
    template = `<div class="row">` + template;
  }
  // add ending tag to last item in row
  if (indexNum % 3 === 0) {
    template += `</div>`;
  }
  return template;
}

function displayEbaySearchData(data) {
  const resultArray = data.findItemsIneBayStoresResponse[0].searchResult[0].item;
  const results = resultArray.map((item, index) => renderResult(item, index));
  //join array of stings into one string and add to .search-results div
  $('.search-results').html(results.join(''));
}


//watch submit of eBay search button
function watchEbaySubmit() {
  $('.ebay-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val("");
    getDataFromApi(query, displayEbaySearchData);
  });
}

function initMap() {
  // The location of Uluru
  var uluru = {lat: 35.108045, lng: -106.644853};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 15, center: uluru});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});
}

function handleStartPage() {
  initMap();
  watchEbaySubmit();
}

$(handleStartPage);



