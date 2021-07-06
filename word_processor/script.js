
let btn = document.querySelector("button");
btn.onclick = e => {
    let selection = getSelection();

    let focusNode = selection.focusNode;
    if (focusNode != null) {
        let parentNode = focusNode.parentNode;
        if (parentNode.contains(focusNode)) {
            let newElement = document.createElement("h1");
            newElement.textContent = "Something big";
            parentNode.replaceChild(newElement, focusNode);
        }
        let innerText = focusNode.parentElement.innerText;
        highlightText(innerText, selection);
    }
}


function getRangeFromSelection(selection) {
    let range = selection.getRangeAt(0);
    return { start: range.startOffset, end: range.endOffset };
}


function highlightText(text, selection) {

    let { start, end } = getRangeFromSelection(selection)
    
    let newInnerHTML = text.slice(0, start) + "<span class='--highlighted'>" + text.slice(start, end) + "</span>" + text.slice(end, text.length);
    
    selection.focusNode.parentElement.innerHTML = newInnerHTML;
}