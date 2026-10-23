SCHOLAR'S HAVEN - ONLINE BOOK STORE WITH INQUIRY PAGE
Name: Harsh Kathiriya | Roll No: 558 | Class: SYBCA - Semester 5

Pages: index.html, store.html, cart.html, inquiry.html, about.html, thankyou.html
Shared files: css/style.css (extra styling) and js/main.js
Other JavaScript: js/cart.js (cart page) and js/validate.js (inquiry + checkout form validation)
Images are in images/ (book covers and hero image). Replace them with real photos if you want.
Built with HTML5, CSS3, Bootstrap 4.1.3 (CDN) and plain JavaScript.

JavaScript used:
- main.js     : Date object (year + greeting), cart functions using sessionStorage, "Add to cart" click event,
                store search + category filter + pagination (6 books per page), thank-you page message
- cart.js     : show cart in table, change quantity, remove book (confirm box), totals and delivery charge
- validate.js : form validation (basic + data format with regular expressions), blur / change / keyup / input /
                submit / reset events, confirm box and page redirection to thankyou.html

How it works:
- Cart is stored in sessionStorage, so it stays when you move between pages in the same tab.
- Delivery is free on orders of Rs. 500 and above, otherwise Rs. 40.
- The inquiry form and checkout form are frontend-only; connect them to PHP/MySQL for real submissions.
- Internet is needed for Bootstrap, jQuery and Google Fonts (CDN links).

To run:
Open index.html with VS Code Live Server.
