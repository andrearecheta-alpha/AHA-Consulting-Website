// script.js

// Contacts form submission endpoint (unchanged)
const CONTACTS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzhsUnmy93oBb5d8lx1aJS-cGC53ZqN0_QtGNNB4yL8NojpwM8gK4VG_Y8XFkYYBiI/exec";

// Survey shareable link endpoint (UPDATED)
const SURVEY_ENDPOINT = "https://script.google.com/macros/s/AKfycbyy_mRlJ2PPQlyBetJAwtMhO_su6u9mlKYBBJnAsXUaqrNQow6jTY8jJesrPwDnpvYz/exec";

document.addEventListener("DOMContentLoaded", function () {
  // Contact form handler
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      try {
        const res = await fetch(CONTACTS_ENDPOINT, {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          alert("Thank you, your message is received.");
          contactForm.reset();
        } else {
          alert("Sorry, something went wrong. Please try again or email us.");
        }
      } catch (err) {
        console.error(err);
        alert("Sorry, something went wrong. Please try again or email us.");
      }
    });
  }

  // Copy Survey link handler
  const copyBtn = document.getElementById("copy-link");
  if (copyBtn) {
    copyBtn.addEventListener("click", function (e) {
      e.preventDefault();
      navigator.clipboard.writeText(SURVEY_ENDPOINT).then(function () {
        copyBtn.textContent = "Link copied!";
        setTimeout(function () {
          copyBtn.textContent = "Copy shareable link";
        }, 2000);
      });
    });
  }
});
