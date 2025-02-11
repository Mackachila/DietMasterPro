document.getElementById('dietForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = {
    allergies: document.getElementById('allergies').value,
    likedFoods: document.getElementById('likedFoods').value,
    dislikedFoods: document.getElementById('dislikedFoods').value,
    healthConditions: document.getElementById('healthConditions').value,
    otherDetails: document.getElementById('otherDetails').value,
  };

  try {
    const response = await fetch('/generate-diet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      showFloatingCard('Diet recommendation generated successfully!', 'success');
      document.getElementById('dietResult').innerHTML = `<pre>${result.data.dietPlan}</pre>`;
    } else {
      showFloatingCard(result.error || 'An error occurred!', 'error');
    }
  } catch (err) {
    showFloatingCard('Failed to connect to the server. Please try again.', 'error');
  }
});

function showFloatingCard(message, type) {
  const card = document.createElement('div');
  card.className = `floating-card ${type}`;
  card.textContent = message;

  document.body.appendChild(card);

  setTimeout(() => card.remove(), 5000);
}



// register-btn
document.addEventListener('DOMContentLoaded', function () {
    //*- console.log('Fetching user details');
     // Fetch the username from the session
     fetch('/get-user')
       .then(response => response.json())
       .then(data => {
    //     console.log('Fetched username from server:', data.username, data.currentAccount, data.accountBallance, data.accountPhonenumber, data.accountEmail, data.invitationLink );
 const username = data.username;
 const email = data.email;
 const contact = data.contact;
// //  const registere_courses = data.registere_courses;
// //  const completed_courses = data.completed_courses;
//  const pending_services = data.pending_services;
//  const certificates = data.certificates;

   
         if (email) {

           // Displaying the user details on his account page
  // document.getElementById('skillsContent').textContent = ` ${registere_courses}`;
   document.getElementById('dashboard-heading').textContent = ` ${username}`;
//    document.getElementById('registee').textContent = ` ${username}`;
//    document.getElementById('user2').textContent = ` ${username}`;
   document.getElementById('contactContent').textContent = `Phone: ${contact}`;
   document.getElementById('emailContent').textContent = `Email: ${email}`;
  // document.getElementById('linkedinContent').textContent =  ` ${completed_courses}`;
  // document.getElementById('githubContent').textContent = ` ${pending_services}`;
  // document.getElementById('abilitiesContent').textContent = ` ${certificates}`;
  
  
  

    // // Slicing and displaying accountEmail
    // const slicedEmail = accountEmail.slice(0, 2) + '*'.repeat(accountEmail.length - 14) + accountEmail.slice(-12);
    // document.getElementById('account_email').textContent = slicedEmail;
    // document.getElementById('account_email').setAttribute('data-original-value', accountEmail);
   
         } else {
           // Redirect to the login page if the username is not available and not already on the login page
           if (window.location.pathname !== '/login') {
             window.location.href = '/userlogin';
           }
         }
       })
       .catch(error => {
         console.error('Error fetching username:', error);
         // Handle the error and maybe redirect to the login page
       });
   });


   // register-btn
document.addEventListener('DOMContentLoaded', function () {
  //*- console.log('Fetching user details');
   // Fetch the username from the session
   fetch('/get-courses')
     .then(response => response.json())
     .then(data => {
  //     console.log('Fetched username from server:', data.username, data.currentAccount, data.accountBallance, data.accountPhonenumber, data.accountEmail, data.invitationLink );
  const courses = data.registered_courses;
  // const completed_courses = completed_courses;
  // const status = status;
  // const Date_of_registration = Date_of_registration;
  // const certificates = certificates;
  
     

         // Displaying the user details on his account page
document.getElementById('skillsContent').textContent = ` ${courses}`;
//  document.getElementById('dashboard-heading').textContent = ` ${username}`;
//  document.getElementById('registee').textContent = ` ${username}`;
//  document.getElementById('user2').textContent = ` ${username}`;
//  document.getElementById('contactContent').textContent = `Phone: ${contact}`;
//  document.getElementById('emailContent').textContent = `Email: ${email}`;
// document.getElementById('linkedinContent').textContent =  ` ${completed_courses}`;
// document.getElementById('githubContent').textContent = ` ${pending_services}`;
// document.getElementById('abilitiesContent').textContent = ` ${certificates}`;




  // // Slicing and displaying accountEmail
  // const slicedEmail = accountEmail.slice(0, 2) + '*'.repeat(accountEmail.length - 14) + accountEmail.slice(-12);
  // document.getElementById('account_email').textContent = slicedEmail;
  // document.getElementById('account_email').setAttribute('data-original-value', accountEmail);
 
       
     })
     .catch(error => {
       console.error('Error fetching courses:', error);
       // Handle the error and maybe redirect to the login page
     });
 });



document.addEventListener('DOMContentLoaded', function () {
    const updateBtn = document.getElementById('update-details-btn');
    const modal = document.getElementById('update-modal');
    const closeModal = document.getElementById('close-modal');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    // Open modal
    updateBtn.addEventListener('click', function () {
        modal.style.display = 'flex'; // Show modal
    });

    // Close modal
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none'; // Hide modal
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function (e) {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Toggle sidebar on smaller screens
    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('show'); // Toggle sidebar visibility
        menuToggle.textContent = sidebar.classList.contains('show') ? '✕' : '☰'; // Change icon
    });
});

function showLoadingSpinner() {
  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.classList.add('active');
}

function hideLoadingSpinner() {
  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.classList.remove('active');
}



    async function getDietRecommendation() {
   
    const conditions = document.getElementById('conditions').value;
    showLoadingSpinner();// let the user have active experience
      if (!conditions) {
        alert('Please enter the conditions.');
        hideLoadingSpinner(); //removing the spinner after the server response
        return;
      }
      
      try {
        
        const response = await fetch('http://localhost:5000/api/diet-recommendation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ conditions })
        });

        const data = await response.json();
        hideLoadingSpinner();
        if (response.ok) {
          document.getElementById('result').innerText = `Recommendation: ${data.recommendation}`;
        } else {
          document.getElementById('result').innerText = `Error: ${data.error}`;
        }
      } catch (error) {
        console.error(error);
        document.getElementById('result').innerText = 'Error fetching diet recommendation.';
      }
    }

 // Handling user logout
const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', async () => {
  // Confirming if user realy wants to logout
  const confirmLogout = window.confirm('Are you sure you want to logout?');

  if (confirmLogout) {
    // If the user confirms, make a request to the logout route on the server
    const response = await fetch('/logout', { method: 'GET' });

    if (response.ok) {
      // If the logout was successful, redirect the user to the login page
      window.location.href = '/userlogin';
    } else {
      // Handle any errors that occurred during logout
      console.error('Error during logout:', response.statusText);
      // Displaying any error message
    }
  }
  // Handling incase the user cancels
});



// Get references to elements
const getRecommendationBtn = document.getElementById("getRecommendationBtn");
const floatingCard = document.getElementById("floatingCard");
const closeBtn = document.getElementById("closeBtn");

// Show floating card when the "Get recommendation" button is clicked
getRecommendationBtn.addEventListener("click", () => {
  floatingCard.style.display = "block";
  setTimeout(() => {
    floatingCard.style.opacity = 1; // Fade in after animation
  }, 200);
});

// Close floating card when the "Close" button is clicked
closeBtn.addEventListener("click", () => {
  floatingCard.style.opacity = 0; // Fade out
  setTimeout(() => {
    floatingCard.style.display = "none"; // Hide after fade out
  }, 300); // Match fade-out duration
});


// // Get the dropdown menu
// const dropdown = document.getElementById("registration-dropdown");

// // Ensure dropdown exists
// if (dropdown) {
//   dropdown.addEventListener("click", async (event) => {
//     // Check if the clicked element is a link
//     if (event.target.tagName === "A") {
//       event.preventDefault(); // Prevent default navigation behavior

//       const selectedCourse = event.target.dataset.course; // Get the course name
//       console.log("Selected course:", selectedCourse); // Debugging log

//       try {
//         // Send a request to check registration
//         const response = await fetch("/check-registration", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ course: selectedCourse }),
//         });

//         const data = await response.json();
//         console.log("Server response:", data); // Debugging log

//         if (data.isRegistered === false) {
//           window.location.href = '/courseregistration';          // console.log("User not registered. Show popup.");
//           // const popup = document.getElementById("registration-card");
//           if (popup) popup.classList.remove("hidden");
//         } else {
//           console.log("User registered. Redirect to classes page.");
//           window.location.href = `/classes/${encodeURIComponent(selectedCourse)}`;
//         }
//       } catch (error) {
//         console.error("Error checking registration:", error);
//       }
//     }
//   });
// } else {
//   console.error("Dropdown menu not found!");
// }

// // Ensure dropdown exists
// if (dropdown) {
//   dropdown.addEventListener("click", async (event) => {
//     // Check if the clicked element is a link
//     if (event.target.tagName === "A") {
//       event.preventDefault(); // Prevent default navigation behavior

//       const selectedCourse = event.target.dataset.course; // Get the course name
//       console.log("Selected course:", selectedCourse); // Debugging log

//       try {
//         // Send a request to check registration
//         const response = await fetch("/check-registration", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ course: selectedCourse }),
//         });

//         const data = await response.json();
//         console.log("Server response:", data); // Debugging log

//         if (data.isRegistered === false) {
//           // Redirect to the courseregistration page with the course as a query parameter
//           window.location.href = `/courseregistration?course=${encodeURIComponent(selectedCourse)}`;
//         } else {
//           console.log("User registered. Redirect to classes page.");
//           window.location.href = `/classes/${encodeURIComponent(selectedCourse)}`;
//         }
//       } catch (error) {
//         console.error("Error checking registration:", error);
//       }
//     }
//   });
// } else {
//   console.error("Dropdown menu not found!");
// }


