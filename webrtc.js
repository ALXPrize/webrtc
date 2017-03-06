PlayerDataHandler.localRoom = "alxprizeCodex";
PlayerDataHandler.iframeVisible = false;

CodexPacket = function(e){
    
    //
    //  Local Recv Types: onjoin, onclientjoin, onclose
    //

    this.type = "";
    this.data = {};
    this.sender = window.location.href;
    this.receiver = CodexWebRTC.iframe;

    if(e){
        var input = JSON.parse(e);
        this.type = input.type.toLowerCase();
        this.data = input.data;
    }
}
CodexPacket.prototype.Serialize = function(){
    return JSON.stringify(this);
}
CodexPacket.prototype.Send = function(){
    this.receiver.postMessage(tihs.Serialize(),'https://alxprize.github.io/webrtc/webrtc.html');
}


CodexWebRTC = {
    iframe: "",
    Init: function(){
        CodexWebRTC.iframe = document.getElementById('CodexCaller').contentWindow;
        window.addEventListener('message', CodexWebRTC.onMessage);
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
        pkt.type = "stopstream";
        pkt.Send();

    },
    Restart: function(){
        var pkt = new CodexPacket();
        pkt.type = "restart";
        pkt.Send();
    },
    onJoin: function(pkt){

    },
    onClientJoin: function(pkt){

    },
    onClose: function(pkt){

    },
    onMessage: function(e){
        var pkt = new CodexPacket(e);

        if(pkt.type == "onjoin"){
            CodexWebRTC.onJoin(pkt);
        }
        else if(pkt.type ==  "onclientjoin"){
            CodexWebRTC.onClientJoin(pkt);
        }
        else if(pkt.type == "onclose"){
            CodexWebRTC.onClose(pkt);
        }
        else{
            cosole.log("Unknown Packet Type: " + e.data);
        }
    }
}

CodexWebRTC.Init();

