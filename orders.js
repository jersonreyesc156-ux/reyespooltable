async function fetchOrders() {
  const token = localStorage.getItem('adminToken');
  const response = await fetch("/api/orders", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login.html';
      throw new Error("Authentication required.");
    }
    throw new Error("Failed to load orders.");
  }
  return response.json();
}

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleString();
}

function renderOrders(orders) {
  const list = document.getElementById("orders-list");
  if (!orders.length) {
    list.innerHTML = '<p class="order-empty">No orders yet.</p>';
    return;
  }

  list.innerHTML = orders
    .map(
      (order) => {
        const fullName =
          order.firstName || order.lastName
            ? `${order.firstName || ""} ${order.middleName ? `${order.middleName} ` : ""}${order.lastName || ""}`
                .replace(/\s+/g, " ")
                .trim()
            : order.customerName || "Customer";
        // Always use customerAddress since all orders are now manual
        const fullAddress = order.customerAddress || "N/A";
        return `
      <article class="order-item reveal-on-scroll">
        <h3>${fullName}</h3>
        <p><strong>Address:</strong> ${fullAddress}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Product:</strong> ${order.product}</p>
        <p><strong>Size:</strong> ${order.size}${order.size === "Custom" ? ` (${order.customSize})` : ""}</p>
        <p><strong>Additional Product Details:</strong> ${order.productDetails}</p>
        <p><strong>Notes:</strong> ${order.notes || "None"}</p>
        <p><strong>Submitted:</strong> ${formatDate(order.createdAt)}</p>
        <div style="margin-top: 12px;">
          <button onclick="deleteOrder(${order.id})" style="background: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;">Delete Order</button>
        </div>
      </article>
    `;
      }
    )
    .join("");

  setupScrollReveal();
}

function setupScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  revealElements.forEach((element) => observer.observe(element));
}

async function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) {
    return;
  }

  try {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/login.html';
        return;
      }
      throw new Error("Failed to delete order.");
    }

    // Refresh the orders list
    const orders = await fetchOrders();
    renderOrders(orders);
  } catch (error) {
    alert("Failed to delete order. Please try again.");
  }
}

async function init() {
  const list = document.getElementById("orders-list");
  try {
    const orders = await fetchOrders();
    renderOrders(orders);
  } catch (error) {
    list.innerHTML = '<p class="order-empty">Unable to load orders right now.</p>';
  }
}

init();
