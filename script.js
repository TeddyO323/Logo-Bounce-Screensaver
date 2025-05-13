    document.addEventListener('DOMContentLoaded', () => {
            const logo = document.getElementById('dvd-logo');
            const cornerHitDisplay = document.getElementById('corner-hit');
            const container = document.body;
            
            let posX = Math.random() * (window.innerWidth - 120);
            let posY = Math.random() * (window.innerHeight - 60);
            let speedX = 3;
            let speedY = 3;
            let cornerHits = 0;
            let trailsEnabled = false;
            let logos = [logo];
            let trails = [];
            let chaosMode = false;
            let bgParticles = [];
            
            // Create background particles
            createBackgroundParticles();
            
            // Initialize logo position
            updateLogoPosition();
            
            // Animation loop
            function animate() {
                posX += speedX;
                posY += speedY;
                
                // Check for wall collisions
                if (posX <= 0 || posX >= window.innerWidth - 120) {
                    speedX = -speedX;
                    changeColor();
                    if (chaosMode) randomBounceEffect();
                }
                
                if (posY <= 0 || posY >= window.innerHeight - 60) {
                    speedY = -speedY;
                    changeColor();
                    if (chaosMode) randomBounceEffect();
                }
                
                // Check for corner hits
                if ((posX <= 0 && posY <= 0) || 
                    (posX <= 0 && posY >= window.innerHeight - 60) || 
                    (posX >= window.innerWidth - 120 && posY <= 0) || 
                    (posX >= window.innerWidth - 120 && posY >= window.innerHeight - 60)) {
                    cornerHits++;
                    cornerHitDisplay.textContent = `Corner hits: ${cornerHits}`;
                    createFireworks();
                    createCornerEffect();
                    screenShake();
                    createScorePopup();
                    if (chaosMode) chaosEffect();
                }
                
                // Update all logos
                logos.forEach(logo => {
                    logo.style.left = `${posX}px`;
                    logo.style.top = `${posY}px`;
                });
                
                // Add trail if enabled
                if (trailsEnabled) {
                    addTrail();
                }
                
                requestAnimationFrame(animate);
            }
            
            // Start animation
            animate();
            
            // Handle window resize
            window.addEventListener('resize', () => {
                // Keep logo within bounds if window gets smaller
                if (posX > window.innerWidth - 120) posX = window.innerWidth - 120;
                if (posY > window.innerHeight - 60) posY = window.innerHeight - 60;
                
                // Recreate background particles
                clearBackgroundParticles();
                createBackgroundParticles();
            });
            
            // Helper functions
            function updateLogoPosition() {
                logo.style.left = `${posX}px`;
                logo.style.top = `${posY}px`;
            }
            
            function changeColor() {
                const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', 
                               '#0000FF', '#4B0082', '#9400D3'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                logos.forEach(logo => {
                    logo.querySelector('rect').setAttribute('stroke', randomColor);
                    logo.querySelector('text').setAttribute('fill', randomColor);
                });
            }
            
            function addTrail() {
                const trail = document.createElement('div');
                trail.className = 'trail';
                trail.innerHTML = `
                    <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="120" height="60" fill="none" 
                              stroke="${logos[0].querySelector('rect').getAttribute('stroke')}" 
                              stroke-width="2"/>
                        <text x="60" y="38" font-family="Arial" font-size="24" 
                              font-weight="bold" text-anchor="middle" 
                              fill="${logos[0].querySelector('text').getAttribute('fill')}">DVD</text>
                    </svg>
                `;
                trail.style.left = `${posX}px`;
                trail.style.top = `${posY}px`;
                document.body.appendChild(trail);
                trails.push(trail);
                
                // Fade out and remove old trails
                setTimeout(() => {
                    trail.style.transition = 'opacity 1s';
                    trail.style.opacity = '0';
                    setTimeout(() => {
                        trail.remove();
                        trails = trails.filter(t => t !== trail);
                    }, 1000);
                }, 2000);
            }
            
            // Fireworks effect
            function createFireworks() {
                const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
                
                for (let i = 0; i < 50; i++) {
                    const firework = document.createElement('div');
                    firework.className = 'firework';
                    firework.style.left = `${posX + 60}px`;
                    firework.style.top = `${posY + 30}px`;
                    firework.style.color = colors[Math.floor(Math.random() * colors.length)];
                    
                    // Random direction and distance
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 50 + Math.random() * 100;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;
                    
                    firework.style.setProperty('--tx', `${tx}px`);
                    firework.style.setProperty('--ty', `${ty}px`);
                    
                    document.body.appendChild(firework);
                    
                    // Remove after animation
                    setTimeout(() => {
                        firework.remove();
                    }, 1000);
                }
            }
            
            // Corner hit effect
            function createCornerEffect() {
                const effect = document.createElement('div');
                effect.className = 'corner-effect';
                effect.style.left = `${posX + 10}px`;
                effect.style.top = `${posY + 10}px`;
                effect.style.background = `radial-gradient(circle, ${logos[0].querySelector('rect').getAttribute('stroke')} 0%, rgba(255,255,255,0) 70%)`;
                
                document.body.appendChild(effect);
                
                // Remove after animation
                setTimeout(() => {
                    effect.remove();
                }, 500);
            }
            
            // Screen shake effect
            function screenShake() {
                document.body.style.animation = 'screen-shake 0.5s';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 500);
            }
            
            // Score popup effect
            function createScorePopup() {
                const popup = document.createElement('div');
                popup.className = 'score-popup';
                popup.textContent = `+${Math.floor(speedX + speedY) * 10}`;
                popup.style.color = logos[0].querySelector('rect').getAttribute('stroke');
                popup.style.left = `${posX + 60}px`;
                popup.style.top = `${posY + 30}px`;
                
                document.body.appendChild(popup);
                
                // Remove after animation
                setTimeout(() => {
                    popup.remove();
                }, 1000);
            }
            
            // Background particles
            function createBackgroundParticles() {
                const particleCount = Math.floor(window.innerWidth * window.innerHeight / 5000);
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'bg-particle';
                    particle.style.left = `${Math.random() * window.innerWidth}px`;
                    particle.style.top = `${Math.random() * window.innerHeight}px`;
                    particle.style.animationDuration = `${5 + Math.random() * 10}s`;
                    particle.style.animationDelay = `${Math.random() * 5}s`;
                    particle.style.opacity = '0';
                    
                    // Random slight color variation
                    const brightness = 0.2 + Math.random() * 0.3;
                    particle.style.backgroundColor = `rgba(255, 255, 255, ${brightness})`;
                    
                    document.body.appendChild(particle);
                    bgParticles.push(particle);
                }
            }
            
            function clearBackgroundParticles() {
                bgParticles.forEach(particle => particle.remove());
                bgParticles = [];
            }
            
            // Chaos mode effects
            function chaosEffect() {
                // Randomly change speed
                speedX *= 0.8 + Math.random() * 0.4;
                speedY *= 0.8 + Math.random() * 0.4;
                
                // Randomly add more logos
                if (Math.random() > 0.7 && logos.length < 10) {
                    const newLogo = logo.cloneNode(true);
                    newLogo.id = '';
                    document.body.appendChild(newLogo);
                    logos.push(newLogo);
                }
                
                // Random screen flash
                const flash = document.createElement('div');
                flash.style.position = 'fixed';
                flash.style.top = '0';
                flash.style.left = '0';
                flash.style.width = '100%';
                flash.style.height = '100%';
                flash.style.backgroundColor = logos[0].querySelector('rect').getAttribute('stroke');
                flash.style.opacity = '0.3';
                flash.style.pointerEvents = 'none';
                flash.style.zIndex = '25';
                flash.style.animation = 'fadeOut 0.5s forwards';
                
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 500);
            }
            
            function randomBounceEffect() {
                // Small chance for extra bouncy effect
                if (Math.random() > 0.8) {
                    speedX *= 1.5;
                    speedY *= 1.5;
                    
                    // Add a trail burst
                    for (let i = 0; i < 5; i++) {
                        addTrail();
                    }
                }
            }
            
            // Control buttons
            document.getElementById('add-logo').addEventListener('click', () => {
                const newLogo = logo.cloneNode(true);
                newLogo.id = '';
                document.body.appendChild(newLogo);
                logos.push(newLogo);
            });
            
            document.getElementById('remove-logo').addEventListener('click', () => {
                if (logos.length > 1) {
                    const removedLogo = logos.pop();
                    removedLogo.remove();
                }
            });
            
            document.getElementById('add-trails').addEventListener('click', () => {
                trailsEnabled = true;
            });
            
            document.getElementById('clear-trails').addEventListener('click', () => {
                trailsEnabled = false;
                trails.forEach(trail => trail.remove());
                trails = [];
            });
            
            document.getElementById('speed-up').addEventListener('click', () => {
                speedX *= 1.2;
                speedY *= 1.2;
            });
            
            document.getElementById('slow-down').addEventListener('click', () => {
                speedX *= 0.8;
                speedY *= 0.8;
            });
            
            document.getElementById('chaos-mode').addEventListener('click', () => {
                chaosMode = !chaosMode;
                const btn = document.getElementById('chaos-mode');
                if (chaosMode) {
                    btn.style.backgroundColor = '#f00';
                    btn.textContent = 'CHAOS MODE ON';
                    btn.style.fontWeight = 'bold';
                } else {
                    btn.style.backgroundColor = '#333';
                    btn.textContent = 'Chaos Mode';
                    btn.style.fontWeight = '';
                }
            });
            
            // Initial color
            changeColor();
        });