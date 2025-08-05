// Dynamic Content Management for Main Site
// Denne filen håndterer lasting av dynamisk innhold fra localStorage

// Last inn dynamisk innhold ved oppstart
document.addEventListener('DOMContentLoaded', function() {
    loadDynamicContent();
    loadDynamicMusic();
    loadDynamicGallery();
    loadDynamicTabs();
    
    // Eksisterende kode for navigasjon og funksjonalitet...
    initializeExistingFunctionality();
});

// Last inn dynamisk innhold
function loadDynamicContent() {
    const content = JSON.parse(localStorage.getItem('siteContent')) || {};
    
    // Oppdater innhold hvis det finnes
    if (content.siteTitle) {
        const titleElements = document.querySelectorAll('[data-i18n="site_title"]');
        titleElements.forEach(el => el.textContent = content.siteTitle);
    }
    
    if (content.personalName) {
        const nameElements = document.querySelectorAll('[data-i18n="about_value_name"]');
        nameElements.forEach(el => el.textContent = content.personalName);
    }
    
    if (content.personalAge) {
        const ageElements = document.querySelectorAll('[data-i18n="about_value_age"]');
        ageElements.forEach(el => el.textContent = content.personalAge);
    }
    
    if (content.personalInterests) {
        const interestElements = document.querySelectorAll('[data-i18n="about_value_interests"]');
        interestElements.forEach(el => el.textContent = content.personalInterests);
    }
    
    if (content.fursonaName) {
        const fursonaNameElements = document.querySelectorAll('[data-i18n="fursona_value_name"]');
        fursonaNameElements.forEach(el => el.textContent = content.fursonaName);
    }
    
    if (content.fursonaType) {
        const fursonaTypeElements = document.querySelectorAll('[data-i18n="fursona_value_fursona"]');
        fursonaTypeElements.forEach(el => el.textContent = content.fursonaType);
    }
    
    if (content.fursonaTraits) {
        const fursonaTraitElements = document.querySelectorAll('[data-i18n="fursona_value_traits"]');
        fursonaTraitElements.forEach(el => el.textContent = content.fursonaTraits);
    }
}

// Last inn dynamisk musikk
function loadDynamicMusic() {
    const albums = JSON.parse(localStorage.getItem('musicAlbums')) || [];
    const musicSection = document.getElementById('music');
    
    if (albums.length > 0) {
        // Finn eksisterende album container eller opprett ny
        let albumsContainer = musicSection.querySelector('.dynamic-albums');
        if (!albumsContainer) {
            albumsContainer = document.createElement('div');
            albumsContainer.className = 'dynamic-albums';
            // Legg til etter den eksisterende album-seksjonen
            const existingAlbum = musicSection.querySelector('.album');
            if (existingAlbum) {
                existingAlbum.parentNode.insertBefore(albumsContainer, existingAlbum.nextSibling);
            } else {
                musicSection.appendChild(albumsContainer);
            }
        }
        
        // Tøm container
        albumsContainer.innerHTML = '';
        
        // Legg til hvert album
        albums.forEach(album => {
            const albumDiv = document.createElement('div');
            albumDiv.className = 'album';
            
            let songsHTML = '';
            if (album.songs && album.songs.length > 0) {
                songsHTML = `
                    <audio controls></audio>
                    <ul class="playlist">
                        ${album.songs.map(song => `
                            <li data-src="${song.url}">${song.title}</li>
                        `).join('')}
                    </ul>
                `;
            } else {
                songsHTML = '<p>Ingen sanger i dette albumet ennå.</p>';
            }
            
            albumDiv.innerHTML = `
                <h2>${album.title}</h2>
                ${album.description ? `<p style="color: #cccccc; margin-bottom: 15px;">${album.description}</p>` : ''}
                ${songsHTML}
            `;
            
            albumsContainer.appendChild(albumDiv);
        });
        
        // Reinitialisér audio funksjonalitet for nye album
        initializeAudio();
    }
}

// Last inn dynamisk galleri
function loadDynamicGallery() {
    const images = JSON.parse(localStorage.getItem('galleryImages')) || [];
    const gallerySection = document.getElementById('gallery');
    
    if (images.length > 0) {
        let imageGrid = gallerySection.querySelector('.image-grid');
        if (!imageGrid) {
            imageGrid = document.createElement('div');
            imageGrid.className = 'image-grid';
            gallerySection.appendChild(imageGrid);
        }
        
        // Legg til nye bilder (behold eksisterende)
        images.forEach(image => {
            const figure = document.createElement('figure');
            figure.innerHTML = `
                <img src="${image.url}" alt="${image.alt}">
                <figcaption>${image.caption}</figcaption>
            `;
            imageGrid.appendChild(figure);
        });
        
        // Reinitialisér lightbox for nye bilder
        initializeLightbox();
    }
}

// Last inn dynamiske faner
function loadDynamicTabs() {
    const customTabs = JSON.parse(localStorage.getItem('customTabs')) || [];
    
    if (customTabs.length > 0) {
        const nav = document.querySelector('nav ul');
        const body = document.body;
        
        // Legg til faner i navigasjonen
        customTabs.forEach((tab, index) => {
            // Opprett nav element
            const navItem = document.createElement('li');
            const navLink = document.createElement('a');
            navLink.href = '#';
            navLink.textContent = tab.name;
            navLink.id = `menu-custom-${index}`;
            navItem.appendChild(navLink);
            nav.appendChild(navItem);
            
            // Opprett section for fanen
            const section = document.createElement('section');
            section.id = `custom-${index}`;
            section.style.display = 'none';
            
            // Check if content is rich text or plain text
            if (tab.isRichText) {
                section.innerHTML = `
                    <h1>${tab.name}</h1>
                    <div class="rich-content">${tab.content}</div>
                `;
            } else {
                section.innerHTML = `
                    <h1>${tab.name}</h1>
                    <div style="white-space: pre-wrap;">${tab.content}</div>
                `;
            }
            
            // Legg til section før eksisterende lightbox
            const lightbox = document.getElementById('lightbox');
            body.insertBefore(section, lightbox);
            
            // Legg til event listener
            navLink.onclick = function(e) {
                e.preventDefault();
                showCustomSection(section, navLink);
            };
        });
    }
}

// Vis tilpasset seksjon
function showCustomSection(targetSection, targetLink) {
    // Skjul alle seksjoner
    const sections = document.querySelectorAll('section');
    sections.forEach(s => s.style.display = 'none');
    
    // Fjern active klasse fra alle nav links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(a => a.classList.remove('active'));
    
    // Vis valgt seksjon og aktiver nav link
    targetSection.style.display = 'block';
    targetLink.classList.add('active');
}

// Reinitialisér audio funksjonalitet
function initializeAudio() {
    const players = document.querySelectorAll('.album audio');
    const items = document.querySelectorAll('.playlist li');
    
    function pauseAll(curr) { 
        players.forEach(p => p !== curr && p.pause()); 
    }
    
    items.forEach(li => {
        // Fjern eksisterende event listeners
        li.onclick = null;
        
        li.onclick = function() {
            const aud = this.closest('.album').querySelector('audio');
            pauseAll(aud);
            aud.src = this.getAttribute('data-src');
            aud.load();
            aud.play();
            document.querySelectorAll('.playlist li.playing').forEach(x => x.classList.remove('playing'));
            this.classList.add('playing');
        };
    });
    
    players.forEach(p => {
        p.onplay = null;
        p.onplay = () => pauseAll(p);
    });
}

// Reinitialisér lightbox funksjonalitet
function initializeLightbox() {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbClose = document.getElementById('lightbox-close');
    
    document.querySelectorAll('.image-grid img').forEach(img => {
        // Fjern eksisterende event listeners
        img.onclick = null;
        
        img.onclick = () => {
            lbImg.src = img.src;
            lb.style.display = 'flex';
        };
    });
}

// Originale funksjonaliteter (eksisterende kode)
function initializeExistingFunctionality() {
    // Menyvisning (eksisterende kode)
    const menuAbout = document.getElementById('menu-about');
    const menuMusic = document.getElementById('menu-music');
    const menuGallery = document.getElementById('menu-gallery');
    const aboutSection = document.getElementById('about');
    const musicSection = document.getElementById('music');
    const gallerySection = document.getElementById('gallery');

    function showSection(sec) {
        // Skjul alle standard seksjoner
        [aboutSection, musicSection, gallerySection].forEach(s => s.style.display = 'none');
        
        // Skjul alle tilpassede seksjoner
        const customSections = document.querySelectorAll('[id^="custom-"]');
        customSections.forEach(s => s.style.display = 'none');
        
        // Fjern active klasse fra alle nav links
        const allNavLinks = document.querySelectorAll('nav a');
        allNavLinks.forEach(a => a.classList.remove('active'));
        
        // Vis valgt seksjon og aktiver nav link
        sec.style.display = 'block';
        if (sec === aboutSection) menuAbout.classList.add('active');
        if (sec === musicSection) menuMusic.classList.add('active');
        if (sec === gallerySection) menuGallery.classList.add('active');
    }

    menuAbout.onclick = e => { e.preventDefault(); showSection(aboutSection); };
    menuMusic.onclick = e => { e.preventDefault(); showSection(musicSection); };
    menuGallery.onclick = e => { e.preventDefault(); showSection(gallerySection); };

    // Audio/playlist (vil bli overskrevet av initializeAudio() for nye album)
    initializeAudio();

    // Lightbox (eksisterende kode)
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbClose = document.getElementById('lightbox-close');

    initializeLightbox();

    lbClose.onclick = () => { lb.style.display = 'none'; };
    lb.onclick = e => { if (e.target === lb) lb.style.display = 'none'; };

    // Språkoversettelse (eksisterende kode)
    const translations = {
        no: {
            // Generelt
            site_title: "Velkommen til Asarayja sin verden!",
            nav_about: "Om Meg",
            nav_music: "Musikk",
            nav_gallery: "Bilder",

            // Om Meg – Personlig profil
            about_title: "Om Melissa Helena og Asarayja",
            personal_title: "Personlig Profil",
            about_label_name: "Navn:",
            about_value_name: "Melissa Helena",
            about_label_birthday: "Bursdag:",
            about_value_birthday: "15. Januar",
            about_label_age: "Alder:",
            about_value_age: "36 år",
            about_label_interests: "Interesser:",
            about_value_interests: "Spille pc‑spill og se serier, lære",
            about_label_likes: "Liker:",
            about_value_likes: "Gå turer, være med venner og trene",
            about_label_favcolor: "Favorittfarge:",
            about_value_favcolor: "rød, svart og lilla",
            about_label_favgame: "Favorittspill:",
            about_value_favgame: "Retro spill",
            about_label_sport: "Sport:",
            about_value_sport: "Svømming og friidrett",

            // Om Meg – Fursona‑profil
            fursona_title: "Fursona‑profil",
            fursona_label_name: "Navn:",
            fursona_value_name: "Asarayja",
            fursona_label_Fursona: "Fursona:",
            fursona_value_fursona: "Kanin",
            fursona_label_origin: "Opprinnelse:",
            fursona_value_origin: "Nordisk/amrikansk kanin",
            fursona_label_traits: "Egenskaper:",
            fursona_value_traits: "Lur, leken, nysgjerrig(blir byttet med riktig info snart)",
            fursona_label_story: "Bakgrunn:",
            fursona_value_story: "Vokste opp på tundraen, elsker eventyr og samspill med venner.(blir byttet med riktig info snart)",

            // Musikk
            music_title: "Musikk kommer senere",
            album1_title: "Album: Asarayja – Full Rulle",

            // Galleri
            gallery_title: "Bilder kommer snart",
            gallery_caption1: "Asarayja-logo",
            gallery_caption2: "Eksempelbilde 2"
        },
        en: {
            // General
            site_title: "Welcome to Asarayja's world!",
            nav_about: "About Me",
            nav_music: "Music",
            nav_gallery: "Gallery",

            // About Me – Personal profile
            about_title: "About Melissa Helena and Asarayja",
            personal_title: "Personal Profile",
            about_label_name: "Name:",
            about_value_name: "Melissa Helena",
            about_label_birthday: "Birthday:",
            about_value_birthday: "January 15",
            about_label_age: "Age:",
            about_value_age: "36 years",
            about_label_interests: "Interests:",
            about_value_interests: "Playing PC games and watching series",
            about_label_likes: "Likes:",
            about_value_likes: "Going for walks, hanging out with friends and training",
            about_label_favcolor: "Favorite color:",
            about_value_favcolor: "Green, blue and white",
            about_label_favgame: "Favorite game:",
            about_value_favgame: "Retro games",
            about_label_sport: "Sport:",
            about_value_sport: "Swimming and athletics",

            // About Me – Fursona profile
            fursona_title: "Fursona Profile",
            fursona_label_name: "Name:",
            fursona_value_name: "Asarayja",
            fursona_label_Fursona: "Fursona:",
            fursona_value_fursona: "Bunny",
            fursona_label_origin: "Origin:",
            fursona_value_origin: "Nordic/american bunny",
            fursona_label_traits: "Traits:",
            fursona_value_traits: "Cunning, playful, curious(blir byttet med riktig info snart)",
            fursona_label_story: "Background:",
            fursona_value_story: "Grew up on the tundra, loves adventure and hanging out with friends.(blir byttet med riktig info snart)",

            // Music
            music_title: "Music coming later",
            album1_title: "Album: Asarayja – Full Throttle",

            // Gallery
            gallery_title: "Gallery coming soon",
            gallery_caption1: "Asarayja logo",
            gallery_caption2: "Sample image 2"
        }
    };

    let currentLang = 'no';
    const elems = document.querySelectorAll('[data-i18n]');

    function updateLang(lang) {
        elems.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) el.textContent = translations[lang][key];
        });
        document.getElementById('langToggle').textContent = lang === 'no' ? 'English' : 'Norsk';
        document.documentElement.lang = lang;
        currentLang = lang;
    }

    document.getElementById('langToggle').onclick = () => {
        updateLang(currentLang === 'no' ? 'en' : 'no');
    };
    updateLang(currentLang);

    // Back to top funksjonalitet
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Start with About
    showSection(aboutSection);
}

// Eksporter funksjon for debugging
function debugLocalStorage() {
    console.log('Site Content:', JSON.parse(localStorage.getItem('siteContent')));
    console.log('Music Albums:', JSON.parse(localStorage.getItem('musicAlbums')));
    console.log('Gallery Images:', JSON.parse(localStorage.getItem('galleryImages')));
    console.log('Custom Tabs:', JSON.parse(localStorage.getItem('customTabs')));
}
