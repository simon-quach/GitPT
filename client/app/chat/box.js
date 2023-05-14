const chatbox = document.getElementById('chatbox');
const messageInput = document.getElementById('message-input');

messageInput.addEventListener('keyup', function(event) {
  // Check if Enter key was pressed
  if (event.key === 'Enter') {
    // Get the user's message from the input field
    const message = messageInput.value;
    
    // Create a new chat message element
    const chatMessage = document.createElement('div');
    chatMessage.innerText = message;
    
    // Add the message to the chatbox
    chatbox.insertBefore(chatMessage, chatbox.firstChild);
    
    // Create a new message element to display in the gray box
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    
    // Add the message element to the gray box
    //this scuffy
    const grayBox = document.querySelector('.bg-gray-500');
    grayBox.appendChild(messageElement);
    
    // Clear the input field
    messageInput.value = '';
  }
});
