const uploadInput = document.getElementById('upload');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const closeModal = document.querySelector('.close');

// Carrega imagens do localStorage ao iniciar
window.addEventListener('DOMContentLoaded', loadImagesFromStorage);

// Ao enviar arquivos
uploadInput.addEventListener('change', function (event) {
  const files = event.target.files;
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const src = e.target.result;
      addImageToGallery(src);
      saveImageToStorage(src);
    };
    reader.readAsDataURL(file);
  });
});

function addImageToGallery(src) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('image-wrapper');

  const img = document.createElement('img');
  img.src = src;
  img.alt = "Imagem da galeria";

  const delBtn = document.createElement('button');
  delBtn.innerHTML = '×';
  delBtn.className = 'delete-btn';

  // Remover imagem ao clicar no botão
  delBtn.addEventListener('click', () => {
    gallery.removeChild(wrapper);
    removeImageFromStorage(src);
  });

  img.addEventListener('click', () => {
    modal.style.display = 'block';
    modalImg.src = src;
  });

  wrapper.appendChild(img);
  wrapper.appendChild(delBtn);
  gallery.appendChild(wrapper);
}

function saveImageToStorage(src) {
  const stored = JSON.parse(localStorage.getItem('galleryImages')) || [];
  if (!stored.includes(src)) {
    stored.push(src);
    localStorage.setItem('galleryImages', JSON.stringify(stored));
  }
}

function removeImageFromStorage(src) {
  let stored = JSON.parse(localStorage.getItem('galleryImages')) || [];
  stored = stored.filter(image => image !== src);
  localStorage.setItem('galleryImages', JSON.stringify(stored));
}

function loadImagesFromStorage() {
  const stored = JSON.parse(localStorage.getItem('galleryImages')) || [];
  stored.forEach(src => addImageToGallery(src));
}

// Fecha o modal ao clicar no X
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fecha o modal ao clicar fora da imagem
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Botão para limpar a galeria
document.getElementById('clear-gallery').addEventListener('click', () => {
  if (confirm('Tem certeza que deseja limpar toda a galeria?')) {
    localStorage.removeItem('galleryImages');
    gallery.innerHTML = '';
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker registrado com sucesso.'))
      .catch(error => console.log('Falha ao registrar Service Worker:', error));
  });
}

