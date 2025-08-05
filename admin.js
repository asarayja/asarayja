// Admin Panel JavaScript
// Denne filen håndterer all funksjonalitet for admin-panelet

// Default legitimasjon (kan endres via settings)
const DEFAULT_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Sjekk om brukeren er logget inn
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        showAdminPanel();
    } else {
        showLoginForm();
    }
}

// Vis login form
function showLoginForm() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

// Vis admin panel
function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadData();
}

// Login funksjon
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    // Hent lagrede legitimasjon eller bruk default
    const savedCredentials = JSON.parse(localStorage.getItem('adminCredentials')) || DEFAULT_CREDENTIALS;
    
    if (username === savedCredentials.username && password === savedCredentials.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        errorDiv.style.display = 'none';
    } else {
        errorDiv.textContent = 'Feil brukernavn eller passord!';
        errorDiv.style.display = 'block';
    }
}

// Logout funksjon
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    showLoginForm();
    // Reset form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Vis tab
function showTab(tabName) {
    // Skjul alle tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    
    // Fjern active klasse fra alle tab buttons
    const tabButtons = document.querySelectorAll('.tab');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Vis valgt tab
    document.getElementById(tabName + 'Tab').style.display = 'block';
    event.target.classList.add('active');
    
    // Last inn data for valgt tab
    if (tabName === 'music') loadMusicData();
    if (tabName === 'gallery') loadGalleryData();
    if (tabName === 'tabs') loadTabsData();
}

// Last inn all data ved oppstart
function loadData() {
    loadContentData();
    loadMusicData();
    loadGalleryData();
    loadTabsData();
}

// Content Management
function loadContentData() {
    const content = JSON.parse(localStorage.getItem('siteContent')) || {};
    
    if (content.siteTitle) document.getElementById('siteTitle').value = content.siteTitle;
    if (content.personalName) document.getElementById('personalName').value = content.personalName;
    if (content.personalAge) document.getElementById('personalAge').value = content.personalAge;
    if (content.personalInterests) document.getElementById('personalInterests').value = content.personalInterests;
    if (content.fursonaName) document.getElementById('fursonaName').value = content.fursonaName;
    if (content.fursonaType) document.getElementById('fursonaType').value = content.fursonaType;
    if (content.fursonaTraits) document.getElementById('fursonaTraits').value = content.fursonaTraits;
}

function saveContent() {
    const content = {
        siteTitle: document.getElementById('siteTitle').value,
        personalName: document.getElementById('personalName').value,
        personalAge: document.getElementById('personalAge').value,
        personalInterests: document.getElementById('personalInterests').value,
        fursonaName: document.getElementById('fursonaName').value,
        fursonaType: document.getElementById('fursonaType').value,
        fursonaTraits: document.getElementById('fursonaTraits').value
    };
    
    localStorage.setItem('siteContent', JSON.stringify(content));
    showMessage('contentMessage', 'Innhold lagret!', 'success');
}

// Music Management
function loadMusicData() {
    const albums = JSON.parse(localStorage.getItem('musicAlbums')) || [];
    const albumSelect = document.getElementById('selectAlbum');
    const albumList = document.getElementById('albumList');
    
    // Oppdater album dropdown
    albumSelect.innerHTML = '<option value="">Velg et album</option>';
    albums.forEach((album, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = album.title;
        albumSelect.appendChild(option);
    });
    
    // Vis album liste
    albumList.innerHTML = '';
    albums.forEach((album, albumIndex) => {
        const albumDiv = document.createElement('div');
        albumDiv.className = 'item';
        albumDiv.innerHTML = `
            <h5>${album.title}</h5>
            <p>${album.description || 'Ingen beskrivelse'}</p>
            <p><strong>Sanger (${album.songs.length}):</strong></p>
            ${album.songs.map((song, songIndex) => `
                <div style="margin-left: 20px; margin-bottom: 5px;">
                    ${song.title} 
                    <button onclick="deleteSong(${albumIndex}, ${songIndex})" class="btn-danger" style="margin-left: 10px; padding: 2px 8px; font-size: 10px;">Slett</button>
                </div>
            `).join('')}
            <div class="item-actions">
                <button onclick="deleteAlbum(${albumIndex})" class="btn-danger">Slett album</button>
            </div>
        `;
        albumList.appendChild(albumDiv);
    });
}

function addAlbum() {
    const title = document.getElementById('albumTitle').value;
    const description = document.getElementById('albumDescription').value;
    
    if (!title.trim()) {
        showMessage('musicMessage', 'Vennligst skriv inn en albumtittel!', 'error');
        return;
    }
    
    const albums = JSON.parse(localStorage.getItem('musicAlbums')) || [];
    albums.push({
        title: title,
        description: description,
        songs: []
    });
    
    localStorage.setItem('musicAlbums', JSON.stringify(albums));
    
    // Reset form
    document.getElementById('albumTitle').value = '';
    document.getElementById('albumDescription').value = '';
    
    loadMusicData();
    showMessage('musicMessage', 'Album opprettet!', 'success');
}

function addSong() {
    const albumIndex = document.getElementById('selectAlbum').value;
    const songTitle = document.getElementById('songTitle').value;
    const songUrl = document.getElementById('songUrl').value;
    
    if (!albumIndex) {
        showMessage('musicMessage', 'Vennligst velg et album!', 'error');
        return;
    }
    
    if (!songTitle.trim() || !songUrl.trim()) {
        showMessage('musicMessage', 'Vennligst fyll ut alle felter!', 'error');
        return;
    }
    
    const albums = JSON.parse(localStorage.getItem('musicAlbums')) || [];
    albums[albumIndex].songs.push({
        title: songTitle,
        url: songUrl
    });
    
    localStorage.setItem('musicAlbums', JSON.stringify(albums));
    
    // Reset form
    document.getElementById('songTitle').value = '';
    document.getElementById('songUrl').value = '';
    
    loadMusicData();
    showMessage('musicMessage', 'Sang lagt til!', 'success');
}

function deleteAlbum(index) {
    if (confirm('Er du sikker på at du vil slette dette albumet?')) {
        const albums = JSON.parse(localStorage.getItem('musicAlbums')) || [];
        albums.splice(index, 1);
        localStorage.setItem('musicAlbums', JSON.stringify(albums));
        loadMusicData();
        showMessage('musicMessage', 'Album slettet!', 'success');
    }
}

function deleteSong(albumIndex, songIndex) {
    if (confirm('Er du sikker på at du vil slette denne sangen?')) {
        const albums = JSON.parse(localStorage.getItem('musicAlbums')) || [];
        albums[albumIndex].songs.splice(songIndex, 1);
        localStorage.setItem('musicAlbums', JSON.stringify(albums));
        loadMusicData();
        showMessage('musicMessage', 'Sang slettet!', 'success');
    }
}

// Gallery Management
function loadGalleryData() {
    const images = JSON.parse(localStorage.getItem('galleryImages')) || [];
    const imageList = document.getElementById('imageList');
    
    imageList.innerHTML = '';
    images.forEach((image, index) => {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'item';
        imageDiv.innerHTML = `
            <img src="${image.url}" alt="${image.alt}" style="max-width: 100px; max-height: 100px; border-radius: 5px; margin-bottom: 10px;">
            <p><strong>Bildetekst:</strong> ${image.caption}</p>
            <p><strong>URL:</strong> ${image.url}</p>
            <div class="item-actions">
                <button onclick="deleteImage(${index})" class="btn-danger">Slett bilde</button>
            </div>
        `;
        imageList.appendChild(imageDiv);
    });
}

function addImage() {
    const imageUrl = document.getElementById('imageUrl').value;
    const imageCaption = document.getElementById('imageCaption').value;
    const imageAlt = document.getElementById('imageAlt').value;
    
    if (!imageUrl.trim() || !imageCaption.trim()) {
        showMessage('galleryMessage', 'Vennligst fyll ut URL og bildetekst!', 'error');
        return;
    }
    
    const images = JSON.parse(localStorage.getItem('galleryImages')) || [];
    images.push({
        url: imageUrl,
        caption: imageCaption,
        alt: imageAlt || imageCaption
    });
    
    localStorage.setItem('galleryImages', JSON.stringify(images));
    
    // Reset form
    document.getElementById('imageUrl').value = '';
    document.getElementById('imageCaption').value = '';
    document.getElementById('imageAlt').value = '';
    
    loadGalleryData();
    showMessage('galleryMessage', 'Bilde lagt til!', 'success');
}

function deleteImage(index) {
    if (confirm('Er du sikker på at du vil slette dette bildet?')) {
        const images = JSON.parse(localStorage.getItem('galleryImages')) || [];
        images.splice(index, 1);
        localStorage.setItem('galleryImages', JSON.stringify(images));
        loadGalleryData();
        showMessage('galleryMessage', 'Bilde slettet!', 'success');
    }
}

// Tabs Management
function loadTabsData() {
    const tabs = JSON.parse(localStorage.getItem('customTabs')) || [];
    const tabsList = document.getElementById('tabsList');
    
    tabsList.innerHTML = '';
    tabs.forEach((tab, index) => {
        const tabDiv = document.createElement('div');
        tabDiv.className = 'item';
        tabDiv.innerHTML = `
            <h5>${tab.name}</h5>
            <p>${tab.content.substring(0, 100)}${tab.content.length > 100 ? '...' : ''}</p>
            <div class="item-actions">
                <button onclick="editTab(${index})">Rediger</button>
                <button onclick="deleteTab(${index})" class="btn-danger">Slett</button>
            </div>
        `;
        tabsList.appendChild(tabDiv);
    });
}

function addTab() {
    const tabName = document.getElementById('newTabName').value;
    const richEditor = document.getElementById('richTextEditor');
    const htmlView = document.getElementById('htmlView');
    
    // Get content from active editor
    const tabContent = htmlView.style.display === 'none' 
        ? richEditor.innerHTML 
        : htmlView.value;
    
    if (!tabName.trim() || !tabContent.trim()) {
        showMessage('tabsMessage', 'Vennligst fyll ut alle felter!', 'error');
        return;
    }
    
    const tabs = JSON.parse(localStorage.getItem('customTabs')) || [];
    tabs.push({
        name: tabName,
        content: tabContent,
        isRichText: true // Mark as rich text content
    });
    
    localStorage.setItem('customTabs', JSON.stringify(tabs));
    
    // Reset form
    document.getElementById('newTabName').value = '';
    richEditor.innerHTML = '';
    htmlView.value = '';
    
    loadTabsData();
    showMessage('tabsMessage', 'Fane opprettet!', 'success');
}

function editTab(index) {
    const tabs = JSON.parse(localStorage.getItem('customTabs')) || [];
    const tab = tabs[index];
    
    document.getElementById('newTabName').value = tab.name;
    
    const richEditor = document.getElementById('richTextEditor');
    const htmlView = document.getElementById('htmlView');
    
    if (tab.isRichText) {
        richEditor.innerHTML = tab.content;
        htmlView.value = tab.content;
    } else {
        // Convert plain text to HTML
        richEditor.innerHTML = tab.content.replace(/\n/g, '<br>');
        htmlView.value = richEditor.innerHTML;
    }
    
    // Slett den gamle og la brukeren lagre som ny
    deleteTab(index, false);
}

function deleteTab(index, showConfirm = true) {
    if (!showConfirm || confirm('Er du sikker på at du vil slette denne fanen?')) {
        const tabs = JSON.parse(localStorage.getItem('customTabs')) || [];
        tabs.splice(index, 1);
        localStorage.setItem('customTabs', JSON.stringify(tabs));
        loadTabsData();
        if (showConfirm) {
            showMessage('tabsMessage', 'Fane slettet!', 'success');
        }
    }
}

// Settings Management
function updateCredentials() {
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!newUsername.trim() || !newPassword.trim()) {
        showMessage('settingsMessage', 'Vennligst fyll ut alle felter!', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showMessage('settingsMessage', 'Passordene stemmer ikke overens!', 'error');
        return;
    }
    
    const credentials = {
        username: newUsername,
        password: newPassword
    };
    
    localStorage.setItem('adminCredentials', JSON.stringify(credentials));
    
    // Reset form
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    showMessage('settingsMessage', 'Legitimasjon oppdatert! Du må logge inn på nytt.', 'success');
    
    setTimeout(() => {
        logout();
    }, 2000);
}

function resetAllData() {
    if (confirm('ADVARSEL: Dette vil slette ALL lagret data. Er du sikker?')) {
        if (confirm('Siste sjanse! All data vil gå tapt. Fortsette?')) {
            // Slett all data
            localStorage.removeItem('siteContent');
            localStorage.removeItem('musicAlbums');
            localStorage.removeItem('galleryImages');
            localStorage.removeItem('customTabs');
            localStorage.removeItem('adminCredentials');
            sessionStorage.removeItem('adminLoggedIn');
            
            showMessage('settingsMessage', 'All data er tilbakestilt!', 'success');
            
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }
}

// Hjelpefunksjon for å vise meldinger
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.className = type === 'success' ? 'success-message' : 'error-message';
    element.textContent = message;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    
    // Enter key for login
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
    
    // Initialize rich text editor when tabs tab is shown
    setTimeout(() => {
        initializeRichTextEditor();
    }, 100);
});

// Eksporter data for bruk på hovedsiden
function exportDataForMainSite() {
    return {
        content: JSON.parse(localStorage.getItem('siteContent')) || {},
        albums: JSON.parse(localStorage.getItem('musicAlbums')) || [],
        images: JSON.parse(localStorage.getItem('galleryImages')) || [],
        customTabs: JSON.parse(localStorage.getItem('customTabs')) || []
    };
}

// Rich Text Editor Functions
function formatText(command, value = null) {
    document.execCommand(command, false, value);
    document.getElementById('richTextEditor').focus();
    updateHTMLView();
}

function insertImage() {
    const url = prompt('Skriv inn bilde URL:', 'https://');
    if (url && url !== 'https://') {
        const alt = prompt('Skriv inn alt-tekst for bildet:', '') || 'Bilde';
        document.execCommand('insertHTML', false, `<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 5px; margin: 10px 0;">`);
        updateHTMLView();
    }
}

function insertLink() {
    const url = prompt('Skriv inn URL:', 'https://');
    if (url && url !== 'https://') {
        const text = prompt('Skriv inn lenketekst:', url);
        if (text) {
            document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" style="color: #9c59cc; text-decoration: underline;">${text}</a>`);
            updateHTMLView();
        }
    }
}

function clearFormatting() {
    document.execCommand('removeFormat', false, null);
    updateHTMLView();
}

function toggleHTMLView() {
    const richEditor = document.getElementById('richTextEditor');
    const htmlView = document.getElementById('htmlView');
    const button = event.target;
    
    if (htmlView.style.display === 'none') {
        // Show HTML view
        htmlView.value = richEditor.innerHTML;
        richEditor.style.display = 'none';
        htmlView.style.display = 'block';
        button.textContent = 'Visual';
        button.style.backgroundColor = '#9c59cc';
    } else {
        // Show rich editor
        richEditor.innerHTML = htmlView.value;
        htmlView.style.display = 'none';
        richEditor.style.display = 'block';
        button.textContent = 'HTML';
        button.style.backgroundColor = '#1a1a1a';
    }
}

function updateHTMLView() {
    const richEditor = document.getElementById('richTextEditor');
    const htmlView = document.getElementById('htmlView');
    if (htmlView.style.display !== 'none') {
        htmlView.value = richEditor.innerHTML;
    }
}

// Initialize rich text editor
function initializeRichTextEditor() {
    const richEditor = document.getElementById('richTextEditor');
    if (richEditor) {
        // Update HTML view when content changes
        richEditor.addEventListener('input', updateHTMLView);
        
        // Sync HTML view back to rich editor
        const htmlView = document.getElementById('htmlView');
        htmlView.addEventListener('input', function() {
            if (htmlView.style.display !== 'none') {
                richEditor.innerHTML = htmlView.value;
            }
        });
        
        // Set initial styling
        richEditor.style.fontSize = '14px';
        richEditor.style.lineHeight = '1.5';
    }
}
