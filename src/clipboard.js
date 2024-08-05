// Code from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
// Added "textArea.setAttribute('readonly', true);" to avoid screen bouncing on mobile Safari
// because textArea.focus() causes Safari to scroll up the page and pop the keyboard.
// See https://stackoverflow.com/a/45308151/

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.setAttribute('readonly', true);

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      if (!successful) {
        console.log('Fallback: Error on copying text command');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  
    document.body.removeChild(textArea);
  }

  export function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      // do nothing on success
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }