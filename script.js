function openLocation() {
  fetch('data/location1.json')
    .then(res => res.json())
    .then(data => {
      const panel = document.getElementById('panel');
      panel.innerHTML = `<h3>${data.name}</h3>`;

      data.inspections.forEach(i => {
        panel.innerHTML += `
          <div class="date">
            <b>${i.date}</b><br>
            ${i.note}<br>
            ${i.photos.map(p => `<img src="img/${p}" width="100%">`).join('')}
          </div>
        `;
      });

      panel.classList.remove('hidden');
    })
    .catch(err => {
      console.error("Data load error:", err);
      alert("Өдрийн мэдээлэл ачаалагдсангүй!");
    });
}

