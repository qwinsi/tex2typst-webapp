// Code from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
// Added "textArea.style.zIndex = "-1";" to ensure the textArea is not visible anytime.
// Added "textArea.setAttribute('readonly', true);" to avoid screen bouncing on mobile Safari
// because textArea.focus() causes Safari to scroll up the page and pop the keyboard.
// See https://stackoverflow.com/a/45308151/

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.zIndex = "-1";
    textArea.setAttribute('readonly', true);

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let successful;
    try {
        successful = document.execCommand('copy');
        if (!successful) {
            console.log('Fallback: Error on copying text command');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        successful = false;
    }

    document.body.removeChild(textArea);
    return successful;
}

// return Promise<boolean>
export function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        const ok = fallbackCopyTextToClipboard(text);
        return Promise.resolve(ok);
    }

    return navigator.clipboard.writeText(text).then(function() {
        return true;
    } , function(err) {
        console.error('Async: Could not copy text: ', err);
        return false;
    });
}