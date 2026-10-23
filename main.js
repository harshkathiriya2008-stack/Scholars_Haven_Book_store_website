// Date object: footer year and greeting
var yearEl = document.getElementById("year");
if (yearEl) { yearEl.innerHTML = new Date().getFullYear(); }

var greetEl = document.getElementById("greeting");
if (greetEl) {
  var h = new Date().getHours();
  var msg = "Good evening";
  if (h < 12) { msg = "Good morning"; } else if (h < 17) { msg = "Good afternoon"; }
  greetEl.innerHTML = msg + "! Welcome to Scholar's Haven Book Store.";
}

// ---------- Cart helpers (cart is kept in sessionStorage as text) ----------
// Format of one item: id|title|price|image|qty   (items are separated by ;)
function getCart() {
  var text = sessionStorage.getItem("cart");
  var items = [];
  if (text) {
    var rows = text.split(";");
    for (var i = 0; i < rows.length; i++) {
      var p = rows[i].split("|");
      items.push([p[0], p[1], Number(p[2]), p[3], Number(p[4])]);
    }
  }
  return items;
}
function saveCart(items) {
  var rows = [];
  for (var i = 0; i < items.length; i++) { rows.push(items[i].join("|")); }
  sessionStorage.setItem("cart", rows.join(";"));
  updateBadge();
}
function cartCount() {
  var items = getCart(), n = 0;
  for (var i = 0; i < items.length; i++) { n = n + items[i][4]; }
  return n;
}
function cartTotal() {
  var items = getCart(), t = 0;
  for (var i = 0; i < items.length; i++) { t = t + items[i][2] * items[i][4]; }
  return t;
}
function deliveryCharge(total) {
  if (total > 0 && total < 500) { return 40; }   // free delivery on Rs. 500 and above
  return 0;
}
function updateBadge() {
  var badge = document.getElementById("cartCount");
  if (badge) { badge.innerHTML = cartCount(); }
}
function addToCart(id, title, price, image) {
  var items = getCart(), found = false;
  for (var i = 0; i < items.length; i++) {
    if (items[i][0] === id) { items[i][4] = items[i][4] + 1; found = true; }
  }
  if (!found) { items.push([id, title, Number(price), image, 1]); }
  saveCart(items);
  var box = document.getElementById("cartMsg");
  if (box) {
    box.innerHTML = "<strong>" + title + "</strong> added to your cart. <a href='cart.html'>View cart</a>";
    box.classList.remove("d-none");
  }
}
updateBadge();

// Click event on every "Add to cart" button
var addBtns = document.querySelectorAll(".add-btn");
for (var k = 0; k < addBtns.length; k++) {
  addBtns[k].addEventListener("click", function () {
    addToCart(this.getAttribute("data-id"), this.getAttribute("data-title"), this.getAttribute("data-price"), this.getAttribute("data-image"));
  });
}

// ---------- Store page: search + category filter + pagination (6 books per page) ----------
var perPage = 6;
var currentPage = 1;

function showBooks() {
  var items = document.querySelectorAll(".book");
  var text = document.getElementById("search").value.toLowerCase();
  var cat = document.getElementById("category").value;
  var matches = [];
  for (var i = 0; i < items.length; i++) {
    var words = (items[i].getAttribute("data-title") + " " + items[i].getAttribute("data-author")).toLowerCase();
    var ok = (cat === "" || items[i].getAttribute("data-cat") === cat) && words.indexOf(text) !== -1;
    items[i].style.display = "none";
    if (ok) { matches.push(items[i]); }
  }
  var pages = Math.ceil(matches.length / perPage);
  if (currentPage > pages) { currentPage = 1; }
  var start = (currentPage - 1) * perPage;
  for (var j = start; j < start + perPage && j < matches.length; j++) { matches[j].style.display = "block"; }

  document.getElementById("noBooks").classList.toggle("d-none", matches.length > 0);
  document.getElementById("resultInfo").innerHTML = "Showing " + matches.length + " of " + items.length + " books";

  // build the pagination links
  var html = "<li class='page-item" + (currentPage === 1 ? " disabled" : "") + "'><a class='page-link' href='#' onclick='goPage(" + (currentPage - 1) + "); return false;'>Previous</a></li>";
  for (var p = 1; p <= pages; p++) {
    html += "<li class='page-item" + (p === currentPage ? " active" : "") + "'><a class='page-link' href='#' onclick='goPage(" + p + "); return false;'>" + p + "</a></li>";
  }
  html += "<li class='page-item" + (currentPage >= pages ? " disabled" : "") + "'><a class='page-link' href='#' onclick='goPage(" + (currentPage + 1) + "); return false;'>Next</a></li>";
  document.getElementById("pager").innerHTML = html;
  document.getElementById("pagerBox").classList.toggle("d-none", pages <= 1);
}
function goPage(n) {
  currentPage = n;
  showBooks();
}
if (document.getElementById("bookList")) {
  document.getElementById("search").addEventListener("input", function () { currentPage = 1; showBooks(); });
  document.getElementById("category").addEventListener("change", function () { currentPage = 1; showBooks(); });
  showBooks();
}

// Thank-you page: personalise message (order or inquiry)
var sumEl = document.getElementById("summary");
if (sumEl) {
  var order = sessionStorage.getItem("order");
  var inquiry = sessionStorage.getItem("inquiry");
  if (order) {
    var o = order.split("|");
    document.getElementById("thankTitle").innerHTML = "Order placed";
    sumEl.innerHTML = "Thank you, " + o[0] + "! Your order of " + o[1] + " book(s) worth &#8377;" + o[2] + " is confirmed. Payment: " + o[3] + ".";
  } else if (inquiry) {
    var q = inquiry.split("|");
    document.getElementById("thankTitle").innerHTML = "Inquiry sent";
    sumEl.innerHTML = "Thank you, " + q[0] + "! We received your inquiry for \"" + q[1] + "\" and will contact you soon.";
  }
}
