// Отображение кастомного контекстного меню
function showContextMenu(x, y) {
  const contextMenu = document.getElementById('custom-context-menu');
  contextMenu.style.display = 'block';
  contextMenu.style.left = x + 'px';
  contextMenu.style.top = y + 'px';

  // Закрытие контекстного меню по клику вне его области
  document.addEventListener('click', function hideContextMenu() {
    contextMenu.style.display = 'none';
    document.removeEventListener('click', hideContextMenu);
  });
}

// Функция для отображения модального окна добавления заметки
function showNoteDialog() {
  Swal.fire({
    title: 'Добавить заметку',
    html: `
                <input type="color" id="note-color" value="#ffcc00" style="margin-bottom: 10px;">
                <input type="text" id="note-size" placeholder="Размер заметки (например, 200px)" style="width: 100%; margin-bottom: 10px;" value="100px">
                <textarea id="note-content" placeholder="Текст заметки" style="width: 100%; height: 100px;"></textarea>
            `,
    focusConfirm: false,
    preConfirm: () => {
      const color = document.getElementById('note-color').value;
      const size = document.getElementById('note-size').value;
      const content = document.getElementById('note-content').value;

      if (!color || !size || !content) {
        Swal.showValidationMessage('Пожалуйста, заполните все поля');
        return;
      }

      const position = { x: 0, y: 0 }; // Начальные координаты
      addNote(color, size, content, position);
    }
  });
}

// Функция для добавления заметки
function addNote(color, size, content, position) {
  const note = document.createElement("div");
  note.className = "note";
  note.draggable = true;

  note.style.backgroundColor = color;
  note.style.width = size;
  note.style.height = size;
  note.style.left = position.x + "px";
  note.style.top = position.y + "px";

  note.innerText = content;

  const deleteButton = document.createElement("span");
  deleteButton.className = "delete-button";
  deleteButton.innerHTML = "&#10006;"; // крестик
  deleteButton.addEventListener("click", function () {
    note.remove();
    saveNotes();
  });

  note.appendChild(deleteButton);

  // Добавляем обработчики событий
  addEventListenersToNote(note);

  document.getElementById("notes-container").appendChild(note);
  saveNotes();
}

// Функция для сохранения заметок в localStorage
function saveNotes() {
  const notes = document.getElementById("notes-container").innerHTML;
  localStorage.setItem("notes", notes);
}

// Функция для загрузки заметок из localStorage
function loadNotes() {
  const savedNotes = localStorage.getItem("notes");
  if (savedNotes) {
    document.getElementById("notes-container").innerHTML = savedNotes;
    // Добавляем обработчики событий к загруженным заметкам
    const loadedNotes = document.querySelectorAll(".note");
    loadedNotes.forEach((note) => {
      addEventListenersToNote(note);
    });
  }
}

// Загрузка сохраненных заметок при загрузке страницы
window.onload = function () {
  loadNotes();
};

// Добавление обработчика события на правый клик
document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
  showContextMenu(event.clientX, event.clientY);
});

// Добавление обработчиков событий для заметки
function addEventListenersToNote(note) {
  note.addEventListener("mousedown", function (e) {
    e.preventDefault();

    const offsetX = e.clientX - note.offsetLeft;
    const offsetY = e.clientY - note.offsetTop;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    function handleMouseMove(e) {
      note.style.left = e.clientX - offsetX + "px";
      note.style.top = e.clientY - offsetY + "px";
    }

    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      saveNotes();
    }
  });
  note.querySelector(".delete-button").addEventListener("click", e => {
    note.remove();
    saveNotes();
  })
}