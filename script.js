function openLocation() {
  fetch("data/location1.json")
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

function showPopup(data) {
  const body = document.getElementById("popup-body");
  body.innerHTML = `
    <p><b>Огноо:</b> ${data.date}</p>
    <p><b>Байршил:</b> ${data.location}</p>
    ${data.photos.map(p => `<img src="${p}" class="popup-photo">`).join("")}
  `;

  document.getElementById("popup").classList.remove("hidden");

  // Зураг дээр дарвал modal нээх
  document.querySelectorAll('.popup-photo').forEach(img => {
    img.onclick = () => openImgModal(img.src);
  });
}

function openImgModal(src) {
  const modal = document.getElementById("img-modal");
  const modalImg = document.getElementById("modal-img");
  modalImg.src = src;
  modal.style.display = "flex";
}

// Modal дээр дарвал хаагдах
document.getElementById("img-modal").onclick = function() {
  this.style.display = "none";
}

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
