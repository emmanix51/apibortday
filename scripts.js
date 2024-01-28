window.addEventListener("DOMContentLoaded", (event) => {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name") || "Friend";

  const birthdayMessage = document.getElementById("bday-message");
  birthdayMessage.textContent = `Happy Birthday, ${name}!\nBlow the candle!`;

  const fire = document.getElementById("fire");

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(handleMicrophoneStream)
    .catch((error) => console.error("Wa na access", error));

  function handleMicrophoneStream(stream) {
    const audioContext = new AudioContext();
    const microphone = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    microphone.connect(analyser);

    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    console.log(dataArray);
    console.log(bufferLength);

    function updateOpacity() {
      analyser.getByteFrequencyData(dataArray);
      const averageVolume =
        dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

      const opacity = 1 - averageVolume / 50;
      fire.style.opacity = opacity;

      requestAnimationFrame(updateOpacity);
    }
    updateOpacity();
  }
});
