let localStream;
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localVideo.srcObject = stream;
        localStream = stream;
    });

const socket = new WebSocket(`ws://${window.location.host}/ws/video/${roomName}/`);

let pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

pc.onicecandidate = e => {
    if (e.candidate) {
        socket.send(JSON.stringify({ 'candidate': e.candidate }));
    }
};

pc.ontrack = e => {
    remoteVideo.srcObject = e.streams[0];
};

socket.onmessage = async e => {
    let data = JSON.parse(e.data);

    if (data.offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        let answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({ 'answer': answer }));
    }

    if (data.answer) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    }

    if (data.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
};

localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));

async function createOffer() {
    let offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.send(JSON.stringify({ 'offer': offer }));
}

setTimeout(createOffer, 1000);
