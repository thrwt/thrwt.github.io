
// ===== ANIMATED PARTICLES BACKGROUND =====
// Add this to your existing js/main.js file

// Function to initialize particles (only on pages that need them)
function initParticles() {
    // Check if we're on about.html (which has video background)
    const isAboutPage = window.location.pathname.includes('about.html');
    
    // Don't add particles on about.html (it has video)
    if (isAboutPage) {
        console.log('About page detected - skipping particles (video background active)');
        return;
    }
    
    console.log('Initializing particle background...');
    
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'bg-particles';
    document.body.prepend(particlesContainer);
    
    // Generate 50 floating particles
    const particleCount = 50; // Change this number to add more or fewer particles
    
    for(let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'bg-particle';
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random drift direction
        const driftX = (Math.random() - 0.5) * 500; // -250 to +250 pixels
        const driftY = (Math.random() - 0.5) * 500; // -250 to +250 pixels
        particle.style.setProperty('--drift-x', driftX + 'px');
        particle.style.setProperty('--drift-y', driftY + 'px');
        
        // Random animation timing
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 8) + 's'; // 8-14 seconds
        
        particlesContainer.appendChild(particle);
    }
    
    console.log(`✨ ${particleCount} particles created!`);
}

// Initialize particles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
} else {
    // DOM already loaded
    initParticles();
}

// Optional: Add subtle glow effect that follows mouse
function initMouseGlow() {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        document.body.style.setProperty('--mouse-x', x + '%');
        document.body.style.setProperty('--mouse-y', y + '%');
    });
}

// Uncomment the line below if you want mouse glow effect
// initMouseGlow();


// ===== YOUR EXISTING CODE BELOW THIS LINE =====
// (Keep any existing code in your main.js file)





/* main.js
 - Search
 - Dark mode toggle (localStorage)
 - Mobile nav toggle
 - Reading time calculator
 - Auto stats counter (Writeups & Notes)
 - Active nav link
 - Smooth scroll
*/

// --------- Helpers ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// --------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupDarkMode();
  setupSearch();
  
  // الوظائف المهمة
  calculateReadingTime();
  updateStats();
  activateCurrentNavLink();
  setupSmoothScroll();
});

// --------- Dark mode ----------
function setupDarkMode(){
  const btn = document.querySelector('.dark-toggle');
  const userPref = localStorage.getItem('site-theme');
  if(userPref === 'dark') document.documentElement.classList.add('dark');
  if(userPref === 'light') document.documentElement.classList.remove('dark');

  if(btn){
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
    });
  }
}

// --------- Mobile menu toggle ----------
function setupMobileMenu(){
  const burger = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.navbar .navlinks');
  if(!burger || !nav) return;

  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // close when clicking a link (small screens)
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

// --------- Search ----------
function setupSearch(){
  const input = document.querySelector('.search-input');
  if(!input) return;

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    const posts = document.querySelectorAll('.post-card');
    
    posts.forEach(post => {
      const title = post.querySelector('h2')?.textContent.toLowerCase() || '';
      const excerpt = post.querySelector('p')?.textContent.toLowerCase() || '';
      
      if(!q || title.includes(q) || excerpt.includes(q)){
        post.style.display = '';
      } else {
        post.style.display = 'none';
      }
    });
  });
}

// ==========================================
// حساب وقت القراءة تلقائياً
// ==========================================
function calculateReadingTime() {
    const readingTimeElements = document.querySelectorAll('.reading-time');
    
    readingTimeElements.forEach(element => {
        const container = element.closest('.post') || element.closest('.content');
        
        if (!container) return;
        
        const text = container.innerText || container.textContent;
        const wordCount = text.trim().split(/\s+/).length;
        const wordsPerMinute = 200;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        element.textContent = `${readingTime} min read`;
    });
}

// ==========================================
// حساب عدد الـ Writeups والـ Notes تلقائياً
// ==========================================

async function countPosts(urls) {
    let totalCount = 0;
    
    for (const url of urls) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const posts = doc.querySelectorAll('.post-card');
            totalCount += posts.length;
        } catch (error) {
            console.log(`Could not load ${url}`);
        }
    }
    
    return totalCount;
}

async function updateStats() {
    const writeupPages = [
        'index.html',
        'index2.html', 
        'index3.html'
    ];
    
    const writeupCount = await countPosts(writeupPages);
    
    const notePages = [
        'Notes.html'
   
    ];
    
    const noteCount = await countPosts(notePages);
    
    // حدّث الأرقام في صفحة About
    const writeupStatElements = document.querySelectorAll('[data-stat="writeups"]');
    writeupStatElements.forEach(el => {
        el.textContent = writeupCount;
    });
    
    const noteStatElements = document.querySelectorAll('[data-stat="notes"]');
    noteStatElements.forEach(el => {
        el.textContent = noteCount;
    });
    
    // حدّث الأرقام في Categories sidebar
    const writeupCategoryCount = document.querySelectorAll('[data-category="writeups"]');
    writeupCategoryCount.forEach(el => {
        el.textContent = writeupCount;
    });
    
    const noteCategoryCount = document.querySelectorAll('[data-category="notes"]');
    noteCategoryCount.forEach(el => {
        el.textContent = noteCount;
    });
}

// ==========================================
// تفعيل الـ active state للـ navbar
// ==========================================
function activateCurrentNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.style.color = '#4da3ff';
            link.style.fontWeight = '600';
        }
    });
}

// ==========================================
// Smooth scroll للينكات الداخلية
// ==========================================
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
