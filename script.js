// Müzik kontrolü - Otomatik başlatma
let audio = null;
let musicStarted = false;

// Audio elementini hazırla ve müziği başlat
function initAudio() {
    audio = document.getElementById('backgroundMusic');
    if (!audio) {
        setTimeout(initAudio, 50);
        return;
    }
    
    audio.volume = 0.7;
    audio.preload = 'auto';
    
    // Müziği başlat - önce muted olarak başlat, sonra unmute et
    function startMusic() {
        if (!audio || musicStarted) return;
        
        // Önce muted olarak başlatmayı dene (bazı tarayıcılar buna izin verir)
        audio.muted = true;
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(function() {
                // Başarılı oldu, şimdi unmute et
                setTimeout(function() {
                    if (audio) {
                        audio.muted = false;
                        musicStarted = true;
                        console.log('Müzik başladı');
                    }
                }, 100);
            }).catch(function(error) {
                // Muted ile de çalışmadı, normal şekilde dene
                audio.muted = false;
                audio.play().then(function() {
                    musicStarted = true;
                    console.log('Müzik başladı (normal)');
                }).catch(function(err) {
                    console.log('Müzik başlatılamadı');
                });
            });
        }
    }
    
    // Hemen başlatmayı dene
    startMusic();
    
    // Müzik bitince tekrar başlat
    audio.addEventListener('ended', function() {
        audio.currentTime = 0;
        audio.play();
    });
}

// Sayfa yüklendiğinde müziği başlat
window.addEventListener('load', function() {
    initAudio();
    
    // Sayfa yüklendikten sonra agresif bir şekilde müziği başlatmayı dene
    function tryStartMusic() {
        if (!audio || musicStarted) return;
        
        // Muted olarak başlatmayı dene
        if (audio.paused) {
            audio.muted = true;
            audio.play().then(function() {
                setTimeout(function() {
                    if (audio) {
                        audio.muted = false;
                        musicStarted = true;
                    }
                }, 50);
            }).catch(function() {
                audio.muted = false;
            });
        }
    }
    
    // Mobil için daha agresif deneme
    const attempts = isMobile ? [50, 100, 200, 400, 800, 1200] : [50, 200, 500, 1000];
    
    attempts.forEach(function(delay) {
        setTimeout(tryStartMusic, delay);
    });
    
    // Mobil için touch event simülasyonu
    if (isMobile) {
        setTimeout(function() {
            if (audio && audio.paused && !musicStarted) {
                try {
                    const touchEvent = new TouchEvent('touchstart', {
                        bubbles: true,
                        cancelable: true
                    });
                    document.body.dispatchEvent(touchEvent);
                } catch(e) {
                    // Fallback: normal click event
                    try {
                        const clickEvent = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        document.body.dispatchEvent(clickEvent);
                    } catch(e2) {}
                }
            }
        }, 1000);
    }
});

// DOM hazır olduğunda da dene
document.addEventListener('DOMContentLoaded', function() {
    initAudio();
    
    // Hemen müziği başlatmayı dene
    setTimeout(function() {
        if (audio && !musicStarted) {
            audio.muted = true;
            audio.play().then(function() {
                setTimeout(function() {
                    if (audio) {
                        audio.muted = false;
                        musicStarted = true;
                    }
                }, 50);
            }).catch(function() {
                audio.muted = false;
            });
        }
    }, 100);
});

// Sayfa görünür olduğunda dene
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && audio && audio.paused && !musicStarted) {
        audio.muted = true;
        audio.play().then(function() {
            setTimeout(function() {
                if (audio) {
                    audio.muted = false;
                    musicStarted = true;
                }
            }, 50);
        }).catch(function() {
            audio.muted = false;
        });
    }
});

// Sayfa tıklandığında veya dokunulduğunda müziği başlat
document.addEventListener('click', function() {
    if (audio && audio.paused && !musicStarted) {
        audio.play().then(function() {
            musicStarted = true;
        }).catch(function() {});
    }
}, { once: false });

// Touch event'leri - mobil için öncelikli
document.addEventListener('touchstart', function() {
    if (audio && audio.paused && !musicStarted) {
        audio.play().then(function() {
            musicStarted = true;
        }).catch(function() {});
    }
}, { once: false, passive: true });

document.addEventListener('touchend', function() {
    if (audio && audio.paused && !musicStarted) {
        audio.play().then(function() {
            musicStarted = true;
        }).catch(function() {});
    }
}, { once: false, passive: true });

// Mobil için scroll event'i ile de başlat
let scrollStarted = false;
document.addEventListener('scroll', function() {
    if (!scrollStarted && audio && audio.paused && !musicStarted) {
        audio.play().then(function() {
            musicStarted = true;
            scrollStarted = true;
        }).catch(function() {});
    }
}, { once: true, passive: true });

// Mouse hareketi ile de başlatmayı dene
document.addEventListener('mousemove', function() {
    if (audio && audio.paused && !musicStarted) {
        audio.play().then(function() {
            musicStarted = true;
        }).catch(function() {});
    }
}, { once: true });

// Klavye tuşu ile de başlatmayı dene
document.addEventListener('keydown', function() {
    if (audio && audio.paused && !musicStarted) {
        audio.play().then(function() {
            musicStarted = true;
        }).catch(function() {});
    }
}, { once: true });

// Kalp efektleri oluştur
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    
    document.querySelector('.hearts-container').appendChild(heart);
    
    // Kalbi animasyon bitince kaldır
    setTimeout(() => {
        heart.remove();
    }, 10000);
}

// Mobil cihaz kontrolü
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Mobil için kalp oluşturma sıklığını azalt
const heartInterval = isMobile ? 1500 : 800;
setInterval(createHeart, heartInterval);

// Emoji'ler için ek animasyon efektleri
const emojiLeft = document.getElementById('emojiLeft');
const emojiRight = document.getElementById('emojiRight');
const emojiLeft2 = document.getElementById('emojiLeft2');
const emojiRight2 = document.getElementById('emojiRight2');

// Emoji'lere hover efekti ekle (mobil için touch)
function addEmojiEffects() {
    [emojiLeft, emojiRight, emojiLeft2, emojiRight2].forEach(emoji => {
        if (emoji) {
            emoji.addEventListener('mouseenter', function() {
                this.style.transform += ' scale(1.3)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            emoji.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.transition = '';
            });
        }
    });
}

addEmojiEffects();

// Başlık için ek animasyon efektleri
const mainTitle = document.getElementById('mainTitle');
let titlePulseInterval;

function addTitleEffects() {
    // Başlığa pulse efekti ekle
    setInterval(() => {
        mainTitle.style.textShadow = `
            0 0 ${10 + Math.random() * 10}px rgba(255, 23, 68, 0.8),
            0 0 ${20 + Math.random() * 10}px rgba(255, 23, 68, 0.6),
            0 0 ${30 + Math.random() * 10}px rgba(255, 23, 68, 0.4),
            3px 3px 6px rgba(0, 0, 0, 0.5)
        `;
    }, 500);
}

addTitleEffects();

// Alt yazı için ek animasyon efektleri
const bottomText = document.getElementById('bottomText');

function addBottomTextEffects() {
    // Alt yazıya glow efekti ekle
    setInterval(() => {
        bottomText.style.textShadow = `
            0 0 ${15 + Math.random() * 10}px rgba(255, 107, 157, 0.9),
            0 0 ${25 + Math.random() * 10}px rgba(255, 107, 157, 0.7),
            0 0 ${35 + Math.random() * 10}px rgba(255, 107, 157, 0.5),
            2px 2px 8px rgba(0, 0, 0, 0.6)
        `;
    }, 600);
}

addBottomTextEffects();

// Parıltı efektleri için yıldızlar
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'absolute';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.width = '10px';
    sparkle.style.height = '10px';
    sparkle.style.background = 'radial-gradient(circle, #fff 0%, transparent 70%)';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'sparkleAnimation 2s ease-out forwards';
    sparkle.style.zIndex = '15';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 2000);
}

// Sparkle animasyonu CSS'e ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleAnimation {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 0.8;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Mobil için parıltı oluşturma sıklığını azalt
const sparkleInterval = isMobile ? 800 : 300;
setInterval(createSparkle, sparkleInterval);

// Sayfa yüklendiğinde başlangıç animasyonları
window.addEventListener('load', function() {
    // Başlık fade-in
    mainTitle.style.animation = 'titleAnimation 4s ease-in-out infinite, fadeIn 2s ease-out';
    
    // Alt yazı fade-in
    bottomText.style.animation = 'bottomTextAnimation 5s ease-in-out infinite, fadeIn 3s ease-out';
    
    // Fade-in animasyonu ekle
    const fadeInStyle = document.createElement('style');
    fadeInStyle.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(fadeInStyle);
});
