
function getDataFromApi(searchTerm, callback) {
const EBAY_SEARCH_URL = `https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=LynseyPo-SWCWebsi-PRD-e2ccf98b2-a9811a7d&OPERATION-NAME=findItemsIneBayStores&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&keywords=${searchTerm}&storeName=diggersupply&GLOBAL-ID=EBAY-US&siteid=0&paginationInput.entriesPerPage=12&paginationInput.pageNumber=1&callback=?`;
  
  $.getJSON(EBAY_SEARCH_URL, callback);
  console.log('getDataFromApi ran');
}

function renderResult(result, index) {
  console.log('renderResult ran');
  const indexNum = index;
  console.log(indexNum);
  if (indexNum == 0 || indexNum == 4 || indexNum == 8) {
    console.log('A ran');
    return `
    <div class="row">
    <div class="col-3">
      <h4>${result.title}</h4>
      <a class="js-result-name" href="${result.viewItemURL}" target="_blank">
      <img src="${result.galleryURL}" alt="eBay item no. ${result.itemID}: ${result.title}">
      </a>
      <p>Category ${result.primaryCategory.categoryName}
      Current Price: ${result.sellingStatus.currentPrice}
      Time left on auction: ${result.sellingStatus.timeLeft}</p>
    </div>`;
  } else if (indexNum == 3 || indexNum == 7 || indexNum == 11) {
    console.log('B ran');
    return `
    <div class="col-3">
      <h4>${result.title}</h4>
      <a class="js-result-name" href="${result.viewItemURL}" target="_blank">
      <img src="${result.galleryURL}" alt="eBay item no. ${result.itemID}: ${result.title}">
      </a>
      <p>Category ${result.primaryCategory.categoryName}
      Current Price: ${result.sellingStatus.currentPrice}
      Time left on auction: ${result.sellingStatus.timeLeft}</p>
    </div>
    </div>`;
  } else {
    console.log('C ran');
    return `
      <div class="col-3">
        <h4>${result.title}</h4>
        <a class="js-result-name" href="${result.viewItemURL}" target="_blank">
        <img src="${result.galleryURL}" alt="eBay item no. ${result.itemID}: ${result.title}">
        </a>
        <p>Category ${result.primaryCategory.categoryName}
        Current Price: ${result.sellingStatus.currentPrice}
        Time left on auction: ${result.sellingStatus.timeLeft}</p>
      </div>
    `;
}
}

function displayEbaySearchData(data) {
  
  const resultArray = data.findItemsIneBayStoresResponse[0].searchResult[0].item;
  console.log(resultArray);
  const results = resultArray.map((item, index) => renderResult(item, index));
  console.log(results);
  $('.search-results').html(results);
}


function watchSubmit() {
  $('.ebay-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayEbaySearchData);
  });
}

$(watchSubmit);



