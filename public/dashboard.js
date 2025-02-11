// /premiumUpgrade-form-diet-floating-card-button-button favoritemealsContent-form allergiesContent-error tutionpayment
document.addEventListener('DOMContentLoaded', function () {
  //*- console.log('Fetching user details');
   // Fetch the username from the session
   fetch('/get-user')
     .then(response => response.json())
     .then(data => {
  //     console.log('Fetched username from server:', data.username, data.currentAccount, data.accountBallance, data.accountPhonenumber, data.accountEmail, data.invitationLink );
const username = data.username;
const username2 = data.username.split(" ")[0];
const email = data.email;
const contact = data.contact;

 
       if (email) {

         // Displaying the user details on his account page
// document.getElementById('favoritemealsContent').textContent = ` ${registere_courses}`;
 document.getElementById('dashboard-heading').textContent = ` ${username}`;
// document.getElementById('registee').textContent = ` ${username}`;
document.getElementById('timingusername').textContent = ` ${username2}`;
//    document.getElementById('user2').textContent = ` ${username}`;
 document.getElementById('contactContent').textContent = `Phone: ${contact}`;
 document.getElementById('emailContent').textContent = `Email: ${email}`;
 document.getElementById('contactContentt').textContent = `Phone: ${contact}`;
 document.getElementById('emailContentt').textContent = `Email: ${email}`;

       } else {
         // Redirect to the login page if the username is not available and not already on the login page
         if (window.location.pathname !== '/login') {
           window.location.href = '/userlogin';
         }
       }
     })
     .catch(error => {
       console.error('Error fetching username:', error);
       // Handle the error and maybe redirect to the login page showLoadingSpinner()
     });
 });

/**
* Function to display a popup with course progress analysis
* @param {string} courseName - The name of the course
*/
function showProgressPopup(courseName) {
// Create overlay
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
overlay.style.zIndex = '9999';

// Create popup container
const popup = document.createElement('div');
popup.style.position = 'absolute';
popup.style.top = '50%';
popup.style.left = '50%';
popup.style.transform = 'translate(-50%, -50%)';
popup.style.padding = '5px';
popup.style.backgroundColor = 'rgb(7, 57, 57)';
popup.style.color = 'white';
popup.style.borderRadius = '8px';
popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
popup.style.width = '80%';
popup.style.textAlign = 'center';

// Add course title
const title = document.createElement('h4');
title.textContent = `${courseName} Progress`;
title.style.marginBottom = '10px';

// Placeholder for progress analysis
const chart = document.createElement('div');
chart.textContent = 'Loading progress analysis...';
chart.style.height = '150px';

// Fetch and display progress analysis from existing backend
fetch(`/get-course-progress?course=${encodeURIComponent(courseName)}`)
  .then(response => response.json())
  .then(progressData => {
    // Update the popup content dynamically
    // chart.textContent = `Progress: ${progressData.progress}%`;
    chart.textContent = `You need to join ${courseName} class to show Progress`;
  })
  .catch(error => {
    console.error('Error fetching progress data:', error);
    chart.textContent = 'Failed to load progress analysis.';
  });

// Close button
const closeButton = document.createElement('button');
closeButton.textContent = 'X';
closeButton.style.marginTop = '5px';
closeButton.style.padding = '10px 20px';
closeButton.style.backgroundColor = 'transparent';
closeButton.style.border = 'none';
closeButton.style.color = 'white';
closeButton.style.borderRadius = '5px';
closeButton.style.cursor = 'pointer';
closeButton.addEventListener('click', () => {
  document.body.removeChild(overlay);
});

// Append elements to popup
popup.appendChild(closeButton);
popup.appendChild(title);
popup.appendChild(chart);


// Append popup to overlay
overlay.appendChild(popup);

// Append overlay to body
document.body.appendChild(overlay);
}


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
      sidebar.classList.toggle('show'); // Toggle sidebar visibility  icon.src = 'tick.png'; 
      menuToggle.textContent = sidebar.classList.contains('show') ? '✕' : '☰'; // Change icon
  });
});

// function showLoadingSpinner() {
// const loadingOverlay = document.getElementById("loading-overlay");
// loadingOverlay.classList.add('active');
// }

// function hideLoadingSpinner() {
// const loadingOverlay = document.getElementById("loading-overlay");
// loadingOverlay.classList.remove('active');
// }



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


// // Function to handle toggle for each section
// function setupToggle(buttonId, contentId) {
// const toggleButton = document.getElementById(buttonId);
// const contentSection = document.getElementById(contentId);

// toggleButton.addEventListener('click', () => {
//     contentSection.classList.toggle('show'); // Show/hide content
//     toggleButton.classList.toggle('active'); // Rotate arrow
// });
// }

// // Set up toggles for each section
// setupToggle('toggleSkills', 'favoritemealsContent');
// setupToggle('toggleContact', 'contactContent');
// setupToggle('toggleEmail', 'emailContent');
// setupToggle('togglePayments', 'tutionpayment');
// setupToggle('toggleCleardata', 'dataclearing');
// setupToggle('togglePremium', 'premiumUpgrade');
// setupToggle('toggleAbilities', 'abilitiesContent');
// setupToggle('togglelinkedin', 'allergiesContent');
// setupToggle('togglegithub', 'healthconditionContent');
// setupToggle('toggleServices', 'servicesContent');
// setupToggle('toggleCompletedservices', 'ageContent');

// document.addEventListener("DOMContentLoaded", function () {
//   // Handle toggles in both dashboard and navbar
//   document.querySelectorAll(".section-toggle, .section-togglee").forEach(button => {
//       button.addEventListener("click", function () {
//           const targetId = this.getAttribute("data-target");
//           if (targetId) {
//               const targetContent = document.getElementById(targetId);
//               if (targetContent) {
//                   // Toggle visibility
//                   targetContent.classList.toggle("visible");
                  
//                   // Rotate the arrow icon inside the button
//                   const arrow = this.querySelector(".arrow i");
//                   if (arrow) {
//                       arrow.classList.toggle("fa-chevron-down");
//                       arrow.classList.toggle("fa-chevron-up");
//                   }
//               }
//           }
//       });
//   });
// });


// document.addEventListener("DOMContentLoaded", function () {
//   // Load navbar.html dynamically
//   fetch("navbar.html")
//       .then(response => response.text())
//       .then(html => {
//           document.getElementById("navbar-container").innerHTML = html; // Ensure this ID is correct
          
//           // Now apply event listeners for section toggles
//           setupSectionToggling();
//       })
//       .catch(error => console.error("Error loading navbar:", error));
// });

// // Function to handle section toggling (applies event listeners after navbar is loaded)
// function setupSectionToggling() {
//   document.querySelectorAll(".section-toggle, .section-togglee").forEach(button => {
//       button.addEventListener("click", function () {
//           const targetId = this.getAttribute("data-target");
//           if (targetId) {
//               const targetContent = document.getElementById(targetId);
//               if (targetContent) {
//                   // Toggle visibility
//                   targetContent.classList.toggle("visible");

//                   // Rotate the arrow icon inside the button
//                   const arrow = this.querySelector(".arrow i");
//                   if (arrow) {
//                       arrow.classList.toggle("fa-chevron-down");
//                       arrow.classList.toggle("fa-chevron-up");
//                   }
//               }
//           }
//       });
//   });
// }


document.addEventListener("DOMContentLoaded", function () {
  // ✅ Apply event listeners to existing sections
  setupSectionToggling();

  // ✅ Load navbar dynamically and apply event listeners to it after loading
  fetch("navbar.html")
      .then(response => response.text())
      .then(html => {
          document.getElementById("navbar-container").innerHTML = html; // Ensure this ID is correct
          setupSectionToggling(); // Apply event listeners to newly loaded content
      })
      .catch(error => console.error("Error loading navbar:", error));
});

// Function to apply event listeners to both existing and dynamically loaded sections
function setupSectionToggling() {
  document.querySelectorAll(".section-toggle, .section-togglee").forEach(button => {
      button.addEventListener("click", function () {
          const targetId = this.getAttribute("data-target");
          if (targetId) {
              const targetContent = document.getElementById(targetId);
              if (targetContent) {
                  // ✅ Toggle visibility
                  targetContent.classList.toggle("visible");

                  // ✅ Rotate the arrow icon inside the button
                  const arrow = this.querySelector(".arrow i");
                  if (arrow) {
                      arrow.classList.toggle("fa-chevron-down");
                      arrow.classList.toggle("fa-chevron-up");
                  }
              }
          }
      });
  });
}








document.getElementById('premiumUpgrade').addEventListener('click', function () {
  document.getElementById('premium-popup').classList.add('visible');
});

document.getElementById('premiumUpgradee').addEventListener('click', function () {
  document.getElementById('premium-popup').classList.add('visible');
});
  
document.getElementById('close-premium-form').addEventListener('click', function () {
  document.getElementById('premium-popup').classList.remove('visible');
});
  
document.getElementById('premium-popup').addEventListener('click', function (e) {
  if (e.target === this) {
      document.getElementById('premium-popup').classList.remove('visible');
  }
});



document.getElementById('premium_type').addEventListener('change', function () {
  const premium_type = document.getElementById('premium_type').value;
  if (premium_type) {
    const subscryption = this.value;
    fetchBalance(subscryption);
  }
});

function fetchBalance(subscryption) {
  const balanceLabel = document.getElementById('balance_label');
  const balanceAmount = document.getElementById('balance_amount');
  
  balanceLabel.style.display = 'none';

  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  document.getElementById('balance_label').appendChild(spinner);

  fetch(`/get-usersubscription?subscryption=${subscryption}`)
    .then(response => response.json())
    .then(data => {
      spinner.remove();
      if (data.error) {
        // alert(data.error);
        displayFloatingCard(data.error, 'error');
      } else {
        
        balanceLabel.style.display = 'block';
        // balanceLabel.textContent = `${subscryption} Subscription is KES: `;
        balanceAmount.textContent = `${subscryption} Subscription is KES: ${data.ballance}`;
      }
    })
    .catch(error => {
      spinner.remove();
      alert('Error fetching data. Please try again.');
      
    });
}



// Handle form submission
document.getElementById('premium-form').addEventListener('submit', function (e) {
  e.preventDefault();

  // Collect form data
  const premium_type = document.getElementById('premium_type').value;

  const premium_mode = document.getElementById('premium_mode').value;
  const balance_amount = document.getElementById('balance_amount').textContent;

  // Redirect to confirmation page with parameters 
  const params = new URLSearchParams({
    premium_type: premium_type,
    premium_mode: premium_mode,
    balance_amount: balance_amount,
    
  });

  window.location.href = `premiumpayment.html?${params.toString()}`;
});

//data deletion


document.getElementById('dataclearing').addEventListener('click', function () {
  document.getElementById('deletion-popup').classList.add('visible');
});

document.getElementById('dataclearingg').addEventListener('click', function () {
  document.getElementById('deletion-popup').classList.add('visible');
});
  
document.getElementById('close-deletion-form').addEventListener('click', function () {
  document.getElementById('deletion-popup').classList.remove('visible');
});
  
document.getElementById('deletion-popup').addEventListener('click', function (e) {
  if (e.target === this) {
      document.getElementById('deletion-popup').classList.remove('visible');
  }
});



// Submit details and send to the server
document.getElementById('data-deletion-button').addEventListener('click', async () => {
    
  // showLoadingSpinner();
  try {
    const response = await fetch('/delete-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
    });

    const data = await response.json();
    if (response.ok) {
    // displayFloatingCard(data.message, 'success');

    // hideLoadingSpinner();
      alert(data.message); // Show success message
    } else {
      // displayFloatingCard(data.message, 'error');
      alert(data.error); // Show error message
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while submitting the details. Please try again later.');
    // displayFloatingCard(data.message, 'error');
  }
  // hideLoadingSpinner();
});
//end of premium payment premiumUpgrade


document.getElementById('tutionpayment').addEventListener('click', function () {
  document.getElementById('payment-popup').classList.add('visible');
});

document.getElementById('tutionpaymentt').addEventListener('click', function () {
  document.getElementById('payment-popup').classList.add('visible');
});

  
document.getElementById('close-payment-form').addEventListener('click', function () {
  document.getElementById('payment-popup').classList.remove('visible');
});
  
document.getElementById('payment-popup').addEventListener('click', function (e) {
  if (e.target === this) {
      document.getElementById('payment-popup').classList.remove('visible');
  }
});

// Show or hide sections and dynamically set the 'required' attribute
document.getElementById('payment_type').addEventListener('change', function () {
  const allergySection = document.getElementById('alergy_list_section');
  const allergyInput = document.getElementById('allergy_list');

  if (this.value === 'yes') {
    allergySection.style.display = 'block';
    allergyInput.setAttribute('required', 'true');
  } else {
    allergySection.style.display = 'none';
    allergyInput.removeAttribute('required');
  }
});

document.getElementById('health_conditions').addEventListener('change', function () {
  const healthSection = document.getElementById('health_list_section');
  const healthInput = document.getElementById('health_list');

  if (this.value === 'yes') {
    healthSection.style.display = 'block';
    healthInput.setAttribute('required', 'true');
  } else {
    healthSection.style.display = 'none';
    healthInput.removeAttribute('required');
  }
});

document.getElementById('payment_mode').addEventListener('change', function () {
  const favoriteSection = document.getElementById('favorite_list_section');
  const favoriteInput = document.getElementById('favorite_list');

  if (this.value === 'yes') {
    favoriteSection.style.display = 'block';
    favoriteInput.setAttribute('required', 'true');
  } else {
    favoriteSection.style.display = 'none';
    favoriteInput.removeAttribute('required');
  }
});

// // Form validation function
// function validateInput(value) {
//   // Regular expression to allow words separated by commas, hyphens, and underscores (no spaces between words)
//   const regex = /^([a-zA-Z0-9-_]+(?:\s*,\s*[a-zA-Z0-9-_]+)*)$/;
//   return regex.test(value);
// }

// // Handle form submission
// document.getElementById('payment-form').addEventListener('submit', function (e) {
//   e.preventDefault();

//   // Collect form data
//   const allergyValue = document.getElementById('payment_type').value === 'yes'
//     ? document.getElementById('allergy_list').value
//     : 'NO';

//   const healthValue = document.getElementById('health_conditions').value === 'yes'
//     ? document.getElementById('health_list').value
//     : 'NO';

//   const favoriteValue = document.getElementById('payment_mode').value === 'yes'
//     ? document.getElementById('favorite_list').value
//     : 'NO';

//   const child_age = document.getElementById('child_age').value;

//   // Validate inputs
//   if ((allergyValue !== 'NO' && !validateInput(allergyValue)) ||
//       (healthValue !== 'NO' && !validateInput(healthValue)) ||
//       (favoriteValue !== 'NO' && !validateInput(favoriteValue))) {
    
//     document.getElementById('data-error').style.display = 'block';

//     document.getElementById('data-error').textContent = 'Separate your words with commas (,) or use hyphens (-) or underscores (_) to join separate words.';
//     return;
//   }

//   document.getElementById('data-error').style.display = 'none';

//     document.getElementById('data-error').textContent = '';
//   // Redirect to confirmation page with parameters 
//   const params = new URLSearchParams({
//     allergies: Array.isArray(allergyValue) ? allergyValue.split(',').map(item => item.trim()).join(',') : allergyValue,
//     health: Array.isArray(healthValue) ? healthValue.split(',').map(item => item.trim()).join(',') : healthValue,
//     favorites: Array.isArray(favoriteValue) ? favoriteValue.split(',').map(item => item.trim()).join(',') : favoriteValue,
//     age: Array.isArray(child_age) ? child_age.join(',') : child_age,
//   });

//   window.location.href = `detailconfirmation.html?${params.toString()}`;
// });


// Form validation function
function validateInput(value) {
  // Regular expression to allow words separated by commas, hyphens, and underscores (no spaces between words)
  const regex = /^([a-zA-Z0-9-_]+(?:\s*,\s*[a-zA-Z0-9-_]+)*)$/;
  return regex.test(value);
}

// Handle form submission
document.getElementById('payment-form').addEventListener('submit', function (e) {
  e.preventDefault();

  // Collect form data
  const allergyValue = document.getElementById('payment_type').value === 'yes'
    ? document.getElementById('allergy_list').value
    : 'NO';

  // Collect selected health conditions as a comma-separated string
  let healthValue = 'NO';
  if (document.getElementById('health_conditions').value === 'yes') {
    const healthConditions = [];
    document.querySelectorAll("input[name='health_condition']:checked").forEach(function (checkbox) {
      healthConditions.push(checkbox.value);
    });
    healthValue = healthConditions.length > 0 ? healthConditions.join(',') : 'NO';
  } else {
    // If "NO" is selected, uncheck all health condition checkboxes
    document.querySelectorAll("input[name='health_condition']").forEach(function (checkbox) {
      checkbox.checked = false;
    });
  }

  const favoriteValue = document.getElementById('payment_mode').value === 'yes'
    ? document.getElementById('favorite_list').value
    : 'NO';

  const child_age = document.getElementById('child_age').value;

  // Validate inputs
  if ((allergyValue !== 'NO' && !validateInput(allergyValue)) ||
      (healthValue !== 'NO' && !validateInput(healthValue)) ||
      (favoriteValue !== 'NO' && !validateInput(favoriteValue))) {
    
    document.getElementById('data-error').style.display = 'block';
    document.getElementById('data-error').textContent = 'Separate your words with commas (,) or use hyphens (-) or underscores (_) to join separate words.';
    return;
  }

  document.getElementById('data-error').style.display = 'none';
  document.getElementById('data-error').textContent = '';

  // Redirect to confirmation page with parameters
  const params = new URLSearchParams({
    allergies: Array.isArray(allergyValue) ? allergyValue.split(',').map(item => item.trim()).join(',') : allergyValue,
    health: Array.isArray(healthValue) ? healthValue.split(',').map(item => item.trim()).join(',') : healthValue,
    favorites: Array.isArray(favoriteValue) ? favoriteValue.split(',').map(item => item.trim()).join(',') : favoriteValue,
    age: Array.isArray(child_age) ? child_age.join(',') : child_age,
  });

  window.location.href = `detailconfirmation.html?${params.toString()}`;
});

// Handle health condition selection (update checkbox state)
document.getElementById('health_conditions').addEventListener('change', function () {
  const healthSelection = document.getElementById('health_conditions').value;
  
  // Show health condition list if "yes" is selected, hide if "no"
  if (healthSelection === 'yes') {
    document.getElementById('health_list_section').style.display = 'block';
  } else {
    document.getElementById('health_list_section').style.display = 'none';
    
    // Uncheck all checkboxes when "NO" is selected
    document.querySelectorAll("input[name='health_condition']").forEach(function (checkbox) {
      checkbox.checked = false;
    });
  }
});




document.addEventListener('DOMContentLoaded', async () => {
  const allergiesContent = document.getElementById('allergiesContent');
  const allergiesContentt = document.getElementById('allergiesContentt');
  const favoriteMealsContent = document.getElementById('favoritemealsContent');
  const favoriteMealsContentt = document.getElementById('favoritemealsContentt');
  const healthconditionContent = document.getElementById('healthconditionContent');
  const healthconditionContentt = document.getElementById('healthconditionContentt');
  const ageContent = document.getElementById('ageContent');
  const ageContentt = document.getElementById('ageContentt');

  try {
      // Fetch user data from the server
      const response = await fetch('/get-user-data');
      const data = await response.json();

      // Update allergies section
      if (data.allergies && data.allergies.length > 0) {
          allergiesContent,allergiesContentt.innerHTML = '';
          data.allergies.forEach(allergy => {
              const allergyItem = document.createElement('p');
              allergyItem.style.marginBottom = '15px'; // Optional styling
              allergyItem.style.borderBottom = 'dotted lightseagreen 1pt';
              allergyItem.textContent = allergy;
              allergiesContent.appendChild(allergyItem);

              const allergyItem2 = document.createElement('p');
              allergyItem2.style.marginBottom = '15px'; // Optional styling
              allergyItem2.style.borderBottom = 'dotted lightseagreen 1pt';
              allergyItem2.textContent = allergy;
              allergiesContentt.appendChild(allergyItem2);

              
          });
      } else {
          allergiesContent.innerHTML = '<p>No allergies found.</p>';
          allergiesContentt .innerHTML = '<p>No allergies found.</p>';
      }

      // Update favorite meals section
      if (data.health_conditions && data.health_conditions.length > 0) {
          healthconditionContent, healthconditionContentt.innerHTML = '';
          data.health_conditions.forEach(meal => {
              const healthItem = document.createElement('p');
              healthItem.style.marginBottom = '15px'; // Optional styling
              healthItem.style.borderBottom = 'dotted lightseagreen 1pt';
              healthItem.textContent = meal;
              healthconditionContent.appendChild(healthItem);

              const healthItem2 = document.createElement('p');
              healthItem2.style.marginBottom = '15px'; // Optional styling
              healthItem2.style.borderBottom = 'dotted lightseagreen 1pt';
              healthItem2.textContent = meal;
              healthconditionContentt.appendChild(healthItem2);
          });
      } else {
        healthconditionContent.innerHTML = '<p>No health condition found.</p>';
        healthconditionContentt.innerHTML = '<p>No health condition found.</p>';
      }

      // Update favorite meals section
      if (data.favoriteMeals && data.favoriteMeals.length > 0) {
        favoriteMealsContent, favoriteMealsContentt.innerHTML = '';
        data.favoriteMeals.forEach(meal => {
            const mealItem = document.createElement('p');
            mealItem.style.marginBottom = '15px'; // Optional styling
            mealItem.style.borderBottom = 'dotted lightseagreen 1pt';
            mealItem.textContent = meal;
            favoriteMealsContent.appendChild(mealItem);

            const mealItem2 = document.createElement('p');
            mealItem2.style.marginBottom = '15px'; // Optional styling
            mealItem2.style.borderBottom = 'dotted lightseagreen 1pt';
            mealItem2.textContent = meal;
            favoriteMealsContentt.appendChild(mealItem2);
        });
    } else {
        favoriteMealsContent.innerHTML = '<p>No favorite meals found.</p>';
        favoriteMealsContentt.innerHTML = '<p>No favorite meals found.</p>';
    }

    // Update favorite meals section
    if (data.child_age && data.child_age.length > 0) {
      ageContent, ageContentt.innerHTML = '';
      data.child_age.forEach(meal => {
          const ageItem = document.createElement('p');
          ageItem.style.marginBottom = '15px'; // Optional styling
          ageItem.style.borderBottom = 'dotted lightseagreen 1pt';
          ageItem.textContent = meal;
          ageContent.appendChild(ageItem);

          const ageItem2 = document.createElement('p');
          ageItem2.style.marginBottom = '15px'; // Optional styling
          ageItem2.style.borderBottom = 'dotted lightseagreen 1pt';
          ageItem2.textContent = meal;
          ageContentt.appendChild(ageItem2);
      });
  } else {
    ageContent.innerHTML = '<p>No age Data found.</p>';
    ageContentt.innerHTML = '<p>No age Data found.</p>';
  }

  } catch (error) {
      console.error('Error fetching user data:', error);
      allergiesContent.innerHTML = '<p>Error loading allergies.</p>';
      favoriteMealsContent.innerHTML = '<p>Error loading favorite meals.</p>';
      healthconditionContent.innerHTML = '<p>Error loading Health conditions.</p>';
      ageContent.innerHTML = '<p>Error loading age data.</p>';
  }
});




//recomendations logics
document.addEventListener("DOMContentLoaded", () => {
  const recommendationsSection = document.getElementById("recommendations-section");
  
  // Helper function to create recommendation cards
  const createCard = (mealType, mealName, description, description2, description3) => {
    const card = document.createElement("div");
    card.classList.add("results-card");
    card.innerHTML = `
      <div class="banner"><b style="color: white; font-size: 18px">DietMaster ${mealType} is ready.</b></div><br>
      <h2 style="color: lightseagreen">${mealName} <i class="fas fa-check-circle"></i></h2><br>
      <p>${description}</p><br>

      <span style="color: lightseagreen">Why this meal? <i class="fas fa-notes-medical"></i></span><br>
      <p>${description2}</p><br>
      <span style="color: lightseagreen">Ingredients to prepare this meal <i class="fas fa-thumbs-up"></i></span><br>

      <p>${description3}</p>
    `;
    return card;
  };


// const floatingCard = document.getElementById("recommend-floating-card");
// const floatingCardMessage = document.getElementById("recommend-floating-card-message");
// const closeCardBtn = document.getElementById("close-card-btn");

// // Function to show the floating card
// const showFloatingCard = (message) => {
//   floatingCardMessage.textContent = message;
//   floatingCard.classList.remove("hidden");
// };

// // Function to hide the floating card
// closeCardBtn.addEventListener("click", () => {
//   floatingCard.classList.add("hidden");
// });

const floatingCard = document.getElementById("recommend-floating-card");
const floatingCardMessage = document.getElementById("recommend-floating-card-message");
const closeCardBtn = document.getElementById("close-card-btn");

// Function to show the floating card
const showFloatingCard = (message) => {
  floatingCardMessage.textContent = message;
  
  // Remove hidden class and add the show class to make the card visible
  floatingCard.classList.remove("hidden");
  floatingCard.classList.add("show");
};

// Close button functionality
closeCardBtn.addEventListener("click", () => {
  floatingCard.classList.remove("show");
  floatingCard.classList.add("hidden");
});
  
  // Fetch recommendations from the server
  const loadingOverlay = document.getElementById("loading-overlay");
  const fetchRecommendation = async (mealType) => {
    showLoadingSpinner();
    try {
      const response = await fetch(`/recommend/${mealType}`);
      if (!response.ok) throw new Error("Failed to fetch recommendation.");
      
      const data = await response.json();
      hideLoadingSpinner();
  
      // Debugging log to inspect server response
      console.log("Server Response:", data);
  
      // Clear previous recommendations
      recommendationsSection.innerHTML = "";
  
      // Check for undefined or error messages
      if (!data.mealName || !data.description) {
        // alert(data.message || "No recommendation available. Please update your preferences.");
        // return;
        showFloatingCard(data.message || "No recommendation available. Please update your preferences.");
      return;
      }
  
      // Add new recommendation card
      const card = createCard(data.mealType, data.mealName, data.description, data.description2, data.description3);
      recommendationsSection.appendChild(card);
  
      // Scroll to results
      window.location.href = "#recommendationresults";
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      hideLoadingSpinner();
      alert("An error occurred while fetching recommendations.");
    }
  };
  
  
  // Event listeners for buttons
  document.getElementById("breakfast-button").addEventListener("click", () => {
    fetchRecommendation("breakfast");
  });
  
  document.getElementById("lunch-button").addEventListener("click", () => {
    fetchRecommendation("lunch");
  });
  
  document.getElementById("supper-button").addEventListener("click", () => {
    fetchRecommendation("supper");
  });

  function showLoadingSpinner() {
    loadingOverlay.classList.add('active');
  }
  
  function hideLoadingSpinner() {
    loadingOverlay.classList.remove('active');
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



        function getMealTimeMessage() {
            const now = new Date();
            const hours = now.getHours();
            let message = "";

            if (hours >= 5 && hours < 12) {
                message = "It is Breakfast time! Would you like me to suggest for you some breakfast?";
            } else if (hours >= 12 && hours < 15) {
                message = "It is Lunch time! Would you like me to suggest for you some lunch?";
            } else if (hours >= 15 && hours < 19) {
                message = "It is Dinner time! Would you like me to suggest for you some dinner?";
            } else if (hours >= 19 && hours < 22) {
                message = "It is Supper time! Would you like me to suggest for you some supper?";
            } else {
                message = "It is Sleeping time! Have a good rest!";
            }

            document.getElementById("time-message").textContent = message;
            const formattedDate = now.toDateString(); // "Sat Feb 01 2025"
            const formattedTime = now.toLocaleTimeString(); // "19:34:13"

            document.getElementById("date-today").textContent = `${formattedDate} ${formattedTime}`;
        }

        // Run the function initially
        getMealTimeMessage();

        // Update every second to ensure real-time changes
        setInterval(getMealTimeMessage, 1000);
   

        const userEmail = "user@example.com"; // Replace with actual logged-in user email

// Schedule a meal based on user input
async function scheduleMeals() {
    const date = document.getElementById("mealDate").value;
    const mealType = document.getElementById("mealType").value;
    const mealName = document.getElementById("mealName").value;

    if (!date || !mealType || !mealName) {
        alert("Please fill all fields before scheduling a meal.");
        return;
    }

    const meal = [{ date, meal_type: mealType, meal_name: mealName }];

    const response = await fetch("/schedule-meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meals: meal })
    });

    const data = await response.json();
    alert(data.message);
    fetchMeals(); // Refresh meal list
}

// Fetch and display scheduled meals
async function fetchMeals() {
    const response = await fetch(`/scheduled-meals?email=${userEmail}`);
    const meals = await response.json();

    const mealList = document.getElementById("mealList");
    mealList.innerHTML = "";

    meals.forEach(meal => {
        const li = document.createElement("li");
        li.innerHTML = `${meal.meal_date} - ${meal.meal_type}: ${meal.meal_name} 
                        <button onclick="deleteMeal(${meal.id})">Delete</button>`;
        mealList.appendChild(li);
    });
}

// Delete a meal
async function deleteMeal(mealId) {
    const response = await fetch("/delete-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, meal_id: mealId })
    });

    const data = await response.json();
    alert(data.message);
    fetchMeals(); // Refresh meal list
}

// Load meals when the page loads
fetchMeals();



// Meal Schedule

document.addEventListener("DOMContentLoaded", function () {
  fetchScheduledMeals();

  // Schedule Meal
  document.getElementById("scheduleMealForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      
      let mealType = document.getElementById("mealType").value;
      let mealName = document.getElementById("mealName").value;
      let mealDate = document.getElementById("mealDate").value;

      if (!mealType || !mealName || !mealDate) {
          alert("Please fill all fields!");
          return;
      }

      let response = await fetch("/schedule-meals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ meals: [{ meal_type: mealType, meal_name: mealName, date: mealDate }] })
      });

      let result = await response.json();
      alert(result.message);
      fetchScheduledMeals();
  });
});

// Fetch Scheduled Meals
async function fetchScheduledMeals() {
  let response = await fetch("/scheduled-meals");
  let meals = await response.json();
  let mealList = document.getElementById("mealList");
  mealList.innerHTML = "";

  meals.forEach(meal => {
      let mealItem = document.createElement("li");
      const mealDate = new Date(meal.meal_date).toLocaleDateString();
      mealItem.innerHTML = `${mealDate} - ${meal.meal_type}: ${meal.meal_name} 
          <button onclick="deleteMeal(${meal.id})">Cancel ❌</button>`;
      mealList.appendChild(mealItem);
  });
}

// Delete Meal
async function deleteMeal(mealId) {
  let response = await fetch("/delete-scheduled-meal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meal_id: mealId })
  });

  let result = await response.json();
  alert(result.message);
  fetchScheduledMeals();
}











