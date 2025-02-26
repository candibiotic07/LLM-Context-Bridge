function copyConversation() {
  const messages = Array.from(document.querySelectorAll(
    '[class*="message"], [role="assistant"], [role="user"], .message-container, .chat-message, ' +
    '.chat-turn, .chat-entry, .chat-line, [data-message], .conversation-item'
  ));
  
  // Add context header
  let conversation = 'This is context from a previous LLM conversation, use this to gain context and continue the conversation.\n';
  
  let lastRole = null;
  
  messages.forEach(message => {
    const isAssistant = 
      message.getAttribute('role') === 'assistant' ||
      message.classList.contains('assistant') || 
      message.classList.contains('bot') || 
      message.classList.contains('ai') ||
      message.querySelector('[role="assistant"], .assistant, .bot, .ai, .claude, .chatgpt, .gpt, .bard') ||
      (message.innerText && message.innerText.toLowerCase().includes('assistant:'));
    
    const isUser = 
      message.getAttribute('role') === 'user' ||
      message.classList.contains('user') || 
      message.classList.contains('human') ||
      message.querySelector('[role="user"], .user, .human') ||
      (message.innerText && message.innerText.toLowerCase().includes('user:'));
    let text = message.innerText || '';
    text = text.replace(/^(User|Assistant|Human|AI|Bot|LLM):\s*/i, '');
    text = text.replace(/\n{3,}/g, '\n\n').trim();
    
    if (!text) return;
    
    let currentRole = null;
    if (isAssistant) currentRole = 'LLM'; // Changed from Assistant to LLM
    else if (isUser) currentRole = 'User';
    
    if (currentRole) {
      // Always prefix with role for clarity
      conversation += `${currentRole}: ${text}\n\n`;
      lastRole = currentRole;
    } else {
      // Add generic message for non-identified roles
      conversation += `${text}\n\n`;
      lastRole = null;
    }
  });
  // Add closing context reminder
  conversation += '\n[End of previous LLM conversation context]';
  
  const textarea = document.createElement('textarea');
  textarea.value = conversation.trim();
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showNotification('✅ Context copied!');
    } else {
      showNotification('❌ Failed to copy - please try again');
    }
  } catch (err) {
    console.error('Copy failed:', err);
    showNotification('❌ Error copying conversation context');
  }
  document.body.removeChild(textarea);
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 5px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s ease-in-out;
  `;
  
  document.body.appendChild(notification);
  
  // Fade out effect
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 1700);
}

// Initiate copy when script runs
copyConversation();