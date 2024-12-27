export const showNotification = (message: string) => {
  // Basic notification
  console.log(message);
  
  // You can enhance this with a toast/popup system later
  const notification = document.createElement('div');
  notification.className = 'game-notification';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}; 