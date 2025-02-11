function toggleForm(type) {
    const individualForm = document.getElementById('individual-form');
    const familyForm = document.getElementById('family-form');
    const switchTextIndividual = document.getElementById('switch-text-individual');
    const switchTextFamily = document.getElementById('switch-text-family');
    const heading = document.getElementById('main-heading');

    heading.style.display = 'none'; // Hide heading when a form is displayed

    if (type === 'individual') {
        individualForm.style.display = 'block';
        familyForm.style.display = 'none';
        switchTextIndividual.style.display = 'block';
        switchTextFamily.style.display = 'none';
    } else if (type === 'family') {
        familyForm.style.display = 'block';
        individualForm.style.display = 'none';
        switchTextFamily.style.display = 'block';
        switchTextIndividual.style.display = 'none';
    }

    // Hide buttons
    document.querySelector('.button-group').style.display = 'none';
}

function resetForm() {
    const individualForm = document.getElementById('individual-form');
    const familyForm = document.getElementById('family-form');
    individualForm.style.display = 'none';
    familyForm.style.display = 'none';
    document.querySelector('.button-group').style.display = 'block';
    document.getElementById('main-heading').style.display = 'block'; // Show heading again

    // Hide both switch text elements
    document.getElementById('switch-text-individual').style.display = 'none';
    document.getElementById('switch-text-family').style.display = 'none';
}


const registrationForm = document.getElementById("individual_registration_form");
registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const registrationEmail = document.getElementById("individual_email").value;
  const registrationPassword = document.getElementById("individual_password").value;
  const registrationConfirmpassword = document.getElementById("individual_confirm_password").value;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{6,}$/;

  // Basic client-side validation
  if (registrationEmail == "" || registrationPassword == "" || registrationConfirmpassword == "") {
    displayFloatingCard('Please fill all the fields', 'error');
    return;
  }

  if (!emailRegex.test(registrationEmail)) {
    displayFloatingCard('Please provide a valid email address.', 'error');
    return;
  }

  if (!passwordRegex.test(registrationPassword)) {
    displayFloatingCard('Password must be at least 6 characters.', 'error');
    return;
  }

  if (registrationPassword.trim() !== registrationConfirmpassword.trim()) {
    displayFloatingCard('Your passwords do not match.', 'error');
    return;
  }

  // Send data to server
  try {
    const response = await fetch('/individualregistration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        individual_email: registrationEmail,
        individual_password: registrationPassword
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      displayFloatingCard(result.message, 'success');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000); // Redirect after 2 seconds
    } else {
      displayFloatingCard(result.error, 'error');
    }

  } catch (error) {
    displayFloatingCard('An error occurred. Please try again later.', 'error');
  }
});

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



const familyregistrationForm = document.getElementById("family_registration_form");
familyregistrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const members = document.getElementById("members").value;
  const registrationEmail = document.getElementById("family_email").value;
  const registrationPassword = document.getElementById("family_password").value;
  const registrationConfirmpassword = document.getElementById("family_confirm_password").value;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{6,}$/;

  // Basic client-side validation
  if (members == "" || registrationEmail == "" || registrationPassword == "" || registrationConfirmpassword == "") {
    displayFloatingCard('Please fill all the fields', 'error');
    return;
  }

  if (members <= 1) {
    displayFloatingCard('Family members must be at least 2.', 'error');
    return;
  }
  if (!emailRegex.test(registrationEmail)) {
    displayFloatingCard('Please provide a valid email address.', 'error');
    return;
  }

  

  if (!passwordRegex.test(registrationPassword)) {
    displayFloatingCard('Password must be at least 6 characters.', 'error');
    return;
  }

  if (registrationPassword.trim() !== registrationConfirmpassword.trim()) {
    displayFloatingCard('Your passwords do not match.', 'error');
    return;
  }

  // Send data to server
  try {
    const response = await fetch('/familyregistration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        members: members,
        family_email: registrationEmail,
        family_password: registrationPassword
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      displayFloatingCard(result.message, 'success');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000); // Redirect after 2 seconds
    } else {
      displayFloatingCard(result.error, 'error');
    }

  } catch (error) {
    displayFloatingCard('An error occurred. Please try again later.', 'error');
  }
});

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




