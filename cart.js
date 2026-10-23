// Cart page: show items, change quantity, remove books, show totals
function showCart() {
  var items = getCart();
  var html = "", total = 0;
  for (var i = 0; i < items.length; i++) {
    var sub = items[i][2] * items[i][4];
    total = total + sub;
    html += "<tr><td><img src='images/" + items[i][3] + "' class='cart-cover mr-2' alt=''>" + items[i][1] + "</td>" +
      "<td>&#8377;" + items[i][2] + "</td>" +
      "<td><button type='button' class='btn btn-sm btn-outline-secondary' onclick='changeQty(" + i + ", -1)'>-</button>" +
      "<span class='mx-2'>" + items[i][4] + "</span>" +
      "<button type='button' class='btn btn-sm btn-outline-secondary' onclick='changeQty(" + i + ", 1)'>+</button></td>" +
      "<td>&#8377;" + sub + "</td>" +
      "<td><button type='button' class='btn btn-sm btn-outline-danger' onclick='removeItem(" + i + ")'>Remove</button></td></tr>";
  }
  document.getElementById("cartBody").innerHTML = html;

  var delivery = deliveryCharge(total);
  document.getElementById("subTotal").innerHTML = total;
  document.getElementById("delivery").innerHTML = (delivery === 0) ? "Free" : "&#8377;" + delivery;
  document.getElementById("grandTotal").innerHTML = total + delivery;

  // show the table + form only when the cart has books
  document.getElementById("emptyCart").classList.toggle("d-none", items.length > 0);
  document.getElementById("cartArea").classList.toggle("d-none", items.length === 0);
}

function changeQty(i, change) {
  var items = getCart();
  items[i][4] = items[i][4] + change;
  if (items[i][4] < 1) { items[i][4] = 1; }
  if (items[i][4] > 10) { items[i][4] = 10; alert("You can order at most 10 copies of one book."); }
  saveCart(items);
  showCart();
}

function removeItem(i) {
  if (confirm("Remove this book from the cart?")) {
    var items = getCart();
    items.splice(i, 1);
    saveCart(items);
    showCart();
  }
}

function clearCart() {
  if (confirm("Remove all books from the cart?")) {
    saveCart([]);
    showCart();
  }
}

showCart();
