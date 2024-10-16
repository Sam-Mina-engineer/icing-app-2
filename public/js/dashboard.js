document.querySelector('#new-order-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const item_ordered = document.querySelector('#item-ordered').value.trim();
  const customer_name = document.querySelector('#customer-name').value.trim();
  const pickup_date = document.querySelector('#pickup-date').value.trim();
  const details = document.querySelector('#details').value.trim();
  const employee_id = document.querySelector('.dropdown-item[data-id].active')?.dataset.id;

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
