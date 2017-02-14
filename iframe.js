var Load = function() {
	// Get the window displayed in the iframe.
	var receiver = document.getElementById('webrtc').contentWindow;
  
	// Get a reference to the 'Send Message' button.
	var btn = document.getElementById('start');
    var join = document.getElementById('join');
    var leave = document.getElementById('leave');
    var dicsonnect = document.getElementById('disconnect');
    var stop = document.getElementById('stop');
    var restart = document.getElementById('restart');

	// A function to handle sending messages.
	function sendMessage(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

        //Room Name
        var room = document.getElementById("room").value;
		// Send a message with the text 'Hello Treehouse!' to the new window.
        receiver.postMessage(JSON.stringify({type: "start",data: room, sender: window.location.href}), 'https://alxprize.github.io/webrtc/webrtc.html');
	}
    function sendRestart(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

        //Room Name
        var room = document.getElementById("room").value;
		// Send a message with the text 'Hello Treehouse!' to the new window.
        receiver.postMessage(JSON.stringify({type: "restart",data: room, sender: window.location.href}), 'https://alxprize.github.io/webrtc/webrtc.html');
	}

    function sendJoin(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

        //Room Name
        var room = document.getElementById("room").value;
		// Send a message with the text 'Hello Treehouse!' to the new window.
        receiver.postMessage(JSON.stringify({type: "join",data: room, sender: window.location.href}), 'https://alxprize.github.io/webrtc/webrtc.html');
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
    join.addEventListener('click', sendjoin);
    leave.addEventListener('click', sendLeave);
    dicsonnect.addEventListener('click', sendDisconnect);
    stop.addEventListener('click', sendStop);
    restart.addEventListener('click', sendRestart);

    var onMessage = function(e){
        var pkg = JSON.parse(e.data);
        console.log("iframe: " + pkg.data);
        if(pkg.type == "ready"){
            document.getElementById("rejoin").style.visibility = "visible";
        }
    }

    window.addEventListener('message', onMessage);
}
