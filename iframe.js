var Load = function() {
	// Get the window displayed in the iframe.
	var receiver = document.getElementById('webrtc').contentWindow;
  
	// Get a reference to the 'Send Message' button.
	var btn = document.getElementById('join');
    var rejoin = document.getElementById('rejoin');
    var leave = document.getElementById('leave');
    var dicsonnect = document.getElementById('disconnect');
    var stop = document.getElementById('stop');

	// A function to handle sending messages.
	function sendMessage(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

        //Room Name
        var room = document.getElementById("room").value;
		// Send a message with the text 'Hello Treehouse!' to the new window.
        receiver.postMessage(JSON.stringify({type: "start",data: room, sender: window.location.href}), 'https://alxprize.github.io/webrtc/webrtc.html');
	}

    function sendRejoin(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

        //Room Name
        var room = document.getElementById("room").value;
		// Send a message with the text 'Hello Treehouse!' to the new window.
        receiver.postMessage(JSON.stringify({type: "room",data: room, sender: window.location.href}), 'https://alxprize.github.io/webrtc/webrtc.html');
	}

    function sendLeave(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

        //Room Name
        var room = document.getElementById("room").value;
		// Send a message with the text 'Hello Treehouse!' to the new window.
        receiver.postMessage(JSON.stringify({type: "leave",data: room, sender: window.location.href}), 'https://alxprize.github.io/webrtc/webrtc.html');
	}

    function sendDisconnect(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

        //Room Name
        var room = document.getElementById("room").value;
		// Send a message with the text 'Hello Treehouse!' to the new window.
        receiver.postMessage(JSON.stringify({type: "disconnect",data: room, sender: window.location.href}), 'https://alxprize.github.io/webrtc/webrtc.html');
	}

    function sendStop(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

        //Room Name
        var room = document.getElementById("room").value;
		// Send a message with the text 'Hello Treehouse!' to the new window.
        receiver.postMessage(JSON.stringify({type: "stop",data: room, sender: window.location.href}), 'https://alxprize.github.io/webrtc/webrtc.html');
	}


	// Add an event listener that will execute the sendMessage() function
	// when the send button is clicked.
	btn.addEventListener('click', sendMessage);
    rejoin.addEventListener('click', sendRejoin);
    leave.addEventListener('click', sendLeave);
    dicsonnect.addEventListener('click', sendDisconnect);
    stop.addEventListener('click', sendStop);

    var onMessage = function(e){
        var pkg = JSON.parse(e.data);
        console.log("iframe: " + pkg.data);
    }

    window.addEventListener('message', onMessage);
}
