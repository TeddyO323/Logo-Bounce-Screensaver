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
        }
        
        if (posY <= 0 || posY >= window.innerHeight - 60) {
            speedY = -speedY;
            changeColor();
        }
        
        // Check for corner hits
        if ((posX <= 0 && posY <= 0) || 
            (posX <= 0 && posY >= window.innerHeight - 60) || 
            (posX >= window.innerWidth - 120 && posY <= 0) || 
            (posX >= window.innerWidth - 120 && posY >= window.innerHeight - 60)) {
            cornerHits++;
            cornerHitDisplay.textContent = `Corner hits: ${cornerHits}`;
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
    
    // Initial color
    changeColor();
});