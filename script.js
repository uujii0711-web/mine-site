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
// Map zoom & pan
let map=document.getElementById("mine-map"), mapContainer=document.getElementById("map-container");
let scale=1,mapOriginX=0,mapOriginY=0,isDraggingMap=false,startX,startY;

mapContainer.onmousedown=function(e){isDraggingMap=true;startX=e.clientX-mapOriginX;startY=e.clientY-mapOriginY; mapContainer.style.cursor="grabbing";}
document.onmouseup=function(){isDraggingMap=false; mapContainer.style.cursor="grab";}
document.onmousemove=function(e){if(!isDraggingMap) return; mapOriginX=e.clientX-startX; mapOriginY=e.clientY-startY; map.style.transform=`translate(${mapOriginX}px, ${mapOriginY}px) scale(${scale})`;}
mapContainer.onwheel=function(e){e.preventDefault(); const delta=e.deltaY>0?-0.1:0.1; scale=Math.min(Math.max(0.5,scale+delta),5); map.style.transform=`translate(${mapOriginX}px, ${mapOriginY}px) scale(${scale})`;}

// Touch map
mapContainer.addEventListener('touchstart',e=>{if(e.touches.length==1){isDraggingMap=true;startX=e.touches[0].clientX-mapOriginX; startY=e.touches[0].clientY-mapOriginY;}});
mapContainer.addEventListener('touchmove',e=>{if(!isDraggingMap) return; mapOriginX=e.touches[0].clientX-startX; mapOriginY=e.touches[0].clientY-startY; map.style.transform=`translate(${mapOriginX}px, ${mapOriginY}px) scale(${scale})`;});
mapContainer.addEventListener('touchend',()=>{isDraggingMap=false;});

// Popup
function openLocation(){ fetch("data/location1.json").then(r=>r.json()).then(data=>showPopup(data)); }
function showPopup(data){
  const body=document.getElementById("popup-body");
  body.innerHTML=`<p><b>Огноо:</b>${data.date}</p><p><b>Байршил:</b>${data.location}</p>${data.photos.map(p=>`<img src="${p}" class="popup-photo">`).join("")}`;
  document.getElementById("popup").classList.remove("hidden");
  document.querySelectorAll(".popup-photo").forEach(img=>{img.onclick=()=>openImgModal(img.src);});
}
function closePopup(){document.getElementById("popup").classList.add("hidden");}

// Modal + annotation
let canvas=document.getElementById("modal-canvas"), ctx=canvas.getContext("2d"), modal=document.getElementById("img-modal");
let modalScale=1,imgOffsetX=0,imgOffsetY=0,isDragging=false,lastX,lastY,imgObj=new Image();
let colorPicker=document.getElementById("color-picker"), brushSize=document.getElementById("brush-size");
let undoStack=[], redoStack=[];

function openImgModal(src){
  imgObj.src=src; modal.style.display="flex"; modalScale=1; imgOffsetX=0; imgOffsetY=0; drawCanvas();
}

// Canvas draw
function drawCanvas(){
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let w=imgObj.width*modalScale, h=imgObj.height*modalScale;
  ctx.drawImage(imgObj, canvas.width/2-w/2+imgOffsetX, canvas.height/2-h/2+imgOffsetY, w, h);
  // Restore annotations
  undoStack.forEach(a=>{
    ctx.strokeStyle=a.color; ctx.lineWidth=a.size; ctx.beginPath(); ctx.moveTo(a.points[0].x,a.points[0].y);
    for(let i=1;i<a.points.length;i++) ctx.lineTo(a.points[i].x,a.points[i].y);
    ctx.stroke();
  });
}

// Drag
canvas.onmousedown=function(e){isDragging=true; lastX=e.clientX; lastY=e.clientY; canvas.style.cursor='grabbing'; currentStroke={color:colorPicker.value,size:brushSize.value,points:[{x:e.clientX,y:e.clientY}]};};
canvas.onmouseup=function(){isDragging=false; canvas.style.cursor='grab'; if(currentStroke){undoStack.push(currentStroke); currentStroke=null; redoStack=[]; }};
canvas.onmousemove=function(e){
  if(!isDragging) return;
  imgOffsetX += e.movementX; imgOffsetY += e.movementY; // move image
  if(currentStroke) currentStroke.points.push({x:e.clientX,y:e.clientY});
  drawCanvas();
};

// Mouse wheel zoom
canvas.onwheel=function(e){e.preventDefault(); modalScale+=e.deltaY>0?-0.1:0.1; modalScale=Math.min(Math.max(0.5,modalScale),5); drawCanvas();};

// Undo / Redo
document.getElementById("undo-btn").onclick=function(){
  if(undoStack.length>0){redoStack.push(undoStack.pop()); drawCanvas();}
};
document.getElementById("redo-btn").onclick=function(){
  if(redoStack.length>0){undoStack.push(redoStack.pop()); drawCanvas();}
};

// Close modal
document.getElementById("close-modal").onclick=function(){modal.style.display='none';};
window.onresize=drawCanvas;
let currentStroke=null;
canvas.style.cursor='grab';
imgObj.onload=drawCanvas;
