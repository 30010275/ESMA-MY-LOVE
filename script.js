// ===== Elements =====
const modal = document.getElementById('proposalModal');
const mainContent = document.getElementById('mainContent');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const music = document.getElementById('music');
const musicToggle = document.getElementById('musicToggle');
const musicText = document.getElementById('musicText');
const heartsContainer = document.getElementById('heartsContainer');
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
const loveLetterElement = document.getElementById('loveLetter');

// ===== State =====
let isMusicPlaying = false;
let slideIndex = 0;
let hasAccepted = false;
let charIndex = 0;

// ===== Love Letter Text =====
const loveLetterText = `My Dearest Love,

From the moment I first saw you, my life has been filled with joy and meaning. You are my sunshine on cloudy days, my anchor in stormy seas, and my greatest blessing.

Every moment spent with you is a treasure I cherish deeply. Your smile brightens my world, your laughter is my favorite melody, and your love is the greatest gift I could ever receive.

On this Valentine's Day, I want you to know how much you mean to me. You are my soulmate, my best friend, and my forever love.

I promise to love you unconditionally, to support your dreams, and to be there for you through every joy and challenge life brings.

You are my everything, and I love you more than words can express.

Forever yours,
Your Love ❤️`;

// ===== Initialize =====
window.onload = function() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    // Start creating floating hearts immediately for ambiance
    setInterval(createFloatingHeart, 400);
    
    // Auto-play music on first interaction (browsers block autoplay)
    document.addEventListener('click', function initAudio() {
        music.load();
        document.removeEventListener('click', initAudio);
    }, { once: true });
};

// ===== Button Handlers =====
function handleYes() {
    hasAccepted = true;
    console.log("Yes button clicked!");
    
    // Hide modal with animation
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.8)';
    modal.style.transition = 'all 0.5s ease';
    
    // Show main content immediately
    mainContent.classList.remove('hidden');
    
    // Position main content correctly
    mainContent.style.display = 'block';
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }, 500);
    
    startCelebration();
}

function handleNo() {
    // Show sad mode temporarily
    createSadEmojis();
    
    // Move button to random position
    moveButton();
}

function moveButton() {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    btnNo.style.transform = `translate(${x}px, ${y}px)`;
    
    // Reset position after a moment
    setTimeout(() => {
        btnNo.style.transform = 'translate(0, 0)';
    }, 200);
}

// ===== Celebration Functions =====
function startCelebration() {
    // Start confetti
    startConfetti();
    
    // Increase heart rate
    setInterval(createFloatingHeart, 200);
    
    // Play music
    toggleMusic();
    
    // Start slideshow
    startSlideshow();
    
    // Type love letter
    typeLoveLetter();
}

function startConfetti() {
    const confettiSettings = {
        target: confettiCanvas,
        max: 150,
        size: 10,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line', 'heart'],
        colors: [
            [255, 107, 157],
            [255, 159, 67],
            [255, 99, 71],
            [255, 215, 0],
            [147, 112, 219]
        ],
        clock: 25,
        interval: null
    };

    let particles = [];
    const colors = confettiSettings.colors;

    function createParticle() {
        return {
            x: Math.random() * confettiCanvas.width,
            y: -20,
            size: Math.random() * confettiSettings.size + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 4 - 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            shape: confettiSettings.props[Math.floor(Math.random() * confettiSettings.props.length)],
            opacity: 1
        };
    }

    function drawParticle(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = `rgb(${p.color.join(',')})`;

        switch (p.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'square':
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -p.size / 2);
                ctx.lineTo(p.size / 2, p.size / 2);
                ctx.lineTo(-p.size / 2, p.size / 2);
                ctx.closePath();
                ctx.fill();
                break;
            case 'heart':
                drawHeart(ctx, 0, 0, p.size / 2);
                break;
            case 'line':
                ctx.fillRect(-p.size, -2, p.size * 2, 4);
                break;
        }
        ctx.restore();
    }

    function drawHeart(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
        ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
        ctx.fill();
    }

    function updateParticles() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        // Add new particles
        if (particles.length < confettiSettings.max) {
            particles.push(createParticle());
        }

        // Update and draw particles
        particles.forEach((p, index) => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;

            // Remove particles that are off screen
            if (p.y > confettiCanvas.height + 20 || p.x < -20 || p.x > confettiCanvas.width + 20) {
                particles.splice(index, 1);
            } else {
                drawParticle(p);
            }
        });

        if (hasAccepted) {
            requestAnimationFrame(updateParticles);
        }
    }

    updateParticles();
}

// ===== Floating Hearts =====
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    
    // Random heart emoji
    const hearts = ['💕', '💗', '💖', '💘', '❤️', '�粉色', '💗'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    
    // Random position
    heart.style.left = Math.random() * 100 + '%';
    
    // Random size
    const size = Math.random() * 20 + 15;
    heart.style.fontSize = size + 'px';
    
    // Random animation duration
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    
    // Random delay
    heart.style.animationDelay = (Math.random() * 2) + 's';
    
    heartsContainer.appendChild(heart);
    
    // Remove after animation
    setTimeout(() => {
        heart.remove();
    }, 7000);
}

function createSadEmojis() {
    const sad = document.createElement('div');
    sad.classList.add('heart');
    
    const emojis = ['😢', '😭', '💔', '💭'];
    sad.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    sad.style.left = Math.random() * 100 + '%';
    sad.style.fontSize = (Math.random() * 20 + 15) + 'px';
    sad.style.animationDuration = (Math.random() * 3 + 4) + 's';
    
    heartsContainer.appendChild(sad);
    
    setTimeout(() => sad.remove(), 7000);
}

// ===== Music Toggle =====
function toggleMusic() {
    if (!music) return;
    
    if (isMusicPlaying) {
        music.pause();
        musicToggle.classList.remove('playing');
        musicText.textContent = 'Play Music';
    } else {
        music.play().catch(e => console.log('Music autoplay blocked:', e));
        musicToggle.classList.add('playing');
        musicText.textContent = 'Pause Music';
    }
    isMusicPlaying = !isMusicPlaying;
}

// ===== Slideshow & Video =====
const slides = document.querySelectorAll('.photo-inner .slide');
const dots = document.querySelectorAll('.dot');
let currentMedia = 0;

function startSlideshow() {
    // Ensure video plays on first slide
    const video = document.getElementById('memoriesVideo');
    if (video) {
        video.play().catch(e => console.log('Video autoplay blocked:', e));
    }
    
    showSlide(currentMedia);
    setInterval(() => {
        if (hasAccepted) {
            toggleVideo(1);
        }
    }, 5000);
}

function toggleVideo(direction) {
    // Pause current video if exists
    const currentSlide = slides[currentMedia];
    const currentVideo = currentSlide.querySelector('video');
    if (currentVideo) {
        currentVideo.pause();
    }
    
    currentMedia += direction;
    if (currentMedia >= slides.length) currentMedia = 0;
    if (currentMedia < 0) currentMedia = slides.length - 1;
    showSlide(currentMedia);
}

function changeSlide(direction) {
    toggleVideo(direction);
}

function goToSlide(index) {
    // Pause current video
    const currentSlide = slides[currentMedia];
    const currentVideo = currentSlide.querySelector('video');
    if (currentVideo) {
        currentVideo.pause();
    }
    
    currentMedia = index;
    showSlide(currentMedia);
}

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    // Auto-play video when shown
    const video = slides[index].querySelector('video');
    if (video) {
        video.play().catch(e => console.log('Video autoplay blocked'));
    }
}

// ===== Typewriter Effect =====
function typeLoveLetter() {
    if (charIndex < loveLetterText.length) {
        loveLetterElement.innerHTML += loveLetterText.charAt(charIndex);
        charIndex++;
        setTimeout(typeLoveLetter, 50);
    }
}

// ===== Video Error Handler =====
function videoLoadError() {
    console.log('Video failed to load, showing placeholder');
    const placeholder1 = document.getElementById('placeholder1');
    if (placeholder1) {
        placeholder1.classList.add('active');
    }
}

// ===== Handle Window Resize =====
window.addEventListener('resize', function() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});


