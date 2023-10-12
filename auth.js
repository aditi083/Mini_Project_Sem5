// auth.js (an ES6 module)

// Function to retrieve the username from the session
export async function getUsernameFromSession() {
    try {
      const response = await fetch('/login', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.username;
      } else {
        console.error('Failed to retrieve username:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
  