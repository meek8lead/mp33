const audio = new Audio();
let currentTrackIndex = 0;
let isPlaying = false;

const titleEl = document.getElementById('current-title');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressEl = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playlistUl = document.getElementById('playlist-ul');
const visualizer = document.querySelector('.visualizer');

// Случайные глитчи на странице
function randomGlitch() {
    const els = document.querySelectorAll('.retro-btn, .track-info, h1');
    const randomEl = els[Math.floor(Math.random() * els.length)];
    randomEl.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
    setTimeout(() => {
        randomEl.style.transform = 'translate(0, 0)';
    }, 100);
}
setInterval(randomGlitch, 3000);

// Инициализация плейлиста
function renderPlaylist() {
    playlistUl.innerHTML = '';
    playlistData.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = `> ${track.title}`;
        if (index === currentTrackIndex) li.classList.add('active');
        li.addEventListener('click', () => loadTrack(index));
        playlistUl.appendChild(li);
    });
}

function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = playlistData[index].src;
    titleEl.textContent = playlistData[index].title;
    renderPlaylist();
    if (isPlaying) audio.play();
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        isPlaying = true;
        playBtn.textContent = "|| PAUSE";
        visualizer.classList.remove('paused');
    } else {
        audio.pause();
        isPlaying = false;
        playBtn.textContent = "► PLAY";
        visualizer.classList.add('paused');
    }
}

// Обновление прогресс-бара
audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressEl.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration || 0);
});

audio.addEventListener('ended', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlistData.length;
    loadTrack(currentTrackIndex);
});

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Кнопки
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlistData.length) % playlistData.length;
    loadTrack(currentTrackIndex);
});
nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlistData.length;
    loadTrack(currentTrackIndex);
});

// АДМИНКА
document.getElementById('admin-trigger').addEventListener('click', () => {
    const pass = prompt("ВВЕДИТЕ ПАРОЛЬ ДОСТУПА:");
    if (pass === "pa55w0rd") {
        alert("ДОСТУП РАЗРЕШЕН.\n\nВАЖНО: GitHub Pages не умеет загружать файлы через браузер.\nЧтобы добавить музыку:\n1. Создай папку 'music' рядом с index.html\n2. Положи туда свой MP3\n3. Открой файл data.js и добавь строчку:\n{ title: 'ИМЯ', src: 'music/файл.mp3' },\n\nСайт обновится автоматически после сохранения на GitHub.");
    } else if (pass !== null) {
        alert("ОШИБКА: НЕВЕРНЫЙ ПАРОЛЬ. ДОСТУП ЗАПРЕЩЕН.");
    }
});

// Старт
visualizer.classList.add('paused');
renderPlaylist();
if (playlistData.length > 0) loadTrack(0);

// Лог для отладки
console.log("=== AUDIO_TERMINAL LOADED ===");
console.log("Tracks found:", playlistData.length);
console.log("Playlist:", playlistData);
