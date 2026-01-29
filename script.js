// --- MAP & PIN ---
let map = document.getElementById("mine-map");
let mapContainer = document.getElementById("map-container");

let pinsData = [
  {top:"40%", left:"55%", location:"North wall – Bench 7", date:"2026-01-28", photos:["img/photos/2026-01-28/1.jpg","img/photos/2026-01-28/2.jpg"]},
  {top:"60%", left:"30%", location:"South wall – Bench 4", date:"2026-01-29", photos:["img/photos/2026-01-29/1.jpg"]},
  {top:"20%", left:"70%", location:"East wall – Bench 2", date:"2026-01-30", photos:["img/photos/2026-01-30/1.jpg"]}
];

let scale=1, mapOriginX=0, mapOriginY=0, isDraggingMap=false, startX, startY;

// Create pins
pinsData.forEach((p,i)=>{
  let div = document.createElement("div");
  div.className="pin";
  div.style.top=p.top;
  div.style.left=p.left;
  div.onclick = ()=>showPopup(p);
  mapContainer.appendChild(div);
});

// Drag & Zoom map
mapContainer.onmousedown = e => {isDraggingMap=true; startX=e.clientX-mapOriginX; startY=e.clientY-mapOriginY; mapContainer.style.cursor="grabbing";};
document.onmouseup = ()=>{isDraggingMap=false; mapContainer.style.cursor="grab";};
document.onmousemove = e => {
  if(!isDraggingMap) return;
  mapOriginX = e.clientX - startX; mapOriginY = e.clientY - startY;
  updateMapTransform();
};
mapContainer.onwheel = e => {
  e.preventDefault();
  scale += e.deltaY>0?-0.1:0.1;
  scale = Math.min(Math.max(0.5,scale),5);
  updateMapTransform();
};
mapContainer.addEventListener('touchstart',e=>{if(e.touches.length==1){isDraggingMap=true; startX=e.touches[0].clientX-mapOriginX; startY=e.touches[0].clientY-mapOriginY;}});
mapContainer.addEventListener('touchmove',e=>{if(!isDraggingMap) return; mapOriginX=e.touches[0].clientX-startX; mapOriginY=e.touches[0].clientY-startY; updateMapTransform();});
mapContainer.addEventListener('touchend',()=>{isDraggingMap=false;});

function updateMapTransform(){
  map.style.transform = `translate(${mapOriginX}px,${mapOriginY}px) scale(${scale})`;
  document.querySelectorAll(".pin").forEach(pin=>{
    pin.style.transform = `translate(${mapOriginX}px,${mapOriginY}px) scale(${scale})`;
  });
}

// --- POPUP ---
let popup = document.getElementById("popup");
let popupBody = document.getElementById("popup-body");

function showPopup(data){
  popupBody.innerHTML = `<p><b>Огноо:</b> ${data.date}</p><p><b>Байршил:</b> ${data.location}</p>${data.photos.map(p=>`<img src="${p}" class="popup-photo">`).join("")}`;
  popup.classList.remove("hidden");
  document.querySelectorAll(".popup-photo").forEach(img=>img.onclick=()=>openImgModal(img.src));
}
function closePopup(){ popup.classList.add("hidden"); }

// --- IMAGE MODAL + ANNOTATION ---
let modal = document.getElementById("img-modal");
let canvas = document.getElementById("modal-canvas");
let ctx = canvas.getContext("2d");
let modalScale=1,imgOffsetX=0,imgOffsetY=0,isDragging=false,lastX,lastY,imgObj=new Image();
let colorPicker=document.getElementById("color-picker"), brushSize=document.getElementById("brush-size");
let undoStack=[], redoStack=[], currentStroke=null;

function openImgModal(src){
  modal.style.display="flex"; imgObj.src=src; modalScale=1; imgOffsetX=0; imgOffsetY=0; drawCanvas();
}

function drawCanvas(){
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let w = imgObj.width*modalScale, h = imgObj.height*modalScale;
  ctx.drawImage(imgObj, canvas.width/2-w/2+imgOffsetX, canvas.height/2-h/2+imgOffsetY, w, h);
  // Draw annotations
  undoStack.forEach(a=>{
    ctx.strokeStyle=a.color; ctx.lineWidth=a.size; ctx.beginPath(); ctx.moveTo(a.points[0].x,a.points[0].y);
    for(let i=1;i<a.points.length;i++) ctx.lineTo(a.points[i].x,a.points[i].y);
    ctx.stroke();
  });
}

// Drag image / draw
canvas.onmousedown = e=>{
  isDragging=true; lastX=e.clientX; lastY=e.clientY;
  canvas.style.cursor='grabbing';
  currentStroke={color:colorPicker.value,size:brushSize.value,points:[{x:e.clientX,y:e.clientY}]};
};
canvas.onmouseup = e=>{
  isDragging=false; canvas.style.cursor='grab';
  if(currentStroke){undoStack.push(currentStroke); currentStroke=null; redoStack=[];}
};
canvas.onmousemove = e=>{
  if(!isDragging) return;
  imgOffsetX += e.movementX; imgOffsetY += e.movementY;
  if(currentStroke) currentStroke.points.push({x:e.clientX,y:e.clientY});
  drawCanvas();
};

// Zoom canvas
canvas.onwheel = e=>{
  e.preventDefault();
  modalScale += e.deltaY>0?-0.1:0.1;
  modalScale = Math.min(Math.max(0.5,modalScale),5);
  drawCanvas();
};

// Undo/Redo
document.getElementById("undo-btn").onclick = ()=>{ if(undoStack.length>0){redoStack.push(undoStack.pop()); drawCanvas();} };
document.getElementById("redo-btn").onclick = ()=>{ if(redoStack.length>0){undoStack.push(redoStack.pop()); drawCanvas();} };

// Close modal
document.getElementById("close-modal").onclick = ()=>{modal.style.display='none';};
window.onresize = drawCanvas;
imgObj.onload = drawCanvas;
canvas.style.cursor='grab';

