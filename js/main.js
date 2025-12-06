/* main.js
 - Dynamic profile loader (data/profile.json)
 - Posts loader (data/posts.json)
 - Search
 - Dark mode toggle (localStorage)
 - Mobile nav toggle
 - Small fade-in animation
*/

// --------- Config ----------
const PROFILE_JSON = '/data/profile.json'; // profile info (sidebar)
const POSTS_JSON   = '/data/posts.json';   // array of posts metadata
const POSTS_CONTAINER_SELECTOR = '.content'; // where posts will be injected (adjust if needed)
const SIDEBAR_SELECTOR = '.sidebar';        // sidebar container selector

// --------- Helpers ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const create = (tag, attrs = {}, txt = '') => {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, v));
  if (txt) el.textContent = txt;
  return el;
};

// --------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupDarkMode();
  loadProfile();
  loadPosts();
  setupSearch();
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

// --------- Load profile (sidebar) ----------
async function loadProfile(){
  try {
    const res = await fetch(PROFILE_JSON);
    if(!res.ok) throw new Error('profile json not found');
    const p = await res.json();
    renderProfile(p);
  } catch(e){
    console.warn('Profile load failed:', e);
  }
}

function renderProfile(p){
  const sidebar = document.querySelector(SIDEBAR_SELECTOR);
  if(!sidebar) return;

  // clear existing minimal content (if any)
  sidebar.innerHTML = '';

  const img = create('img', { src: p.avatar || '/images/profile.png', alt: p.name || 'profile' });
  img.classList.add('profile-pic');
  sidebar.appendChild(img);

  const h = create('h2', {}, p.name || 'Your Name');
  sidebar.appendChild(h);

  const bio = create('p', {}, p.bio || '');
  sidebar.appendChild(bio);

  const icons = create('div', { class: 'icons' });
  (p.links || []).forEach(l => {
    const a = create('a', { href: l.url, target: '_blank', rel: 'noopener noreferrer', title: l.label }, '');
    // simple icon fallback: uses text label or emoji; you can replace with <img> or icons
    a.innerHTML = l.icon || l.label;
    icons.appendChild(a);
  });
  sidebar.appendChild(icons);
}

// --------- Load posts ----------
let POSTS_CACHE = [];
async function loadPosts(){
  try {
    const res = await fetch(POSTS_JSON);
    if(!res.ok) throw new Error('posts json not found');
    const posts = await res.json();
    POSTS_CACHE = posts;
    renderPosts(posts);
  } catch(e){
    console.warn('Posts load failed:', e);
    // fallback: show existing static content
  }
}

function renderPosts(posts){
  const container = document.querySelector(POSTS_CONTAINER_SELECTOR);
  if(!container) return;

  // Clear previous (but keep sidebar if it's in same container — we assume .content is the main area)
  // If your HTML uses .content to wrap everything, we look for a child .posts-area
  let postsArea = container.querySelector('.posts-area');
  if(!postsArea){
    postsArea = create('div', { class: 'posts-area' });
    container.appendChild(postsArea);
  }
  postsArea.innerHTML = '';

  posts.forEach(p => {
    const card = create('article', { class: 'post-card' });

    // left: thumbnail (optional)
    if(p.thumb){
      const thumb = create('img', { src: p.thumb, alt: p.title, class: 'post-thumb' });
      card.appendChild(thumb);
    }

    const metaWrap = create('div', { class: 'post-body' });
    const title = create('h2', {}, p.title);
    metaWrap.appendChild(title);

    const metaLine = create('div', { class: 'meta' }, `${p.date || ''} • ${ (p.read_time || '')}`);
    metaWrap.appendChild(metaLine);

    const ex = create('p', { class: 'excerpt' }, p.excerpt || '');
    metaWrap.appendChild(ex);

    const read = create('a', { href: p.url || '#', class: 'read-more' }, 'Read more →');
    metaWrap.appendChild(read);

    card.appendChild(metaWrap);

    // animation: fade-in with small delay
    card.style.opacity = 0;
    postsArea.appendChild(card);
    requestAnimationFrame(()=> {
      card.style.transition = 'opacity .5s ease, transform .5s ease';
      card.style.opacity = 1;
      card.style.transform = 'translateY(0)';
    });
  });
}

// --------- Search ----------
function setupSearch(){
  const input = document.querySelector('.search-input');
  if(!input) return;

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if(!q){
      renderPosts(POSTS_CACHE);
      return;
    }
    const results = POSTS_CACHE.filter(p => {
      return (p.title && p.title.toLowerCase().includes(q)) ||
             (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
             (p.tags && p.tags.join(' ').toLowerCase().includes(q));
    });
    renderPosts(results);
  });
}
