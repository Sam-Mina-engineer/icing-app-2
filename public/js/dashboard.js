// Function to show the modal for adding a new order
const showNewOrderModal = () => {
  const modal = new bootstrap.Modal(document.getElementById('formModal'));
  modal.show();
};

// Function to dynamically create an order card for display
const createOrderCard = (order) => {
  return `
    <div class="card mb-3">
      <div class="card-header d-flex justify-content-between">
        <h5>${order.item_ordered}</h5>
        <span class="badge bg-${order.status === 'completed' ? 'success' : order.status === 'in-progress' ? 'warning' : 'secondary'}">
          ${order.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>
      <div class="card-body">
        <p><strong>Customer:</strong> ${order.customer_name}</p>
        <p><strong>Details:</strong> ${order.details || 'No details'}</p>
        <p><strong>Pickup Date:</strong> ${order.pickup_date}</p>
        <div class="d-flex justify-content-between">
          <button class="btn btn-primary update-status" data-id="${order.id}" data-status="in-progress">
            Move to In Progress
          </button>
          <button class="btn btn-success update-status" data-id="${order.id}" data-status="completed">
            Mark as Completed
          </button>
          <button class="btn btn-danger delete-order" data-id="${order.id}">Delete</button>
        </div>
      </div>
    </div>
  `;
};

// Function to load all orders from the server and render them in the dashboard
const loadOrders = async () => {
  try {
    const response = await fetch('/api/orders');
    const orders = await response.json();

    // Clear existing content
    document.getElementById('new-orders').innerHTML = '';
    document.getElementById('in-progress-orders').innerHTML = '';
    document.getElementById('ready-orders').innerHTML = '';

    // Loop through orders and place them in the correct category
    orders.forEach(order => {
      const cardHtml = createOrderCard(order);
      if (order.status === 'new') {
        document.getElementById('new-orders').innerHTML += cardHtml;
      } else if (order.status === 'in-progress') {
        document.getElementById('in-progress-orders').innerHTML += cardHtml;
      } else if (order.status === 'completed') {
        document.getElementById('ready-orders').innerHTML += cardHtml;
      }
    });
  } catch (error) {
    console.error('Failed to load orders:', error);
  }
};

// Function to add a new order
const addNewOrder = async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Get form values
  const itemOrdered = document.getElementById('item-ordered').value.trim();
  const customerName = document.getElementById('customer-name').value.trim();
  const pickupDate = document.getElementById('pickup-date').value;
  const employeeId = document.getElementById('employee-id').value;
  const details = document.getElementById('details').value.trim();

  // Validate the input
  if (!itemOrdered || !customerName || !pickupDate || !employeeId) {
    alert('Please fill out all required fields.');
    return;
  }

  // Create the order object to send to the backend
  const newOrder = {
    itemOrdered,
    customerName,
    pickupDate,
    employeeId,
    details,
  };

  // Send a POST request to the backend API to add the order
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOrder),
    });

    if (response.ok) {
      alert('Order added successfully!');
      loadOrders(); // Reload orders after adding
      document.getElementById('formModal').style.display = 'none'; // Hide the modal
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Failed to add order:', error);
    alert('Failed to add order. Please try again.');
  }
};

// Function to update the order status
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      loadOrders(); // Reload orders after updating status
    } else {
      alert('Failed to update order status');
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

// Function to delete an order
const deleteOrder = async (orderId) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      loadOrders(); // Reload orders after deleting
    } else {
      alert('Failed to delete order');
    }
  } catch (error) {
    console.error('Error deleting order:', error);
  }
};

// Event listeners for updating and deleting orders
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('update-status')) {
    const orderId = event.target.dataset.id;
    const newStatus = event.target.dataset.status;
    updateOrderStatus(orderId, newStatus);
  }

  if (event.target.classList.contains('delete-order')) {
    const orderId = event.target.dataset.id;
    deleteOrder(orderId);
  }
});

// Event listener for showing the New Order modal

document.getElementById('new-order-btn').addEventListener('click', showNewOrderModal);

// Event listener for adding a new order

document.getElementById('new-order-form').addEventListener('submit', addNewOrder);

// Load orders when the page is loaded

document.addEventListener('DOMContentLoaded', loadOrders);
