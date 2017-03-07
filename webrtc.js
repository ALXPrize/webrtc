//PlayerDataHandler.localRoom = "alxprizeCodex";
//PlayerDataHandler.iframeVisible = false;

CodexPacket = function(e){
    
    //
    //  Local Recv Types: onjoin, onclientjoin, onclose
    //

    this.type = "";
    this.data = {};
    this.sender = window.location.href;
    this.receiver = 'https://alxprize.github.io/webrtc/webrtc.html'; //"http://127.0.0.1/~cclark/Sandbox/JaHOVA/JaHOVA/GTL_Git/XPrize/webrtc/webrtc.html";//
    Object.defineProperty(this, 'contentWindow', {value: 'static', writable: true});
    this.contentWindow = CodexWebRTC.contentWindow;

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
    this.contentWindow.postMessage(this.Serialize(),this.receiver);
    //sender: 'https://alxprize.github.io/webrtc/webrtc.html''
}


CodexWebRTC = {
    name: "Default",
    gender: "male",
    iframe: "",
    contentWindow: "",
    state: 0,
    States: {
        UNINIT: 0,
        READY: 1,
        IN_ROOM: 2,
        STREAM_OFF: 3,
        CLOSED: 4
    },
    Init: function(){
        CodexWebRTC.iframe = document.getElementById('CodexCaller');
        CodexWebRTC.contentWindow = CodexWebRTC.iframe.contentWindow;
        CodexWebRTC.Callbacks.onStart = function(){
            CodexWebRTC.Callbacks.onStart = null;
            CodexWebRTC.StopStream();
        }
        CodexWebRTC.Start();
    },
    Hide: function(){
        CodexWebRTC.iframe.style.display = 'none';
        if(CodexWebRTC.Callbacks.onHide)
            CodexWebRTC.Callbacks.onHide();
    },
    Show: function(){
        CodexWebRTC.iframe.style.display = '';
        if(CodexWebRTC.Callbacks.onShow)
            CodexWebRTC.Callbacks.onShow();
    },
    Start: function(room){
        var pkt = new CodexPacket();
        pkt.type = "start";
        pkt.data.room = room;
        pkt.Send();
    },
    Join: function(room){
        var pkt = new CodexPacket();
        pkt.type = "join";
        pkt.data.room = room;
        pkt.Send();
    },
    LeaveRoom: function(){
        var pkt = new CodexPacket();
        pkt.type = "leave";
        pkt.Send();

    },
    StopStream: function(){
        var pkt = new CodexPacket();
        pkt.type = "stop";
        pkt.Send();

    },
    Restart: function(){
        var pkt = new CodexPacket();
        pkt.type = "restart";
        pkt.Send();
    },
    SendAvatar: function(){
        var pkt = new CodexPacket();
        pkt.type = 'avatar';
        pkt.data.name = CodexWebRTC.name;
        pkt.data.gender = CodexWebRTC.gender;
        pkt.Send();

    },
    oniframeLoad: function(){
        CodexWebRTC.Init();
        if(CodexWebRTC.Callbacks.oniframeLoad)
            CodexWebRTC.Callbacks.oniframeLoad();
    },
    onStart: function(pkt){
        CodexWebRTC.state = CodexWebRTC.States.READY;
        if(CodexWebRTC.Callbacks.onStart)
            CodexWebRTC.Callbacks.onStart(pkt);
        CodexWebRTC.SendAvatar();
    },
    onStop: function(pkt){
        CodexWebRTC.state = CodexWebRTC.States.STREAM_OFF;
        if(CodexWebRTC.Callbacks.onStop)
            CodexWebRTC.Callbacks.onStop(pkt);
    },
    onJoin: function(pkt){
        CodexWebRTC.state = CodexWebRTC.States.IN_ROOM;
        if(CodexWebRTC.Callbacks.onJoin)
            CodexWebRTC.Callbacks.onJoin(pkt);

        CodexWebRTC.SendAvatar();
    },
    onClientJoin: function(pkt){
        if(CodexWebRTC.Callbacks.onClientJoin)
            CodexWebRTC.Callbacks.onClientJoin(pkt);

        CodexWebRTC.SendAvatar();
    },
    onClientLeave: function(pkt){
        if(CodexWebRTC.Callbacks.onClientLeave)
            CodexWebRTC.Callbacks.onClientLeave(pkt);
    },
    onLeave: function(){
        if(CodexWebRTC.Callbacks.onLeave)
            CodexWebRTC.Callbacks.onLeave();
    },
    onClose: function(pkt){
        CodexWebRTC.state = CodexWebRTC.States.CLOSED;
        if(CodexWebRTC.Callbacks.onClose)
            CodexWebRTC.Callbacks.onClose(pkt);
    },
    Callbacks: {
        onStart: null,
        onStop: null,
        onJoin: null,
        onClientJoin: null,
        onClientLeave: null,
        onLeave: null,
        onClose: null,
        oniframeLoad: null,
        onHide: null,
        onShow: null
    },
    onMessage: function(e){
        console.log("Message: " + e.data);
        var pkt = new CodexPacket(e);
        
        if(pkt.type == "onjoin"){
            CodexWebRTC.onJoin(pkt);
        }
        else if(pkt.type ==  "onclientjoin"){
            CodexWebRTC.onClientJoin(pkt);
        }
        else if(pkt.type ==  "onclientleave"){
            CodexWebRTC.onClientLeave(pkt);
        }
        else if(pkt.type == "onleave"){
            CodexWebRTC.onLeave(pkt);
        }
        else if(pkt.type == "onclose"){
            CodexWebRTC.onClose(pkt);
        }
        else if(pkt.type == "onstop"){
            CodexWebRTC.onStop(pkt);
        }
        else if(pkt.type == "onstart"){
            CodexWebRTC.onStart(pkt);
        }
        else if(pkt.type == "oniframeload"){
            CodexWebRTC.oniframeLoad(pkt);
        }
        else if(pkt.type == "error"){
            console.log("ERROR: " + pkt.data.cmd + "/nValue: "+ pkt.data.value);
        }
        else{
            console.log("Unknown Packet Type: " + e.data);
        }
    }
}
window.addEventListener('message', CodexWebRTC.onMessage);
//CodexWebRTC.Init();






