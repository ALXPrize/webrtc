//PlayerDataHandler.localRoom = "alxprizeCodex";
//PlayerDataHandler.iframeVisible = false;

CodexPacket = function(e){
    
    //
    //  Local Recv Types: onjoin, onclientjoin, onclose
    //

    this.type = "";
    this.data = {};
    this.sender = window.location.href;
    this.receiver = "http://127.0.0.1/~cclark/Sandbox/JaHOVA/JaHOVA/GTL_Git/XPrize/webrtc/webrtc.html";//'https://alxprize.github.io/webrtc/webrtc.html';
    Object.defineProperty(this, 'iframe', {value: 'static', writable: true});
    this.iframe = CodexWebRTC.iframe;

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
    this.iframe.postMessage(this.Serialize(),this.receiver);
    //sender: 'https://alxprize.github.io/webrtc/webrtc.html''
}


CodexWebRTC = {
    iframe: "",
    Init: function(){
        CodexWebRTC.iframe = document.getElementById('CodexCaller').contentWindow;
    },
    Hide: function(){
        CodexWebRTC.iframe.style.display = 'none';
    },
    Show: function(){
        CodexWebRTC.iframe.style.display = '';
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
    oniframeLoad: function(){
        if(CodexWebRTC.Callbacks.oniframeLoad)
            CodexWebRTC.Callbacks.oniframeLoad(pkt);
    },
    onStart: function(pkt){
        if(CodexWebRTC.Callbacks.onStart)
            CodexWebRTC.Callbacks.onStart(pkt);
    },
    onStop: function(pkt){
        if(CodexWebRTC.Callbacks.onStop)
            CodexWebRTC.Callbacks.onStop(pkt);
    },
    onJoin: function(pkt){
        if(CodexWebRTC.Callbacks.onJoin)
            CodexWebRTC.Callbacks.onJoin(pkt);
    },
    onClientJoin: function(pkt){
        if(CodexWebRTC.Callbacks.onClientJoin)
            CodexWebRTC.Callbacks.onClientJoin(pkt);
    },
    onClientLeave: function(pkt){
        if(CodexWebRTC.Callbacks.onClientLeave)
            CodexWebRTC.Callbacks.onClientLeave(pkt);
    },
    onLeave: function(){
        if(CodexWebRTC.Callbacks.onLeave)
            CodexWebRTC.Callbacks.onLeave(pkt);
    },
    onClose: function(pkt){
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
        oniframeLoad: null
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
        else if(pkt.type == "iframeload"){
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

