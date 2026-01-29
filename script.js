function openLocation() {
  fetch("data/location1.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("JSON уншигдсангүй");
      }
      return response.json();
    })
    .then(data => showPopup(data))
    .catch(err => {
      alert("Өдрийн мэдээлэл ачаалагдсангүй");
      console.error(err);
    });
}

function showPopup(data) {
  const body = document.getElementById("popup-body");

  body.innerHTML = `
    <p><b>Огноо:</b> ${data.date}</p>
    <p><b>Байршил:</b> ${data.location}</p>
    ${data.photos.map(p => `<img src="${p}">`).join("")}
  `;

  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}
