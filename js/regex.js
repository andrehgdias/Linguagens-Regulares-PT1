// Initializing Tooltips
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems, { delay: 50 });
});

function TriggerChange() {
    // Create a new 'change' event
    var event = new Event('change');
    // Dispatch it.
    document.getElementById('text_one').dispatchEvent(event);
    document.getElementById('text_two').dispatchEvent(event);

}

function ClearClasses(userInput) {
    userInput.className = ''
}

function Validate(event) {
    let userRegexp = new RegExp(document.getElementById('user_regexp').value);
    let userInput = event.target;
    ClearClasses(userInput);
    let userText = userInput.value;
    if (userRegexp.exec(userText)) userInput.classList.add("right");
    else userInput.classList.add("wrong");
}