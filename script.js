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
    ${data.photos.map(p => `
      <div style="position:relative; display:block; margin-bottom:8px;">
        <img src="${p}" class="popup-photo">
        ${!isTouchDevice() ? '<button class="zoom-btn">Zoom</button>' : ''}
      </div>
    `).join("")}
  `;

  document.getElementById("popup").classList.remove("hidden");

  // Зураг дээр дарвал modal нээх
  document.querySelectorAll('.popup-photo').forEach(img => {
    img.onclick = () => openImgModal(img.src);
  });

  // Zoom button desktop-д идэвхтэй
  document.querySelectorAll('.zoom-btn').forEach(btn => {
    btn.onclick = (e) => {
      const img = e.target.previousElementSibling;
      openImgModal(img.src);
    }
  });
}

// Modal нээх
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

// Touch detection
function isTouchDevice() {
  return ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}
