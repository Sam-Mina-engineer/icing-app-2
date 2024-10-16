document.addEventListener('DOMContentLoaded', () => {
  // Get all employee dropdown items

  const employeeItems = document.querySelectorAll('.dropdown-item');
  const employeeListButton = document.getElementById('employee-list');
  const employeeIdInput = document.getElementById('employee-id');

  employeeItems.forEach(item => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      // Get the employee name and ID from the clicked item

      const employeeName = item.textContent.trim();
      const employeeId = item.getAttribute('data-id');

      // Update the button text to show the selected employee

      employeeListButton.textContent = employeeName;

      // Set the hidden input value to the selected employee ID

      employeeIdInput.value = employeeId;

      // Add a console log for debugging

      console.log(`Selected Employee: ${employeeName}, ID: ${employeeId}`);
    });
  });

  // Handle form submission to check if all required fields are filled
  
  const form = document.getElementById('new-order-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const item_ordered = document.querySelector('#item-ordered').value.trim();
    const customer_name = document.querySelector('#customer-name').value.trim();
    const pickup_date = document.querySelector('#pickup-date').value.trim();
    const details = document.querySelector('#details').value.trim();
    const employee_id = employeeIdInput.value;

    if (item_ordered && customer_name && pickup_date && employee_id) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          body: JSON.stringify({
            customer_name,
            item_ordered,
            pickup_date,
            details,
            employee_id
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          document.location.replace('/dashboard');
        } else {
          alert('Failed to create order.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Please fill out all required fields.');
    }
  });
});

  // Handle delete button click event

  document.querySelectorAll('.delete-order').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const orderId = event.target.getAttribute('data-id');
      
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          document.location.replace('/dashboard'); // Refresh the page to reflect the changes
        } else {
          alert('Failed to delete order.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });

  // Handle logout button click
  
  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/login'); // Redirect to login page
      } else {
        alert('Failed to logout.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
