window.onload = function() {
	// Get the window displayed in the iframe.
	var receiver = document.getElementById('iframe').contentWindow;
  
	// Get a reference to the 'Send Message' button.
	var btn = document.getElementById('join');

	// A function to handle sending messages.
	function sendMessage(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

        //Room Name
        var room = document.getElementById("room").value;
		// Send a message with the text 'Hello Treehouse!' to the new window.
        receiver.postMessage(JSON.stringify({type: "room",data: room}), 'https://alxprize.github.io/webrtc/webrtc.html');
	}

	// Add an event listener that will execute the sendMessage() function
	// when the send button is clicked.
	btn.addEventListener('click', sendMessage);
}
