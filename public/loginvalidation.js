
const loginForm = document.getElementById("login_form");
const loadingOverlay = document.getElementById("loading-overlay");
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const login_email = document.getElementById("login_email").value;
  const login_password = document.getElementById("login_password").value;
  
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  showLoadingSpinner();
  // Basic client-side validation
  if (login_email == "" || login_password == "") {
    displayFloatingCard('Please fill all the fields', 'error');
    hideLoadingSpinner();
    return;
  }

  if (!emailRegex.test(login_email)) {
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
        login_email: login_email,
        login_password: login_password
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