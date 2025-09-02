const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const firstDate = new Date();
const secondDate = new Date(2026, 3, 4);

firstDate.setHours(0, 0, 0, 0);
secondDate.setHours(0, 0, 0, 0);

console.log(firstDate)
console.log(secondDate)

const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
let daeText = "dag";

if (diffDays > 1)
  daeText = "dae";

document.getElementById("days-to-go").innerHTML = `${diffDays} ${daeText} om te gaan!`;

function getDaysToGo(futureDateString) {
  // Create Date objects for the current date and the future date
  const today = new Date();
  const futureDate = new Date(futureDateString);

  // Set hours, minutes, seconds, and milliseconds to 0 for accurate day calculation
  today.setHours(0, 0, 0, 0);
  futureDate.setHours(0, 0, 0, 0);

  // Calculate the difference in milliseconds
  const timeDifference = futureDate.getTime() - today.getTime();

  // Convert milliseconds to days
  const daysToGo = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysToGo;
}

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


const rsvpInputs = document.getElementById("rsvp-inputs");
const rsvpAmountSelect = document.getElementById("rsvp-total-select");
const rsvpNamesContainer = document.getElementById("rsvp-names-container");
const form = document.getElementById("rsvp-form");
const additionalNotesSection = document.getElementById("additional-notes");
additionalNotesSection.style.display = "none";

const submitButton = document.getElementById("rsvp-form-submit-button");
submitButton.style.visibility = "hidden";

// Generate guest fields when number is selected
rsvpAmountSelect.addEventListener("change", () => {
  rsvpNamesContainer.innerHTML = "";
  const count = parseInt(rsvpAmountSelect.value, 10);

  if (!isNaN(count)) {

    additionalNotesSection.style.display = "flex";
    submitButton.style.visibility = "visible";

    for (let i = 1; i <= count; i++) {
      const guestContainer = document.createElement("section");
      guestContainer.id = `guest_${i}`;

      const nameLabel = document.createElement("label");
      nameLabel.textContent = `Naam van gas ${i}: `;
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
      // guestContainer.appendChild(attendanceLabel);
      // guestContainer.appendChild(attendanceCheckbox);

      rsvpNamesContainer.appendChild(guestContainer);
    }

    const additionaNotesLabel = document.createElement("label");
    additionaNotesLabel.textContent = "Notas bv. dieet beperkings";
    const additionalNotesTextArea = document.createElement("textarea");
    additionalNotesTextArea.name = "notes";

    // rsvpNamesContainer.appendChild(additionaNotesLabel);
    // rsvpNamesContainer.appendChild(additionalNotesTextArea);
  }
  else{
    additionalNotesSection.style.display = "none";
    submitButton.style.visibility = "hidden";
  }
});

// Handle form submit → send JSON to server
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const count = parseInt(rsvpAmountSelect.value, 10);
  const guests = [];

  for (let i = 1; i <= count; i++) {
    const name = document.querySelector(`#guest_${i} input[type="text"]`).value;
    // const attending = document.querySelector(
    //   `#guest_${i} input[type="checkbox"]`
    // ).checked;
    const attending = true;
    guests.push({ name, attending });
  }

  const notes = document.querySelector("textarea[name='notes']")?.value || "";

  const response = await fetch("/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guests, notes }),
  });

  const result = await response.json();

  if (result.success) {
    rsvpInputs.innerHTML = "";

    const completedSection = document.createElement("section");
    completedSection.id = "completedSection";

    const completedMessage = document.createElement("p");
    completedMessage.innerHTML = "RSVP is gestuur. Ons kan nie wag om ons spesiale dag met julle te spandeer nie!";

    const cheersContainer = document.createElement("section");
    cheersContainer.id = "cheers-container";

    const cheersGif = document.createElement("img");
    cheersGif.src = "./img/cheers-2.gif"

    cheersContainer.appendChild(cheersGif);

    completedSection.appendChild(completedMessage);
    completedSection.appendChild(cheersContainer);
    rsvpInputs.appendChild(completedSection);

    document.cookie = "completed=true; expires=Sun, 5 Apr 2026 12:00:00 UTC";
  }
  else {
    alert(result.message);
  }

});

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

if (getCookie("completed") == "true") {
    rsvpInputs.innerHTML = "";

    const completedSection = document.createElement("section");
    completedSection.id = "completedSection";

    const completedMessage = document.createElement("p");
    completedMessage.innerHTML = "RSVP is gestuur Ons kan nie wag om ons dag met julle te spandeer nie!";

    const cheersContainer = document.createElement("section");
    cheersContainer.id = "cheers-container";

    const cheersGif = document.createElement("img");
    cheersGif.src = "./img/cheers-2.gif"

    cheersContainer.appendChild(cheersGif);

    completedSection.appendChild(completedMessage);
    completedSection.appendChild(cheersContainer);
    rsvpInputs.appendChild(completedSection);
}