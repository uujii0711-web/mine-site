// PIN-ийн байршил ба JSON файл
const locations = [
  { top: "40%", left: "55%", file: "data/location1.json" },
];

// Map дээр PIN нэмэх
const mapContainer = document.querySelector(".map-container");

locations.forEach(loc => {
  const pin = document.createElement("div");
  pin.className = "pin";
  pin.style.top = loc.top;
  pin.style.left = loc.left;
  pin.onclick = () => openLocation(loc.file);
  mapContainer.appendChild(pin);
});

// JSON-аас мэдээлэл унших
function openLocation(file) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error("JSON уншигдсангүй");
      return response.json();
    })
    .then(data => showPopup(data))
    .catch(err => {
      alert("Өдрийн мэдээлэл ачаалагдсангүй");
      console.error(err);
    });
}

// Popup харуулах
function showPopup(data) {
  const body = document.getElementById("popup-body");

  body.innerHTML = `
    <p><b>Огноо:</b> ${data.date}</p>
    <p><b>Байршил:</b> ${data.location}</p>
    ${data.photos.map(p => `<img src="${p}">`).join("")}
  `;

  document.getElementById("popup").classList.remove("hidden");
}

// Popup хаах
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

// Гадна дарвал popup хаагдах
window.addEventListener('click', function(e) {
  const popup = document.getElementById("popup");
  if (!popup.contains(e.target) && !e.target.classList.contains('pin')) {
    closePopup();
  }
});
