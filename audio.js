CodexPacket = function(e){
    
    //
    //  Local Recv Types: onjoin, onclientjoin, onclose
    //

    this.type = "";
    this.data = {};
    this.sender = window.location.href;
    this.receiver = "";
    this.parent = "";

    if(e){
        var input = JSON.parse(e.data);
        this.type = input.type.toLowerCase();
        this.data = input.data;
    }
}
CodexPacket.prototype.Serialize = function(){
    return JSON.stringify(this);
}
CodexPacket.prototype.Send = function(){
    parent.postMessage(this.Serialize(),this.receiver);
}

// grab the room from the URL
var room = "XPrizeCodex";
var nick = Date.now();
var gender = 1;

var nick;
var avatar;
var hasCameras = false;

var webrtc;
var parentSrc = "";
// for simplistic metrics gathering
function track(name, info) {
    if (webrtc && webrtc.connection) {
        webrtc.connection.emit('metrics', name, info || {});
    }
}


function doJoin(room) {
    webrtc.startLocalVideo();
    webrtc.createRoom(room, function (err, name) {
        var newUrl = (framed ? document.referrer : window.parent.location.pathname) + '?' + room;
        if (!err) {
            if (!framed) window.parent.history.replaceState({foo: 'bar'}, null, newUrl);
            setRoom(room);
        } else {
            console.log('error', err, room);
            if (err === 'taken') {
                room = generateRoomName();
                doJoin(room);
            }
        }
    });
}

// document.getElementById('nickInput').onkeydown = function(e) {
//     if (e.keyCode !== 13) return;
//     var el = document.getElementById('nickInput');
//     el.disabled = true;
//     nick = el.value;
//     //nick = nick.toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
//     nick = nick.replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
//     webrtc.sendToAll('nickname', {nick: nick});
//     return false;
// };

document.getElementById('localAvatar').onclick = function(e){
    if(gender){
        gender = 0;
        webrtc.sendToAll('avatar', {avatar: "img/female.png"});
        document.getElementById('localAvatar').src = "img/female.png";
    }
    else{
       gender = 1;
        webrtc.sendToAll('avatar', {avatar: "img/male.png"}); 
        document.getElementById('localAvatar').src = "img/male.png";
    }
}

var queryGum = false;


function Start() {
    webrtc = new SimpleWebRTC({
        // we don't do video
        localVideoEl: '',
        remoteVideosEl: '',
        autoRequestMedia: false,
        enableDataChannels: false,
        media: {
            audio: true,
            video: false
        },
        receiveMedia: { // FIXME: remove old chrome <= 37 constraints format
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 0
        },
    });

    webrtc.on('localStream', function(stream) {
        var localAudio = document.getElementById('localAudio');
        localAudio.disabled = false;
        localAudio.volume = 0;
        //localAudio.srcObject = stream; 
        // var localNick = document.getElementById("nickInput")
        // localNick.innerHTML = nick;

        var track = stream.getAudioTracks()[0];
        var btn = document.querySelector('.local .button-mute');
        btn.style.visibility = 'visible';
        btn.onclick = function() {
            track.enabled = !track.enabled;
            btn.className = 'button button-small button-mute' + (track.enabled ? '' : ' muted');
        };
    });

    webrtc.on('readyToCall', function () {

        var packet = new CodexPacket();
        packet.type = "onstart"
        packet.data.message = "WebRTC Ready";
        packet.receiver = parentSrc;
        packet.Send();
        // pkg = {};
        // pkg.type = "ready"
        // pkg.data = "webRTC Ready";
        // room = "XPrize";
        // parent.postMessage(JSON.stringify(pkg),parentSrc );
        // webrtc.joinRoom(room, function (err, res) {
        //     if (err) return;
        //     window.setTimeout(function () {
        //         webrtc.sendToAll('nickname', {nick: nick});
        //         if(gender == 0){
        //             webrtc.sendToAll('avatar', {avatar: "img/female.png"});
        //         }
        //         else{
        //             webrtc.sendToAll('avatar', {avatar: "img/male.png"});
        //         }

        //     }, 1000);
        // });

    });

    // called when a peer is created
    webrtc.on('createdPeer', function (peer) {
        var remotes = document.getElementById('remotes');
        if (!remotes) return;

        var container = document.createElement('div');
        container.className = 'peerContainer';
        container.id = 'container_' + webrtc.getDomId(peer);

        // inner container
        var d = document.createElement('div');
        d.className = 'remote-details';
        container.appendChild(d);

        // nickname
        var nickname = document.createElement('div');
        nickname.className = 'nick';
        d.appendChild(nickname);

        // avatar image
        var avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = 'img/male.png';
        d.appendChild(avatar);

        // audio element
        // inserted later

        // mute button
        var mute = document.createElement('a');
        mute.className = 'button button-small button-mute';
        mute.appendChild(document.createTextNode('Mute'));
        mute.style.visibility = 'hidden';
        d.appendChild(mute);

        if(gender == 0){
            webrtc.sendToAll('avatar', {avatar: "img/female.png"});
        }
        else{
            webrtc.sendToAll('avatar', {avatar: "img/male.png"});
        }

        mute.onclick = function() {
          if (peer.videoEl.muted) { // unmute
            mute.className = 'button button-small button-mute';
          } else { // mute
            mute.className = 'button button-small button-mute muted';
          }
          peer.videoEl.muted = !peer.videoEl.muted;
        };

        if (peer && peer.pc) {
            peer.firsttime = true;
            peer.pc.on('iceConnectionStateChange', function (event) {
                var state = peer.pc.iceConnectionState;
                container.className = 'peerContainer p2p' +
                    state.substr(0, 1).toUpperCase() +
                    state.substr(1);
                switch (state) {
                case 'connected':
                case 'completed':
                    var packet = new CodexPacket();
                    packet.type = "onclientjoin"
                    packet.data.message = "Client Connected";
                    packet.receiver = parentSrc;
                    packet.Send();
                    //audio.srcObject = peer.stream;
                    mute.style.visibility = 'visible';
                    if (peer.firsttime) {
                        peer.firsttime = false;
                        track('iceSuccess', {
                            session: peer.sid,
                            peerprefix: peer.browserPrefix,
                            prefix: webrtc.capabilities.prefix,
                            version: webrtc.capabilities.browserVersion
                        });
                    }
                    break;
                case 'closed':
                    container.remove();
                    var packet = new CodexPacket();
                    packet.type = "onclientleave"
                    packet.data.message = "Client Left";
                    packet.receiver = parentSrc;
                    packet.Send();
                    break;
                }
            });
        }
        remotes.appendChild(container);
    });

    webrtc.connection.on('message', function (message) {
        var peers = self.webrtc.getPeers(message.from, message.roomType);
        if (!peers && peers.length > 0) return;
        var peer = peers[0];

        // FIXME: also send current avatar and nick to newly joining participants
        try{
             var container = document.getElementById('container_' + webrtc.getDomId(peer));
            if (message.type === 'nickname') {
                container.querySelector('.nick').textContent = message.payload.nick;
            } else if (message.type === 'avatar') {
                container.querySelector('.avatar').src = message.payload.avatar;
            } else if (message.type === 'offer') {
                // update things
                if (nick) {
                    peer.send('nickname', {nick: nick});
                }
                if (avatar) {
                    peer.send('avatar', {avatar: avatar});
                }
            }
        }
        catch(e){
            console.log("Error on WebRTC message: " + e);
        }
       
    });

    // local p2p/ice failure
    webrtc.on('iceFailed', function (peer) {
        console.log('local fail', peer.sid);
        track('iceFailed', {
            source: 'local',
            session: peer.sid,
            peerprefix: peer.browserPrefix,
            prefix: webrtc.capabilities.prefix,
            version: webrtc.capabilities.browserVersion
        });
    });

    // remote p2p/ice failure
    webrtc.on('connectivityError', function (peer) {
        console.log('remote fail', peer.sid);
        track('iceFailed', {
            source: 'remote',
            session: peer.sid,
            peerprefix: peer.browserPrefix,
            prefix: webrtc.capabilities.prefix,
            version: webrtc.capabilities.browserVersion
        });
    });

    if (!(navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.RTCPeerConnection)) {
        // FIXME: show "sorry, get a modern browser" (recommending Edge)
        document.getElementById('supportWarning').style.display = 'block';
        document.querySelector('form#createRoom>button').disabled = true;
    } else if (navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            var cameras = devices.filter(function(device) { return device.kind === 'videoinput'; });
            hasCameras = cameras.length;
            var mics = devices.filter(function(device) { return device.kind === 'audioinput'; });
            if (mics.length) {
                //document.getElementById('requirements').style.display = 'none';
                //if (queryGum) webrtc.startLocalVideo();
                webrtc.startLocalVideo();
            } 
            // else {
            //     document.getElementById('microphoneWarning').style.display = 'block';
            //     document.querySelector('form#createRoom>button').disabled = true;
            // }
        });
    }
}

var onMessage = function(e){
    console.log("Message: " + e.data);
    var pkg = new CodexPacket(e);
    

    if(pkg.type == "start"){
        room = pkg.data.room;
        parentSrc = pkg.sender;
        Start(pkg);
    }
    else if(pkg.type == "join"){
        room = pkg.data.room;
        webrtc.joinRoom(room, function (err, res) {
                var packet = new CodexPacket();
                if (err){
                    packet.type = "error";
                    packet.data.cmd = "onjoin";
                    packet.data.value = room;
                    packet.receiver = pkg.sender;
                    packet.Send();
                    return;
                }
                else{
                    packet.type = "onjoin"
                    packet.data.message = "Joined Room " + room;
                    packet.receiver = pkg.sender;
                    packet.Send();

                    window.setTimeout(function () {
                    webrtc.sendToAll('nickname', {nick: nick});
                        if(gender == 0){
                            webrtc.sendToAll('avatar', {avatar: "img/female.png"});
                        }
                        else{
                            webrtc.sendToAll('avatar', {avatar: "img/male.png"});
                        }

                    }, 2000);
                }
                
            });
        
    }
    else if(pkg.type == "leave"){
        webrtc.leaveRoom();
        var packet = new CodexPacket();
        packet.type = "onleave"
        packet.data.message = "Left Room " + room;
        packet.receiver = pkg.sender;
        packet.Send();
    }
    else if(pkg.type == "disconnect"){
        webrtc.disconnect();
        var packet = new CodexPacket();
        packet.type = "ondisconnect"
        packet.data.message = "Disconnected";
        packet.receiver = pkg.sender;
        packet.Send();
    }
     else if(pkg.type == "stop"){
        webrtc.stopLocalVideo();
        var packet = new CodexPacket();
        packet.type = "onstop"
        packet.data.message = "Stopped";
        packet.receiver = pkg.sender;
        packet.Send();
    }
    else if(pkg.type == "restart"){
        webrtc.startLocalVideo();
    }
    else if(pkg.type == "avatar"){

        //Get and set Name to peers
        nick = pkg.data.name.replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
        webrtc.sendToAll('nickname', {nick: nick});
        document.getElementById('nickInput').innerHTML = nick;

        //Get and set Gender to peers
        gender = pkg.data.gender;
        if(gender.toLowerCase() == 'male'){
            document.getElementById('localAvatar').src = "img/male.png";
            webrtc.sendToAll('avatar', {avatar: "img/male.png"});
        }
        else{
            document.getElementById('localAvatar').src = "img/female.png";
            webrtc.sendToAll('avatar', {avatar: "img/female.png"});
        }
    }
    else{
        cosole.log("Unknown Packet Type: " + e.data);
    }
}

var Load = function(){
    var packet = new CodexPacket();
    packet.type = "oniframeload"
    packet.data.message = "iframe Loaded";
    parent.postMessage(packet.Serialize(), "*");
}
window.addEventListener('message', onMessage);