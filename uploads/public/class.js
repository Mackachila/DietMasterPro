const socket = io();
const videoContainer = document.getElementById('videoContainer');
const minimizeBtn = document.getElementById('minimizeBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const closeBtn = document.getElementById('closeBtn');
const stopVideoBtn = document.getElementById('stopVideoBtn');
const startVideoButton = document.getElementById('startVideoButton');
let isMaximized = false;
let mediaStream = null;

// Start video stream
async function startVideo() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const videoElement = document.getElementById('localVideo');
    videoElement.srcObject = mediaStream;
    videoElement.play();
    videoContainer.style.display = 'block';
    startVideoButton.style.display = 'none'; // Hide the start video button
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
}

// Stop video stream
function stopVideo() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }
  videoContainer.style.display = 'none';
  startVideoButton.style.display = 'block'; // Show the start video button
}

// Minimize the window
minimizeBtn.addEventListener('click', () => {
  // Simulate minimizing the window to the taskbar
  videoContainer.style.display = 'none'; // You can adjust this behavior depending on your needs
});

// Maximize the window
maximizeBtn.addEventListener('click', () => {
  if (!isMaximized) {
    videoContainer.style.width = '100vw';
    videoContainer.style.height = '100vh';
    videoContainer.style.top = '0';
    videoContainer.style.left = '0';
    isMaximized = true;
  } else {
    videoContainer.style.width = '600px';
    videoContainer.style.height = '400px';
    videoContainer.style.top = '50px';
    videoContainer.style.left = '50px';
    isMaximized = false;
  }
});

// Close the window and stop video
closeBtn.addEventListener('click', () => {
  stopVideo();
  window.close(); // Close the window/process (depends on browser, may require different behavior)
});

// Stop video on button click
stopVideoBtn.addEventListener('click', stopVideo);

// Make the video container draggable
videoContainer.addEventListener('mousedown', (e) => {
  let offsetX = e.clientX - videoContainer.offsetLeft;
  let offsetY = e.clientY - videoContainer.offsetTop;
  function mouseMoveHandler(e) {
    videoContainer.style.left = `${e.clientX - offsetX}px`;
    videoContainer.style.top = `${e.clientY - offsetY}px`;
  }
  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', mouseMoveHandler);
  }, { once: true });
});

// Start video on button click
startVideoButton.addEventListener('click', startVideo);
