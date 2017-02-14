var Load = function() {
	// Get the window displayed in the iframe.
	var receiver = document.getElementById('webrtc').contentWindow;
  
	// Get a reference to the 'Send Message' button.
	var btn = document.getElementById('join');

	// A function to handle sending messages.
	function sendMessage(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

        //Room Name
        var room = document.getElementById("room").value;
		// Send a message with the text 'Hello Treehouse!' to the new window.
        receiver.postMessage(JSON.stringify({type: "room",data: room, sender: window.location.href}), 'https://alxprize.github.io/webrtc/webrtc.html');
	}

	// Add an event listener that will execute the sendMessage() function
	// when the send button is clicked.
	btn.addEventListener('click', sendMessage);

    var onMessage = function(e){
        var pkg = JSON.parse(e.data);
        console.log("iframe: " + pkg.data);
    }

    window.addEventListener('message', onMessage);
}
