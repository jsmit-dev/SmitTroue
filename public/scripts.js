let navOpen = false;

function toggleNav() {
  navOpen = !navOpen;

  let expandedNavElement = document.getElementById("expanded-nav-container");
  expandedNavElement.classList.remove("expanded-nav-closed");

  if (navOpen) {
    expandedNavElement.classList.add("expanded-nav-open");
    expandedNavElement.classList.remove("expanded-nav-close");
  } else {
    expandedNavElement.classList.add("expanded-nav-close");
    expandedNavElement.classList.remove("expanded-nav-open");

    setTimeout(() => {
      expandedNavElement.classList.add("expanded-nav-closed");
      expandedNavElement.classList.remove("expanded-nav-close");
    }, 1000);
  }
}


const rsvpAmountSelect = document.getElementById("rsvp-total-select");
const rsvpNamesContainer = document.getElementById("rsvp-names-container");
const form = document.getElementById("rsvp-form");

// Generate guest fields when number is selected
rsvpAmountSelect.addEventListener("change", () => {
  rsvpNamesContainer.innerHTML = "";
  const count = parseInt(rsvpAmountSelect.value, 10);

  if (!isNaN(count)) {
    for (let i = 1; i <= count; i++) {
      const guestContainer = document.createElement("section");
      guestContainer.id = `guest_${i}`;

      const nameLabel = document.createElement("label");
      nameLabel.textContent = `Gas ${i} se naam: `;
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.name = `guest_name_${i}`;
      nameInput.required = true;

      const attendanceLabel = document.createElement("label");
      attendanceLabel.textContent = ` Bywoon? `;
      const attendanceCheckbox = document.createElement("input");
      attendanceCheckbox.type = "checkbox";
      attendanceCheckbox.name = `guest_attending_${i}`;

      guestContainer.appendChild(nameLabel);
      guestContainer.appendChild(nameInput);
      guestContainer.appendChild(attendanceLabel);
      guestContainer.appendChild(attendanceCheckbox);

      rsvpNamesContainer.appendChild(guestContainer);
    }

    const additionaNotesLabel = document.createElement("label");
    additionaNotesLabel.textContent = "Notas bv. dieet beperkings";
    const additionalNotesTextArea = document.createElement("textarea");
    additionalNotesTextArea.name = "notes";

    rsvpNamesContainer.appendChild(additionaNotesLabel);
    rsvpNamesContainer.appendChild(additionalNotesTextArea);
  }
});

// Handle form submit → send JSON to server
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const count = parseInt(rsvpAmountSelect.value, 10);
  const guests = [];

  for (let i = 1; i <= count; i++) {
    const name = document.querySelector(`#guest_${i} input[type="text"]`).value;
    const attending = document.querySelector(
      `#guest_${i} input[type="checkbox"]`
    ).checked;
    guests.push({ name, attending });
  }

  const notes = document.querySelector("textarea[name='notes']")?.value || "";

  const response = await fetch("/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guests, notes }),
  });

  const result = await response.json();
  alert(result.message);
});
