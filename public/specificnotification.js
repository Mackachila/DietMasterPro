// mark.js

document.addEventListener('DOMContentLoaded', (event) => {
    const sendSpecificButton = document.getElementById('sendSpecificButton');
  
    sendSpecificButton.addEventListener('click', () => {
      const username = document.getElementById('specificUsernameInput').value.trim();
      const message = document.getElementById('specificMessageInput').value.trim();
  
      if (username && message) {
        validateUsername(username, (isValid) => {
          if (isValid) {
            sendSpecificNotification(username, message);
          } else {
            alert('Username not found in the database.');
          }
        });
      } else {
        alert('Both username and message are required.');
      }
    });
  });
  
  function validateUsername(username, callback) {
    fetch(`/validateUsername?username=${encodeURIComponent(username)}`)
      .then(response => response.json())
      .then(data => {
        callback(data.exists);
      })
      .catch(error => console.error('Error validating username:', error));
  }
  
  function sendSpecificNotification(username, message) {
    const data = { username, message };
    
    fetch('/sendSpecificNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Notification sent successfully.');
        updateNotificationIcon();
      } else {
        alert('Failed to send notification.');
      }
    })
    .catch(error => console.error('Error sending notification:', error));
 }

document.addEventListener('DOMContentLoaded', () => {
  const usernameElement = document.getElementById('username-display');
  const notificationIcon = document.querySelector('.notification-icon');
  const notificationsContainer = document.querySelector('.notifications2-container');
  const notificationsBody = document.querySelector('.notifications-body');

  if (usernameElement) {
      const observer = new MutationObserver(() => {
          const username = usernameElement.textContent.trim();
          if (username) {
              observer.disconnect(); // Stop observing once the username is found

              // Fetch unread notifications count on page load
              fetch(`/unreadNotificationsCount?username=${encodeURIComponent(username)}`)
                  .then(response => response.json())
                  .then(data => {
                      if (data.success) {
                          document.querySelector('.notification-count').textContent = data.unreadCount;
                      }
                  })
                  .catch(error => console.error('Error fetching unread notifications count:', error));

              // Show notifications dropdown when the notification icon is clicked
              notificationIcon.addEventListener('click', () => {
                  notificationsContainer.classList.toggle('visible');

                  // Fetch and display notifications
                  if (notificationsContainer.classList.contains('visible')) {
                      fetch(`/getNotifications?username=${encodeURIComponent(username)}`)
                          .then(response => response.json())
                          .then(data => {
                              if (data.success) {
                                  notificationsBody.innerHTML = ''; // Clear previous notifications
                                  data.notifications.forEach(notification => {
                                      const notificationElement = document.createElement('div');
                                      notificationElement.className = 'notification-item';

                                      // Apply styles based on the is_read status from the database
                                      if (notification.is_read === 1) {
                                          notificationElement.classList.add('read');
                                      } else {
                                          notificationElement.classList.add('unread');
                                      }

                                      // Container for message and timestamp
                                      const contentContainer = document.createElement('div');
                                      contentContainer.className = 'notification-content';

                                      // Format the notification content
                                      const messageContent = document.createElement('p');
                                      messageContent.textContent = notification.message;

                                      // Format the timestamp
                                      const timestampElement = document.createElement('p');
                                      timestampElement.className = 'timestamp';
                                      const timestamp = new Date(notification.timestamp);
                                      timestampElement.textContent = timestamp.toLocaleString(); // Display date and time

                                      // Append elements to the notification container
                                      contentContainer.appendChild(messageContent);
                                      contentContainer.appendChild(timestampElement);
                                      notificationElement.appendChild(contentContainer);

                                      // Add a "Mark as Read" button only if the notification is unread
                                      if (notification.is_read === 0) {
                                          const markAsReadButton = document.createElement('button');
                                          markAsReadButton.textContent = 'Read';
                                          markAsReadButton.className = 'mark-as-read-btn';
                                          markAsReadButton.addEventListener('click', () => {
                                              fetch('/markAsRead', {
                                                  method: 'POST',
                                                  headers: {
                                                      'Content-Type': 'application/json',
                                                  },
                                                  body: JSON.stringify({ notificationId: notification.id }),
                                              })
                                              .then(response => response.json())
                                              .then(data => {
                                                  if (data.success) {
                                                      notificationElement.classList.remove('unread');
                                                      notificationElement.classList.add('read');
                                                      updateUnreadCount(username); // Update the unread count
                                                      markAsReadButton.remove(); // Remove the button after marking as read
                                                  }
                                              })
                                              .catch(error => console.error('Error marking notification as read:', error));
                                          });
                                          notificationElement.appendChild(markAsReadButton);
                                      }

                                      notificationsBody.appendChild(notificationElement);
                                  });
                              }
                          })
                          .catch(error => console.error('Error fetching notifications:', error));
                  }
              });

              // Close the dropdown when clicking outside of it
              document.addEventListener('click', (event) => {
                  if (!notificationsContainer.contains(event.target) && !notificationIcon.contains(event.target)) {
                      notificationsContainer.classList.remove('visible');
                  }
              });
          }
      });

      observer.observe(usernameElement, { childList: true, subtree: true });
  } else {
      console.error('Username display element not found');
  }

  // Helper function to update unread notifications count
  function updateUnreadCount(username) {
      fetch(`/unreadNotificationsCount?username=${encodeURIComponent(username)}`)
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  document.querySelector('.notification-count').textContent = data.unreadCount;
              }
          })
          .catch(error => console.error('Error updating unread notifications count:', error));
  }
});
