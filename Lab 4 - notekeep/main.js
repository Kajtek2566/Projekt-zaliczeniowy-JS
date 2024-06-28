class Note {
    constructor(title, content, color, pinned, tags, reminder, checklist) {
        this.id = Date.now();
        this.title = title;
        this.content = content;
        this.color = color;
        this.pinned = pinned;
        this.tags = tags;
        this.reminder = reminder;
        this.checklist = checklist || [];
        this.createdAt = new Date().toISOString();
    }
}

// Retrieve notes from localStorage or initialize empty array
let notes = JSON.parse(localStorage.getItem('notes')) || [];

function createNote() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const color = document.getElementById('color').value;
    const pinned = document.getElementById('pin').checked;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
    const reminder = document.getElementById('reminder').value;

    const note = new Note(title, content, color, pinned, tags, reminder);
    notes.push(note);
    saveNotes();
    displayNotes();
    clearForm();
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function displayNotes() {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '<h2>Notes</h2>';
    const pinnedNotes = notes.filter(note => note.pinned);
    const unpinnedNotes = notes.filter(note => !note.pinned);

    [...pinnedNotes, ...unpinnedNotes].forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.style.backgroundColor = note.color;
        if (note.pinned) {
            noteElement.classList.add('pinned');
        }
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <p>Tags: ${note.tags.join(', ')}</p>
            <p>Created At: ${new Date(note.createdAt).toLocaleString()}</p>
            <button onclick="deleteNote(${note.id})">Delete</button>
            <button onclick="editNote(${note.id})">Edit</button>
            <button onclick="toggleChecklist(${note.id})">Checklist</button>
        `;
        notesContainer.appendChild(noteElement);
    });
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    displayNotes();
}

function editNote(id) {
    const note = notes.find(note => note.id === id);
    document.getElementById('title').value = note.title;
    document.getElementById('content').value = note.content;
    document.getElementById('color').value = note.color;
    document.getElementById('pin').checked = note.pinned;
    document.getElementById('tags').value = note.tags.join(', ');
    document.getElementById('reminder').value = note.reminder;
    deleteNote(id);
}

function toggleChecklist(id) {
    // Toggle checklist view for the note
    const note = notes.find(note => note.id === id);
    // Add your checklist logic here
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('color').value = '#ffffff';
    document.getElementById('pin').checked = false;
    document.getElementById('tags').value = '';
    document.getElementById('reminder').value = '';
}

document.getElementById('search').addEventListener('input', function(event) {
    const query = event.target.value.toLowerCase();
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
    );
    displayFilteredNotes(filteredNotes);
});

function displayFilteredNotes(filteredNotes) {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '<h2>Notes</h2>';
    filteredNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.style.backgroundColor = note.color;
        if (note.pinned) {
            noteElement.classList.add('pinned');
        }
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <p>Tags: ${note.tags.join(', ')}</p>
            <p>Created At: ${new Date(note.createdAt).toLocaleString()}</p>
            <button onclick="deleteNote(${note.id})">Delete</button>
            <button onclick="editNote(${note.id})">Edit</button>
            <button onclick="toggleChecklist(${note.id})">Checklist</button>
        `;
        notesContainer.appendChild(noteElement);
    });
}

setInterval(() => {
    const now = new Date();
    notes.forEach(note => {
        if (note.reminder && new Date(note.reminder) <= now) {
            alert(`Reminder for note: ${note.title}`);
            note.reminder = null; // Clear reminder after showing
            saveNotes();
        }
    });
}, 60000); // Check every minute

displayNotes();
