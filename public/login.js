const { response } = require("express");
const { stringify } = require("openai/src/internal/qs/stringify.js");

// const detailsupdateform = document.getElementById('detailsupdateform');
// detailsupdateform.addEventListener("submit", async (event) =>{
//   event.preventDefault();
//   const elergies = document.getElementById("elergies").value;
//   const dislikes = document.getElementById("dislikes").value;
//   const healthconditions = document.getElementById("healthconditions").value;
//   const likes = document.getElementById("likes").value;

//   try{
// await fetch('detailsupdate', {
//   methode
// });
//   }catch(error){

//   }
// });




const loginForm = document.getElementById("login_form");
const loadingOverlay = document.getElementById("loading-overlay");
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const loginEmail = document.getElementById("login_email").value;
  const loginPassword = document.getElementById("login_password").value;
  
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  showLoadingSpinner();
  // Basic client-side validation
  if (loginEmail == "" || loginPassword == "") {
    displayFloatingCard('Please fill all the fields', 'error');
    hideLoadingSpinner();
    return;
  }

  if (!emailRegex.test(loginEmail)) {
    displayFloatingCard('Please provide a valid email address.', 'error');
    hideLoadingSpinner();
    return;
  }

  // Send data to server
  

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login_email: loginEmail,
        login_password: loginPassword
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      displayFloatingCard(result.message, 'success');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000); // Redirect after 2 seconds
    } else {
      displayFloatingCard(result.error, 'error');
    }

  } catch (error) {
    displayFloatingCard('An error occurred. Please try again later.', 'error');
  }
  hideLoadingSpinner();
});



function showLoadingSpinner() {
    loadingOverlay.classList.add('active');
  }
  
  function hideLoadingSpinner() {
    loadingOverlay.classList.remove('active');
  }

function displayFloatingCard(message, type) {
  const card = document.createElement('div');
  card.className = `floating-card ${type}`;
  
  const icon = document.createElement('img');
  icon.className = 'card-icon';
  
  if (type === 'error') {
    icon.src = 'error.png';  // Assuming error.png is in the same directory
  } else if (type === 'success') {
    icon.src = 'tick.png';  // Assuming success.png is in the same directory
  }

  const text = document.createElement('span');
  text.className = 'card-message';
  text.textContent = message;

  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '✕';
  closeBtn.onclick = () => {
    card.remove();
  };

  card.appendChild(icon);
  card.appendChild(text);
  card.appendChild(closeBtn);
  
  document.body.appendChild(card);

  // Automatically remove the card after 3 seconds
  setTimeout(() => {
    card.remove();
  }, 4000);
}