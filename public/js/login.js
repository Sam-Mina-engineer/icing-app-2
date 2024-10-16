document.querySelector('.login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (response.ok) {
          document.location.replace('/dashboard'); // Redirect to dashboard after successful login
        } else {
          alert('Failed to log in. Please check your credentials.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });
  