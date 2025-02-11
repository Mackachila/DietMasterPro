const registrationform = document.getElementById('signup-form');

registrationform.addEventListener('submit', async function(event) {
      event.preventDefault();

      // Clear previous messages
      document.getElementById('response-message').innerHTML = '';

      // Validate inputs
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const confirm_password = document.getElementById('confirm_password').value;

      if (password !== confirm_password) {
        document.getElementById('response-message').innerHTML = '<p class="error">Passwords do not match!</p>';
        return;
      }

      // Send the form data to the server using fetch API
      const formData = {
        username: username,
        password: password,
        confirm_password: confirm_password
      };

      try {
        const response = await fetch('/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          document.getElementById('response-message').innerHTML = `<p class="success">${data.message}</p>`;
          // Optionally, redirect to login page
          setTimeout(() => window.location.href = '/login', 2000);
        } else {
          document.getElementById('response-message').innerHTML = `<p class="error">${data.message}</p>`;
        }
      } catch (error) {
        document.getElementById('response-message').innerHTML = '<p class="error">Error occurred. Please try again.</p>';
      }
    });


    // login

    const loginform = document.getElementById('login-form');
  
    loginform.addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent default form submission behavior
  
      // Clear previous messages
      document.getElementById('response-message').innerHTML = '';
  
      // Get form data
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      // Send login request using POST method
      const formData = { username, password };
  
      try {
        const response = await fetch('/login', {
          method: 'POST', // Ensure we are using POST
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData), // Send data in the request body
        });
  
        const data = await response.json();
  
        if (response.ok) {
          document.getElementById('response-message').innerHTML = `<p class="success">${data.message}</p>`;
          setTimeout(() => window.location.href = '/profile', 2000); // Redirect on success
        } else {
          document.getElementById('response-message').innerHTML = `<p class="error">${data.message}</p>`;
        }
      } catch (error) {
        document.getElementById('response-message').innerHTML = '<p class="error">Error occurred. Please try again.</p>';
      }
    });