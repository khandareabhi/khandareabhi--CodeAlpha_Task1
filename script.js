document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadOrders();
});

function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}/-`;
}

// 🔄 Products loaded statically (replacing backend fetch)
const products = [
  {
    id: 1,
    name: 'iphone',
    price: 120000,
    image: 'images/iphone.jpeg'
  },
  {
    id: 2,
    name: 'S21',
    price: 123000,
    image: 'images/s21.jpg'
  },
  {
    id: 3,
    name: 'lens',
    price: 70000,
    image: 'images/lense.jpeg'
  }
];

function loadProducts() {
  const list = document.getElementById('product-list');
  list.innerHTML = '';

  products.forEach(product => {
    const div = createProductElement(product);
    list.appendChild(div);
  });
}

function createProductElement(product) {
  const div = document.createElement('div');

  div.innerHTML = `
    <h3>${product.name}</h3>
    <p>${formatCurrency(product.price)}</p>
    <img src="${product.image}" alt="${product.name}" width="150"
         onerror="this.src='images/default.png'"><br>
    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
    <hr>
  `;
  return div;
}

function addToCart(id, name, price) {
  const quantityStr = prompt(`Enter quantity for ${name}:`, '1');
  if (quantityStr === null) return;

  const quantity = parseInt(quantityStr.trim());
  if (isNaN(quantity) || quantity <= 0) {
    alert("❌ Invalid quantity.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, name, price, quantity });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`✅ ${quantity} ${name}(s) added to cart!`);
}

function loadOrders() {
  const orderList = document.getElementById('orderList');
  orderList.innerHTML = '';

  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  if (!orders.length) {
    orderList.innerHTML = '<li>No orders found.</li>';
    return;
  }

  orders.forEach(order => {
    const li = document.createElement('li');
    li.textContent = `Product ID: ${order.product_id}, Quantity: ${order.quantity}, Total: ${formatCurrency(order.total_price)}`;
    orderList.appendChild(li);
  });
}
