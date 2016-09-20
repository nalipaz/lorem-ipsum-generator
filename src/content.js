chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var input = document.activeElement;
    if (input.selectionStart || input.selectionStart == '0') {
      var startPos = input.selectionStart;
      var endPos = input.selectionEnd;
      input.value = input.value.substring(0, startPos)
        + request.lipsum
        + input.value.substring(endPos, input.value.length);
    } else {
      input.value += request.lipsum;
    }
  }
);