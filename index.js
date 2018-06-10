
function getDataFromApi(searchTerm, callback) {
const EBAY_SEARCH_URL = `https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=LynseyPo-SWCWebsi-PRD-e2ccf98b2-a9811a7d&OPERATION-NAME=findItemsIneBayStores&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&keywords=${searchTerm}&storeName=diggersupply&GLOBAL-ID=EBAY-US&siteid=0&paginationInput.entriesPerPage=4&paginationInput.pageNumber=1&callback=?`;
  
  $.getJSON(EBAY_SEARCH_URL, callback);
  console.log('getDataFromApi ran');
}

function renderResult(result) {
  console.log('renderResult ran');
  return `
    <div class="col-3">
      <h2>
      <a class="js-result-name" href="${result.viewItemURL}" target="_blank">${result.itemId}</a>
      Link to Item by ID</h2>
    </div>
  `;
}

function displayEbaySearchData(data) {
  
  const resultArray = data.findItemsIneBayStoresResponse[0].searchResult[0].item;
  const results = resultArray.map((item, index) => renderResult(item));
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



