
const peerConnection = new RTCPeerConnection({ iceServers: [] });

export default function GetCleintIP() {
    peerConnection.createDataChannel('');
    peerConnection.createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .catch((error) => console.log(error));
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log(`Client's IP address is ${event.candidate.address}`);
        }
    };
}