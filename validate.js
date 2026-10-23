// Form validation (basic + data format validation) for the Inquiry form and the Checkout form
function setState(el, ok, msg) {
  var fb = document.getElementById(el.id + "Error");
  el.classList.remove("is-valid", "is-invalid");
  el.classList.add(ok ? "is-valid" : "is-invalid");
  if (!ok && fb) { fb.innerText = msg; }
  return ok;
}
function toggleError(id, show) {
  document.getElementById(id).classList.toggle("d-none", !show);
  return !show;
}
function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function getRadio(name) {
  var radios = document.getElementsByName(name), picked = "";
  for (var i = 0; i < radios.length; i++) { if (radios[i].checked) { picked = radios[i].value; } }
  return picked;
}

// Input event: while typing, re-check a field only if it already shows an error
// (so the error disappears as soon as the user fixes it)
function liveCheck(id, checkFn) {
  var el = document.getElementById(id);
  el.addEventListener("input", function () {
    if (el.classList.contains("is-invalid")) { checkFn(); }
  });
}

// ----- checks used by both forms -----
function checkName() {
  var el = document.getElementById("fullName"), v = el.value.trim();
  if (v === "") { return setState(el, false, "Please enter your name."); }
  if (!/^[A-Za-z ]{3,40}$/.test(v)) { return setState(el, false, "Use 3 to 40 letters and spaces only."); }
  return setState(el, true);
}
function checkEmail() {
  var el = document.getElementById("email"), v = el.value.trim();
  if (v === "") { return setState(el, false, "Please enter your email."); }
  if (!/^[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/.test(v)) { return setState(el, false, "Enter a valid email, e.g. name@example.com."); }
  return setState(el, true);
}
function checkMobile() {
  var el = document.getElementById("mobile"), v = el.value.trim();
  if (v === "") { return setState(el, false, "Please enter your mobile number."); }
  if (!/^[6-9][0-9]{9}$/.test(v)) { return setState(el, false, "Enter a 10-digit number starting with 6, 7, 8 or 9."); }
  return setState(el, true);
}
function checkAgree() {
  return toggleError("agreeError", !document.getElementById("agree").checked);
}

// ----- checks for the Inquiry form -----
function checkCourse() {
  var el = document.getElementById("course");
  if (el.value === "") { return setState(el, false, "Please choose your course."); }
  return setState(el, true);
}
function checkBook() {
  var el = document.getElementById("bookName"), v = el.value.trim();
  if (v === "") { return setState(el, false, "Please enter the book name or subject."); }
  if (v.length < 3 || v.length > 60) { return setState(el, false, "Book name must be 3 to 60 characters."); }
  return setState(el, true);
}
function checkCopies() {
  var el = document.getElementById("copies"), v = el.value.trim();
  if (v === "") { return setState(el, false, "Please enter the number of copies."); }
  if (!/^[0-9]{1,3}$/.test(v) || Number(v) < 1 || Number(v) > 100) { return setState(el, false, "Enter a whole number from 1 to 100."); }
  return setState(el, true);
}
function checkNeeded() {
  var el = document.getElementById("needBy");
  if (el.value === "") { return setState(el, false, "Please choose the date you need the book."); }
  if (new Date(el.value) < today()) { return setState(el, false, "Date cannot be in the past."); }
  return setState(el, true);
}
function checkType() {
  return toggleError("typeError", getRadio("itype") === "");
}

// ----- checks for the Checkout form -----
function checkAddress() {
  var el = document.getElementById("address"), v = el.value.trim();
  if (v === "") { return setState(el, false, "Please enter your delivery address."); }
  if (v.length < 10) { return setState(el, false, "Address must be at least 10 characters."); }
  return setState(el, true);
}
function checkPincode() {
  var el = document.getElementById("pincode"), v = el.value.trim();
  if (v === "") { return setState(el, false, "Please enter your pincode."); }
  if (!/^[1-9][0-9]{5}$/.test(v)) { return setState(el, false, "Pincode must be 6 digits and cannot start with 0."); }
  return setState(el, true);
}
function checkPay() {
  return toggleError("payError", getRadio("pay") === "");
}

// ===== Inquiry form =====
var inquiryForm = document.getElementById("inquiryForm");
if (inquiryForm) {
  // Pre-fill the book when coming from the store page (inquiry.html?book=Head First Java)
  var wanted = new URLSearchParams(window.location.search).get("book");
  if (wanted) { document.getElementById("bookName").value = wanted; }

  // Blur / change events give live feedback
  document.getElementById("fullName").addEventListener("blur", checkName);
  document.getElementById("email").addEventListener("blur", checkEmail);
  document.getElementById("mobile").addEventListener("blur", checkMobile);
  document.getElementById("course").addEventListener("change", checkCourse);
  document.getElementById("bookName").addEventListener("blur", checkBook);
  document.getElementById("copies").addEventListener("blur", checkCopies);
  document.getElementById("needBy").addEventListener("change", checkNeeded);
  liveCheck("fullName", checkName);
  liveCheck("email", checkEmail);
  liveCheck("mobile", checkMobile);
  liveCheck("bookName", checkBook);
  liveCheck("copies", checkCopies);

  // Keyup event: live character counter
  document.getElementById("message").addEventListener("keyup", function () {
    document.getElementById("count").innerHTML = this.value.length;
  });

  // Submit event: run every check (no early exit so all errors show)
  inquiryForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var results = [checkName(), checkEmail(), checkMobile(), checkCourse(), checkBook(), checkCopies(), checkNeeded(), checkType(), checkAgree()];
    var allOk = results.indexOf(false) === -1;
    document.getElementById("formAlert").classList.toggle("d-none", allOk);
    if (allOk) {
      var name = document.getElementById("fullName").value.trim();
      if (confirm("Send your inquiry to Scholar's Haven?")) {
        sessionStorage.removeItem("order");
        sessionStorage.setItem("inquiry", name.split(" ")[0] + "|" + document.getElementById("bookName").value.trim());
        window.location.href = "thankyou.html"; // page redirection
      }
    }
  });

  // Reset event: clear validation styles
  inquiryForm.addEventListener("reset", function () {
    var els = inquiryForm.querySelectorAll(".is-valid, .is-invalid");
    for (var i = 0; i < els.length; i++) { els[i].classList.remove("is-valid", "is-invalid"); }
    var ids = ["typeError", "agreeError", "formAlert"];
    for (var j = 0; j < ids.length; j++) { document.getElementById(ids[j]).classList.add("d-none"); }
    document.getElementById("count").innerHTML = "0";
  });
}

// ===== Checkout form (cart page) =====
var checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
  document.getElementById("fullName").addEventListener("blur", checkName);
  document.getElementById("email").addEventListener("blur", checkEmail);
  document.getElementById("mobile").addEventListener("blur", checkMobile);
  document.getElementById("address").addEventListener("blur", checkAddress);
  document.getElementById("pincode").addEventListener("blur", checkPincode);
  liveCheck("fullName", checkName);
  liveCheck("email", checkEmail);
  liveCheck("mobile", checkMobile);
  liveCheck("address", checkAddress);
  liveCheck("pincode", checkPincode);

  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var results = [checkName(), checkEmail(), checkMobile(), checkAddress(), checkPincode(), checkPay(), checkAgree()];
    var allOk = results.indexOf(false) === -1;
    document.getElementById("formAlert").classList.toggle("d-none", allOk);
    if (allOk) {
      var total = cartTotal() + deliveryCharge(cartTotal());
      if (confirm("Place this order of Rs. " + total + "?")) {
        var first = document.getElementById("fullName").value.trim().split(" ")[0];
        sessionStorage.removeItem("inquiry");
        sessionStorage.setItem("order", first + "|" + cartCount() + "|" + total + "|" + getRadio("pay"));
        saveCart([]);
        window.location.href = "thankyou.html"; // page redirection
      }
    }
  });

  checkoutForm.addEventListener("reset", function () {
    var els = checkoutForm.querySelectorAll(".is-valid, .is-invalid");
    for (var i = 0; i < els.length; i++) { els[i].classList.remove("is-valid", "is-invalid"); }
    var ids = ["payError", "agreeError", "formAlert"];
    for (var j = 0; j < ids.length; j++) { document.getElementById(ids[j]).classList.add("d-none"); }
  });
}
