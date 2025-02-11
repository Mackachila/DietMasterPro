// togglecontactsection

document.getElementById("chatButton").addEventListener("click", function() {
    document.getElementById("chatWindow").style.display = "block";
    document.getElementById("chatButton").style.display = "none";
});

document.getElementById("closeChat").addEventListener("click", function() {
    document.getElementById("chatWindow").style.display = "none";
    document.getElementById("chatButton").style.display = "block";
});

document.getElementById("sendChat").addEventListener("click", function() {
    const chatBody = document.querySelector(".chat-body");
    const chatInput = document.getElementById("chatInput");
    const message = chatInput.value;

    if (message.trim() !== "") {
        const userMessage = createMessageElement("right", message);
        chatBody.appendChild(userMessage);
        chatInput.value = "";

        const typingIndicator = createTypingIndicator();
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;

        setTimeout(function() {
            chatBody.removeChild(typingIndicator);

            const botMessage = createMessageElement("left", getBotReply(message));
            chatBody.appendChild(botMessage);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 3000);
    }
});

function createMessageElement(position, message) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("chat-message", position);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash-alt", "delete-icon");
    deleteIcon.addEventListener("click", function() {
        showDeleteConfirmation(messageContainer);
    });

    const messageBubble = document.createElement("div");
    messageBubble.classList.add("chat-bubble");
    messageBubble.innerText = message;

    messageContainer.appendChild(deleteIcon);
    messageContainer.appendChild(messageBubble);

    return messageContainer;
}

function createTypingIndicator() {
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("chat-message", "left");
    typingIndicator.innerHTML = `<div class="chat-bubble typing-indicator">
                                    <span></span><span></span><span></span>
                                 </div>`;
    return typingIndicator;
}

function showDeleteConfirmation(messageElement) {
    const chatBody = document.querySelector(".chat-body");

    const confirmationOverlay = document.createElement("div");
    confirmationOverlay.classList.add("confirmation-overlay");

    const confirmationBox = document.createElement("div");
    confirmationBox.classList.add("confirmation-box");
    confirmationBox.innerHTML = `
        <p>Are you sure you want to delete this message?</p>
        <button id="confirmDelete">Delete</button>
        <button id="cancelDelete">Cancel</button>
    `;

    confirmationOverlay.appendChild(confirmationBox);
    chatBody.appendChild(confirmationOverlay);

    document.getElementById("confirmDelete").addEventListener("click", function() {
        chatBody.removeChild(messageElement);
        chatBody.removeChild(confirmationOverlay);
    });

    document.getElementById("cancelDelete").addEventListener("click", function() {
        chatBody.removeChild(confirmationOverlay);
    });
}

// Function to generate bot replies based on user input
function getBotReply(message) {
    const lowerCaseMessage = message.toLowerCase();
    let reply = "Am so sorry but I cannot assist you with that right now. Please talk to Jared Mackachila through this number to get assistance. 0704684936";

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("helo")  || lowerCaseMessage.includes("hey")) {
        reply = "Hello! How can I assist you today?";
    } else if (lowerCaseMessage.includes("who") || lowerCaseMessage.includes("jared") || lowerCaseMessage.includes("mackachila") || lowerCaseMessage.includes("odhiambo") || lowerCaseMessage.includes("tell")) {
        reply = "Jared Mackachila (Official name: Jared Odhiambo) is a Kenyan experienced programmer and a web developer based in Nairobi Kenya. Jared is Computer science degree holder who is very passionate about technology. ";
    }
    else if (lowerCaseMessage.includes("assist") || lowerCaseMessage.includes("help") || lowerCaseMessage.includes("question") || lowerCaseMessage.includes("quiz")) {
        reply = "I would be so glad to assist you. Please tell me about it.";
    }
    else if (lowerCaseMessage.includes("other")) {
        reply = "Other than being a programmer and a web developer, Jared also deals with so many other things like, Electronics business, Computer training in different Universities and Colleges, Mr. Jared also owns a computer College in Nairobi Kenya. To know more about Jared, Please contact him directly. 0704684936";
    }
    else if (lowerCaseMessage.includes("project") || lowerCaseMessage.includes("github")|| lowerCaseMessage.includes("linkedin")) {
        reply = "Mr. Jared has worked on a number of website projects and many systems that help in solving real problems today. You can check on some of his projects in his GitHub and Linkedin accounts. To get these links, please check on the profile section on the left side of the screen on desktop or laptop or on the upper right section on a mobile phone";
    }
    else if (lowerCaseMessage.includes("age") || lowerCaseMessage.includes("home") || lowerCaseMessage.includes("tribe") || lowerCaseMessage.includes("language") || lowerCaseMessage.includes("born")) {
        reply = "Jared Mackachila was born in 1999 in Migori county Kenya. Mr. Jared is a Luo programmer from Suna West Migori County Kenya. He has worked on a number of projects.";
    }
    else if (lowerCaseMessage.includes("contact") || lowerCaseMessage.includes("call") || lowerCaseMessage.includes("reach")) {
        reply = "You can easily contact me via my direct line through WhatsApp of Direct call: 0704684936. Or via my E-mail: achilajared@gmail.com. Please not that email messages can take a while to be replied. Thank you.";
    }
    else if (lowerCaseMessage.includes("web") || lowerCaseMessage.includes("design")) {
        reply = "We charge differently for Web design. 1st we have static web design and dynamic web design. For static, we charge affordable price of KES. 20,000. For dynamic we charge KES. 60,000. If you have any more questions about web design and charges, please reach out to us: 0719328679";
    }
    else if (lowerCaseMessage.includes("pay")) {
        reply = "Our Fees payment is allowed in a maximum of 3 installments. For more information about how and where to pay the fees, Please contact us throgh: 0719328679. Let me Know if you need any more assistance.";
    }
    else if (lowerCaseMessage.includes("course")) {
        reply = "We offer a wide range of courses including Web Development, Data Science, Networking, and more.";
    } else if (lowerCaseMessage.includes("location")) {
        reply = "We are located at Ongata Rongai, Nairobi, Kenya. Would you like directions?";
    }
    else if (lowerCaseMessage.includes("know") || lowerCaseMessage.includes("more")) {
        reply = "Xplore computer college is a registered college found in Ongata-Rongai. Nairobi Kenya. We deal with veriety of courses and cyber services. Is there any specific thing you would like to know about us?";
    }
    else if (lowerCaseMessage.includes("name")) {
        reply = "Am not sure about your name but I guess you are someone who is interested in learning new things. Do you have any question about Xplore";
    }
    else if (lowerCaseMessage.includes("yes") || lowerCaseMessage.includes("sure")) {
        reply = "Great. Share the question with me and i would be glad to assist you.";
    }
    else if (lowerCaseMessage.includes("no")) {
        reply = "Is Ok. Thank you for your time. Please don't hesitate to let me know if you have any question.";
    }
    else if (lowerCaseMessage.includes("thank") || lowerCaseMessage.includes("ok")) {
        reply = "You're welcome! If you have any more questions, feel free to ask.";
    }

    return reply;
}

document.querySelector('.footer-search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const query = document.querySelector('.footer-search-input').value.trim().toLowerCase();

  if (query) {
    // Perform the search operation (e.g., redirect to a search results page or filter content)
    console.log(`Searching for: ${query}`);
    alert(`Searching for: ${query}`);
  } else {
    alert('Please enter a search term.');
  }
});

document.getElementById("chatInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission (if any)
        document.getElementById("sendChat").click(); // Trigger the send button click
    }
});


// Select the close button inside the dashboard
const closeDashboard = document.getElementById('closeDashboard');
const toggleskillssection = document.getElementById('toggleskillssection');
const toggleaboutsection = document.getElementById('toggleaboutsection');
// const togglecontactsection = document.getElementById('togglecontactsection');
const toggleprojectsection = document.getElementById('toggleprojectsection');



// Toggle dashboard for smaller screens only
toggleDashboard.addEventListener('click', () => {
    dashboard.classList.toggle('show'); // Toggle 'show' class to slide in/out
    overlay.classList.toggle('show');
    toggleDashboard.textContent = dashboard.classList.contains('show') ? 'X' : '☰';
});


// Close dashboard when clicking the internal close button or overlay
closeDashboard.addEventListener('click', () => {
    dashboard.classList.remove('show');
    overlay.classList.remove('show');
    toggleDashboard.textContent = '☰';
});


overlay.addEventListener('click', () => {
    dashboard.classList.remove('show'); // Hide dashboard on overlay click
    overlay.classList.remove('show');
    toggleDashboard.textContent = '☰';
});

toggleprojectsection.addEventListener('click', () => {
    dashboard.classList.remove('show');
    overlay.classList.remove('show');
    toggleDashboard.textContent = '☰';
});

// togglecontactsection.addEventListener('click', () => {
//     dashboard.classList.remove('show');
//     overlay.classList.remove('show');
//     toggleDashboard.textContent = '☰';
// });

toggleaboutsection.addEventListener('click', () => {
    dashboard.classList.remove('show');
    overlay.classList.remove('show');
    toggleDashboard.textContent = '☰';
});

toggleskillssection.addEventListener('click', () => {
    dashboard.classList.remove('show');
    overlay.classList.remove('show');
    toggleDashboard.textContent = '☰';
});


document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".advanced-skill-card");

    function revealCards() {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                card.classList.add("in-viewport");
            }
        });
    }

    window.addEventListener("scroll", revealCards);
    revealCards(); // Run on page load in case some cards are already in view
});

function openLightbox(image) {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = image.src; // Set the lightbox image to the clicked image source
    lightbox.style.display = 'block'; // Show the lightbox
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none'; // Hide the lightbox
}

// Function to handle toggle for each section
function setupToggle(buttonId, contentId) {
    const toggleButton = document.getElementById(buttonId);
    const contentSection = document.getElementById(contentId);

    toggleButton.addEventListener('click', () => {
        contentSection.classList.toggle('show'); // Show/hide content
        toggleButton.classList.toggle('active'); // Rotate arrow
    });
}

// // Set up toggles for each section tutionpayment
// setupToggle('toggleSkills', 'skillsContent');
// setupToggle('toggleContact', 'contactContent');
// setupToggle('toggleEmail', 'emailContent');
// setupToggle('toggleAbilities', 'abilitiesContent');
// setupToggle('togglelinkedin', 'linkedinContent');
// setupToggle('togglegithub', 'githubContent');
// setupToggle('toggleServices', 'servicesContent');


window.addEventListener('scroll', function() {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollTop = window.scrollY; // Distance scrolled from the top
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / documentHeight) * 100;
    
    scrollProgress.style.width = scrollPercentage + '%';
  });
  
  const thumbnailImage = document.getElementById('thumbnailImage');
  const popupOverlay = document.getElementById('popupOverlay');
  const popupCloseBtn = document.getElementById('popupCloseBtn');

  // Show overlay when image is clicked
  thumbnailImage.addEventListener('click', () => {
    popupOverlay.style.display = 'block';
  });

  // Hide overlay when close button is clicked
  popupCloseBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
  });

  // Hide overlay when clicking outside the image
  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = 'none';
    }
  });


  // Set up the IntersectionObserver to detect when the image enters the viewport
document.addEventListener("DOMContentLoaded", function() {
  const images = document.querySelectorAll('.about-us-image');

  const observerOptions = {
    root: null, // observe relative to the viewport
    threshold: 0.1 // trigger when 10% of the image is in the viewport
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing after it has appeared
      }
    });
  }, observerOptions);

  // Observe each image
  images.forEach(image => {
    observer.observe(image);
  });
});


// Get the button
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Listen for scroll events
window.onscroll = function() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    // Show the button when scrolled down 100px
    scrollToTopBtn.style.display = 'block';
  } else {
    // Hide the button when at the top
    scrollToTopBtn.style.display = 'none';
  }
};

// Scroll to the top when the button is clicked
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Smooth scrolling
  });
}


