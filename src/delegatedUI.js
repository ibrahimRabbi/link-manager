function respondWithWindowName(/*string*/ response) {
  var returnURL = window.name;
  window.name = response;
  window.location.href = returnURL;
}

function respondWithPostMessage(/*string*/ response) {
  if (window.parent != null) {
    window.parent.postMessage(response, '*');
  } else {
    window.postMessage(response, '*');
  }
}

function sendCancelResponse() {
  var oslcResponse = 'oslc-response:{ "oslc:results": [ ]}';

  if (window.location.hash == '#oslc-core-windowName-1.0') {
    // Window Name protocol in use
    respondWithWindowName(oslcResponse);
  } else if (window.location.hash == '#oslc-core-postMessage-1.0') {
    // Post Message protocol in use
    respondWithPostMessage(oslcResponse);
  }
}

function select() {
  alert('hi');
  var list = document.getElementById('results');
  console.log(list);
  if (list.length > 0 && list.selectedIndex >= 0) { // something is selected
    var oslcResponse = 'oslc-response:{ "oslc:results": [';
    for (var item = 0; item < list.options.length; item++) {
      var option = list.options[item];
      if (option.selected) {
        oslcResponse += '{"oslc:label": "' + option.text + '", "rdf:resource": "' + option.value + '"}, ';
      }
    }
    oslcResponse = oslcResponse.substr(0, oslcResponse.length - 2) + ']}';
    sendResponse(oslcResponse);
  }
}

function cancel() {
  alert('hello');
  sendCancelResponse();
}