function openLocation() {
  fetch("data/location1.json")
    .then(res => res.json())
    .then(data => openPopup(data))
    .catch(() => alert("Өдрийн мэдээлэл ачаалагдсангүй"));
}

function openPopup(data) {
  const body = document.getElementById("popup-body");

  body.innerHTML = `
    <p><b>Огноо:</b> ${data.date}</p>
    <p><b>Байршил:</b> ${data.location}</p>
    ${data.photos.map(p => `<img src="img/${p}">`).join("")}
  `;

  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}
