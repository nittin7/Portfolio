/* ============================================
   Style 10 JavaScript
   1. Menu button on small screens
   2. The name appears one letter at a time
   3. The rail on the left fills while scrolling
   4. Sections wipe open from the left
   5. The panel slides off the photo
   6. Click a project name to change the panel
   7. The Send button only works with a correct email
   ============================================ */


/* ---------- 1. MENU BUTTON ---------- */

var menuBtn = document.getElementById("menuBtn");
var menu = document.getElementById("menu");

menuBtn.addEventListener("click", function () {
  menu.classList.toggle("show");
});

var menuLinks = document.querySelectorAll(".links a");
for (var i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener("click", function () {
    menu.classList.remove("show");
  });
}


/* ---------- 2. THE NAME, ONE LETTER AT A TIME ---------- */

var nameText = document.getElementById("nameText");
var word = nameText.textContent;

// empty the heading, then put every letter back inside its own <span>
nameText.textContent = "";

for (var c = 0; c < word.length; c++) {

  var piece = document.createElement("span");
  piece.className = "char";

  if (word[c] === " ") {
    piece.classList.add("gap"); // a space needs no letter, only a width
  } else {
    piece.textContent = word[c];
  }

  nameText.appendChild(piece);
}

// show the letters one by one: letter number 3 waits 3 x 55 milliseconds
var chars = document.querySelectorAll(".char");

for (var n = 0; n < chars.length; n++) {
  showLetter(chars[n], n * 55);
}

function showLetter(piece, wait) {
  setTimeout(function () {
    piece.classList.add("in");
  }, wait + 250);
}


/* ---------- 3. THE RAIL ON THE LEFT ---------- */

var railFill = document.getElementById("railFill");
var dots = document.querySelectorAll(".rail-dots a");

window.addEventListener("scroll", function () {

  // how far down the page we are, as a percentage
  var scrolled = window.scrollY;
  var total = document.documentElement.scrollHeight - window.innerHeight;
  railFill.style.height = (scrolled / total) * 100 + "%";

  // which section is in the middle of the screen right now?
  for (var d = 0; d < dots.length; d++) {

    var id = dots[d].getAttribute("data-section");
    var box = document.getElementById(id).getBoundingClientRect();

    // the top of the section is above the middle line, the bottom is below it
    if (box.top < window.innerHeight / 2 && box.bottom > window.innerHeight / 2) {
      dots[d].classList.add("live");
    } else {
      dots[d].classList.remove("live");
    }
  }
});


/* ---------- 4. SECTIONS WIPE OPEN FROM THE LEFT ---------- */

var allSections = document.querySelectorAll("section");

// the right hand column of every section starts closed
// (the class "wipe" is cut off at the right, see the CSS)
for (var b = 0; b < allSections.length; b++) {
  allSections[b].querySelector(".col-main").classList.add("wipe");
}

// a watcher that tells us when a section comes onto the screen
var watcher = new IntersectionObserver(function (entries) {

  for (var e = 0; e < entries.length; e++) {
    if (entries[e].isIntersecting === true) {
      entries[e].target.querySelector(".col-main").classList.add("open");
      watcher.unobserve(entries[e].target); // only once
    }
  }

}, { threshold: 0.15 });

for (var w = 0; w < allSections.length; w++) {
  watcher.observe(allSections[w]);
}


/* ---------- 5. THE PANEL SLIDES OFF THE PHOTO ---------- */

var shot = document.getElementById("shot");

setTimeout(function () {
  shot.classList.add("open");
}, 500);


/* ---------- 6. CLICK A PROJECT NAME ---------- */

var names = document.querySelectorAll(".name");
var panel = document.getElementById("panel");

var pNo = document.getElementById("pNo");
var pTitle = document.getElementById("pTitle");
var pText = document.getElementById("pText");
var pPoints = document.getElementById("pPoints");
var pTech = document.getElementById("pTech");
var pYear = document.getElementById("pYear");
var pLink = document.getElementById("pLink");

function openProject(button) {

  // take the mark off every name, then put it on this one
  for (var k = 0; k < names.length; k++) {
    names[k].classList.remove("on");
  }
  button.classList.add("on");

  // the simple texts
  pNo.textContent = button.getAttribute("data-no");
  pTitle.textContent = button.getAttribute("data-title");
  pText.textContent = button.getAttribute("data-text");
  pYear.textContent = button.getAttribute("data-year");
  pLink.href = button.getAttribute("data-link");

  // the three points. split("|") cuts one long text into a list
  var points = button.getAttribute("data-points").split("|");
  pPoints.innerHTML = "";

  for (var p = 0; p < points.length; p++) {
    var li = document.createElement("li");
    li.textContent = points[p];
    pPoints.appendChild(li);
  }

  // the tech words, the same way
  var tech = button.getAttribute("data-tech").split("|");
  pTech.innerHTML = "";

  for (var t = 0; t < tech.length; t++) {
    var span = document.createElement("span");
    span.textContent = tech[t];
    pTech.appendChild(span);
  }

  // play the wipe again on the panel
  panel.classList.remove("open");
  panel.classList.add("wipe");

  setTimeout(function () {
    panel.classList.add("open");
  }, 30);
}

for (var m = 0; m < names.length; m++) {
  names[m].addEventListener("click", function () {
    openProject(this);
  });
}

// show the first project when the page opens
openProject(names[0]);


/* ---------- 7. EMAIL CHECK AND THE SEND BUTTON ---------- */

var emailBox = document.getElementById("email");
var emailHint = document.getElementById("emailHint");
var sendBtn = document.getElementById("sendBtn");

// only these endings are accepted
var allowed = ["gmail.com", "outlook.com", "icloud.com", "yahoo.com"];

function checkEmail() {

  var value = emailBox.value.trim().toLowerCase();

  // split("@") cuts the address into two halves: name and ending
  var parts = value.split("@");

  // nothing typed yet
  if (value === "") {
    emailBox.classList.remove("good", "bad");
    emailHint.textContent = "Use a Gmail, Outlook, iCloud or Yahoo address.";
    emailHint.style.color = "";
    return false;
  }

  // there must be exactly one @, with something before it
  if (parts.length !== 2 || parts[0] === "") {
    emailBox.classList.add("bad");
    emailBox.classList.remove("good");
    emailHint.textContent = "An email needs a name, then @, then the ending.";
    emailHint.style.color = "#b4432a";
    return false;
  }

  // indexOf tells us if the ending is in the allowed list. -1 means no
  if (allowed.indexOf(parts[1]) === -1) {
    emailBox.classList.add("bad");
    emailBox.classList.remove("good");
    emailHint.textContent = "Only gmail.com, outlook.com, icloud.com or yahoo.com.";
    emailHint.style.color = "#b4432a";
    return false;
  }

  // everything is correct
  emailBox.classList.add("good");
  emailBox.classList.remove("bad");
  emailHint.textContent = "Email looks good.";
  emailHint.style.color = "#2e7d4f";
  return true;
}

// "input" runs on every key press, so the check happens while you type
emailBox.addEventListener("input", function () {
  if (checkEmail() === true) {
    sendBtn.disabled = false; // switch the button on
  } else {
    sendBtn.disabled = true; // keep it switched off
  }
});


/* ---------- 8. SENDING THE FORM ---------- */

var form = document.getElementById("contactForm");
var formMsg = document.getElementById("formMsg");

form.addEventListener("submit", function (event) {

  event.preventDefault(); // stop the page from reloading

  var name = document.getElementById("name").value;
  var message = document.getElementById("message").value;

  if (name === "" || message === "") {
    formMsg.textContent = "Please fill the name and the message too.";
    formMsg.style.color = "#b4432a";
    return;
  }

  if (checkEmail() === false) {
    return;
  }

  // keep the message in the browser (press F12 -> Application -> Local Storage)
  var saved = JSON.parse(localStorage.getItem("messages")) || [];
  saved.push({
    name: name,
    email: emailBox.value,
    message: message,
    time: new Date().toLocaleString()
  });
  localStorage.setItem("messages", JSON.stringify(saved));

  formMsg.textContent = "Thank you, your message has been saved.";
  formMsg.style.color = "#2e7d4f";

  form.reset();
  emailBox.classList.remove("good", "bad");
  emailHint.textContent = "Use a Gmail, Outlook, iCloud or Yahoo address.";
  emailHint.style.color = "";
  sendBtn.disabled = true;
});
