/* ═══════════════════════════════════════════════
   TACCINO — app.js
   AI Chat · Menu · Cart · Order Tracker
   Dark Mode · Loyalty · Notifications
   ═══════════════════════════════════════════════ */

'use strict';

// ── Paths to generated images (relative) ──────────────────────────
const IMAGE_BASE = 'images/';

const MENU_ITEMS = [
  {
    id: 1,
    name: 'Signature Espresso',
    category: 'coffee',
    price: 180,
    desc: 'A bold double shot of our house-blend, rich with notes of dark chocolate and toasted oak.',
    tags: ['bold', 'classic', 'hot'],
    badge: 'Bestseller',
    badgeClass: '',
    emoji: '☕',
    img: 'espresso.jpg',
    moods: ['tired', 'focus', 'morning'],
  },
  {
    id: 2,
    name: 'Velvet Cappuccino',
    category: 'coffee',
    price: 220,
    desc: 'Microfoam milk art on a balanced espresso base — creamy, warm, and perfectly textured.',
    tags: ['creamy', 'classic', 'hot'],
    badge: '',
    badgeClass: '',
    emoji: '☕',
    img: 'cappuccino.jpg',
    moods: ['happy', 'relaxed', 'morning'],
  },
  {
    id: 3,
    name: 'Gold Iced Latte',
    category: 'cold',
    price: 270,
    desc: 'Cold-brewed espresso over ice with silky oat milk and a whisper of vanilla gold syrup.',
    tags: ['iced', 'smooth', 'oat milk'],
    badge: 'Special',
    badgeClass: 'gold',
    emoji: '🧊',
    img: 'iced_latte.jpg',
    moods: ['happy', 'summer', 'refreshing'],
  },
  {
    id: 4,
    name: 'Ceremonial Matcha',
    category: 'specials',
    price: 290,
    desc: 'Grade-A Japanese matcha whisked with steamed oat milk into a calming, antioxidant elixir.',
    tags: ['matcha', 'zen', 'sweet'],
    badge: 'Trending',
    badgeClass: 'gold',
    emoji: '🍵',
    img: 'matcha.jpg',
    moods: ['calm', 'focus', 'sweet'],
  },
  {
    id: 5,
    name: 'Artisan Croissant',
    category: 'snacks',
    price: 160,
    desc: 'Laminated with cultured butter, baked golden and served warm — pure Parisian indulgence.',
    tags: ['buttery', 'warm', 'flaky'],
    badge: '',
    badgeClass: '',
    emoji: '🥐',
    img: 'croissant.jpg',
    moods: ['hungry', 'happy', 'morning'],
  },
  {
    id: 6,
    name: 'Avocado Tartine',
    category: 'snacks',
    price: 320,
    desc: 'Smashed heirloom avocado on sourdough with microgreens, dukkah, and a lemon drizzle.',
    tags: ['fresh', 'healthy', 'brunch'],
    badge: 'Chef\'s Pick',
    badgeClass: 'gold',
    emoji: '🥑',
    img: 'avocado.jpg',
    moods: ['healthy', 'brunch', 'fresh'],
  },
  {
    id: 7,
    name: 'Taccino Cold Brew',
    category: 'cold',
    price: 250,
    desc: 'Steeped for 18 hours, this cold brew is smooth, low-acid, and naturally sweet.',
    tags: ['cold brew', 'smooth', 'strong'],
    badge: '',
    badgeClass: '',
    emoji: '🧊',
    img: '',
    moods: ['tired', 'focus', 'afternoon'],
  },
  {
    id: 8,
    name: 'Rose Latte',
    category: 'specials',
    price: 310,
    desc: 'Espresso with real rose syrup and oat milk — delicate, floral, and utterly elegant.',
    tags: ['floral', 'sweet', 'unique'],
    badge: 'New',
    badgeClass: 'gold',
    emoji: '🌹',
    img: '',
    moods: ['happy', 'romantic', 'sweet'],
  },
];

// ── APP STATE ────────────────────────────────────────────────────
const state = {
  cart: [],               // { item, qty }
  loyaltyPts: 240,
  activeFilter: 'all',
  orderStep: -1,          // -1 = no active order
  theme: 'light',
  chatOpen: false,
  cartOpen: false,
  viewHistory: [],        // item ids viewed (for suggestions)
  listening: false,
};

// ── IMAGE MAP (from generated images) ────────────────────────────
const IMG_MAP = {
  'espresso.jpg':   'images/espresso.jpg',
  'cappuccino.jpg': 'images/cappuccino.jpg',
  'iced_latte.jpg': 'images/iced_latte.jpg',
  'matcha.jpg':     'images/matcha.jpg',
  'croissant.jpg':  'images/croissant.jpg',
  'avocado.jpg':    'images/avocado.jpg',
};

function getImg(item) {
  if (item.img && IMG_MAP[item.img]) return IMG_MAP[item.img];
  return null;
}

// ── DOM REFS ────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = {
  navbar:         $('navbar'),
  themeToggle:    $('themeToggle'),
  themeIcon:      $('themeIcon'),
  cartBtn:        $('cartBtn'),
  cartCount:      $('cartCount'),
  cartDrawer:     $('cartDrawer'),
  cartOverlay:    $('cartOverlay'),
  cartClose:      $('cartClose'),
  cartItems:      $('cartItems'),
  cartEmpty:      $('cartEmpty'),
  cartFooter:     $('cartFooter'),
  cartSubtotal:   $('cartSubtotal'),
  cartTotal:      $('cartTotal'),
  placeOrderBtn:  $('placeOrderBtn'),
  menuGrid:       $('menuGrid'),
  categoryFilters:$('categoryFilters'),
  aiSuggestionText: $('aiSuggestionText'),
  chatBubble:     $('chatBubble'),
  chatPanel:      $('chatPanel'),
  chatClose:      $('chatClose'),
  chatMessages:   $('chatMessages'),
  quickReplies:   $('quickReplies'),
  chatInput:      $('chatInput'),
  chatSend:       $('chatSend'),
  voiceBtn:       $('voiceBtn'),
  micIcon:        $('micIcon'),
  aiWelcomeBtn:   $('aiWelcomeBtn'),
  timeGreeting:   $('timeGreeting'),
  loyaltyPts:     $('loyaltyPts'),
  loyaltyBadge:   $('loyaltyBadge'),
  toast:          $('toast'),
  orderTracker:   $('orderTrackerSection'),
  trackerSteps:   $('trackerSteps'),
  trackerFill:    $('trackerFill'),
  trackerClose:   $('trackerClose'),
  advanceOrderBtn:$('advanceOrderBtn'),
};

// ═══════════════════════════════════════════════
//   INIT
// ═══════════════════════════════════════════════
function init() {
  setGreeting();
  loadTheme();
  renderMenu();
  setupScrollAnimations();
  setupNavScroll();
  setupCart();
  setupChat();
  setupFilters();
  setupThemeToggle();
  setupOrderTracker();
  setAiSuggestion();
  setTimeout(() => openChat(true), 1800); // auto-open with greeting
}

// ── Time Greeting ─────────────────────────────
function setGreeting() {
  const h = new Date().getHours();
  let g = 'Good evening';
  if (h >= 5  && h < 12) g = 'Good morning';
  else if (h >= 12 && h < 17) g = 'Good afternoon';
  el.timeGreeting.textContent = g;
}

// ── AI Suggestion Bar ─────────────────────────
const AI_SUGGESTIONS = [
  'Try our Signature Espresso — perfect for late-night focus sessions.',
  'The Gold Iced Latte pairs beautifully with our Artisan Croissant.',
  'Feeling warm? Our Cold Brew is steeped for 18 hours of smoothness.',
  'Our Ceremonial Matcha is trending — calming, elegant, and energising.',
  'Start your morning with a Velvet Cappuccino and an Avocado Tartine.',
];
function setAiSuggestion() {
  const h = new Date().getHours();
  let suggestion;
  if (h < 10) suggestion = AI_SUGGESTIONS[4];
  else if (h < 14) suggestion = AI_SUGGESTIONS[0];
  else if (h < 17) suggestion = AI_SUGGESTIONS[2];
  else suggestion = AI_SUGGESTIONS[3];
  el.aiSuggestionText.textContent = suggestion;
}

// ═══════════════════════════════════════════════
//   THEME
// ═══════════════════════════════════════════════
function loadTheme() {
  const saved = localStorage.getItem('taccino-theme') || 'light';
  applyTheme(saved);
}
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  el.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('taccino-theme', theme);
}
function setupThemeToggle() {
  el.themeToggle.addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    showToast(state.theme === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on');
  });
}

// ═══════════════════════════════════════════════
//   SCROLL ANIMATIONS
// ═══════════════════════════════════════════════
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in, .fade-in-delay').forEach(el => observer.observe(el));
}

function setupNavScroll() {
  window.addEventListener('scroll', () => {
    el.navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ═══════════════════════════════════════════════
//   MENU RENDERING
// ═══════════════════════════════════════════════
function renderMenu(filter = 'all') {
  el.menuGrid.innerHTML = '';
  const items = filter === 'all' ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === filter);
  items.forEach((item, idx) => {
    const img = getImg(item);
    const imgHTML = img
      ? `<img src="${img}" alt="${item.name}" loading="lazy" />`
      : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:4rem;background:var(--bg-alt)">${item.emoji}</div>`;

    const badgeHTML = item.badge
      ? `<span class="menu-card-badge ${item.badgeClass}">${item.badge}</span>`
      : '';

    const tagsHTML = item.tags.map(t => `<span class="menu-tag">${t}</span>`).join('');

    const card = document.createElement('div');
    card.className = 'menu-card fade-in';
    card.style.animationDelay = `${idx * 0.07}s`;
    card.dataset.id = item.id;
    card.dataset.category = item.category;
    card.innerHTML = `
      <div class="menu-card-img">
        ${imgHTML}
        ${badgeHTML}
      </div>
      <div class="menu-card-body">
        <div class="menu-card-top">
          <span class="menu-card-name">${item.name}</span>
          <span class="menu-card-price">₹${item.price}</span>
        </div>
        <p class="menu-card-desc">${item.desc}</p>
        <div class="menu-card-footer">
          <div class="menu-card-tags">${tagsHTML}</div>
          <button class="add-btn" data-id="${item.id}" aria-label="Add ${item.name} to cart" title="Add to cart">+</button>
        </div>
      </div>
    `;

    // Track view history for suggestions
    card.addEventListener('mouseenter', () => {
      if (!state.viewHistory.includes(item.id)) {
        state.viewHistory.push(item.id);
        updateAiSuggestionFromHistory();
      }
    });

    el.menuGrid.appendChild(card);
  });

  // Re-trigger scroll animations for new cards
  setTimeout(() => {
    setupScrollAnimations();
    el.menuGrid.querySelectorAll('.fade-in').forEach(c => {
      c.classList.add('visible');
    });
  }, 30);

  // Add-to-cart buttons
  el.menuGrid.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.currentTarget.dataset.id);
      addToCart(id, e.currentTarget);
    });
  });
}

function updateAiSuggestionFromHistory() {
  if (state.viewHistory.length < 2) return;
  const lastId = state.viewHistory[state.viewHistory.length - 1];
  const item = MENU_ITEMS.find(i => i.id === lastId);
  if (!item) return;
  // suggest a pairing
  const pairings = {
    coffee: 'snacks',
    cold: 'snacks',
    snacks: 'coffee',
    specials: 'cold',
  };
  const pairCat = pairings[item.category];
  const paired = MENU_ITEMS.find(i => i.category === pairCat && i.id !== lastId);
  if (paired) {
    el.aiSuggestionText.textContent = `Since you're interested in ${item.name}, try pairing it with our ${paired.name}!`;
  }
}

// ── Category Filters ──────────────────────────
function setupFilters() {
  el.categoryFilters.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.categoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      renderMenu(state.activeFilter);
    });
  });
}

// ═══════════════════════════════════════════════
//   CART
// ═══════════════════════════════════════════════
function setupCart() {
  el.cartBtn.addEventListener('click', openCart);
  el.cartClose.addEventListener('click', closeCart);
  el.cartOverlay.addEventListener('click', closeCart);
  el.placeOrderBtn.addEventListener('click', placeOrder);
}

function openCart() {
  state.cartOpen = true;
  el.cartDrawer.classList.add('open');
  el.cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  state.cartOpen = false;
  el.cartDrawer.classList.remove('open');
  el.cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function addToCart(id, btn) {
  const item = MENU_ITEMS.find(i => i.id === id);
  if (!item) return;

  // Button animation
  btn.classList.add('added');
  setTimeout(() => btn.classList.remove('added'), 400);

  const existing = state.cart.find(c => c.item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ item, qty: 1 });
  }

  // Earn loyalty points
  state.loyaltyPts += Math.floor(item.price * 0.05);
  el.loyaltyPts.textContent = state.loyaltyPts;

  updateCartUI();
  showToast(`✓ ${item.name} added to your order`);
}

function removeFromCart(id) {
  state.cart = state.cart.filter(c => c.item.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const entry = state.cart.find(c => c.item.id === id);
  if (!entry) return;
  entry.qty += delta;
  if (entry.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function updateCartUI() {
  const totalItems = state.cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = state.cart.reduce((s, c) => s + c.item.price * c.qty, 0);

  // Count badge
  el.cartCount.textContent = totalItems;
  el.cartCount.classList.toggle('show', totalItems > 0);

  // Items list
  el.cartItems.innerHTML = '';
  if (state.cart.length === 0) {
    el.cartItems.appendChild(el.cartEmpty);
    el.cartEmpty.style.display = '';
    el.cartFooter.style.display = 'none';
    return;
  }

  state.cart.forEach(({ item, qty }) => {
    const img = getImg(item);
    const imgHTML = img
      ? `<img src="${img}" alt="${item.name}" style="width:54px;height:54px;object-fit:cover;border-radius:10px;" />`
      : `<div style="width:54px;height:54px;border-radius:10px;background:var(--bg-alt);display:flex;align-items:center;justify-content:center;font-size:1.5rem">${item.emoji}</div>`;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-img">${imgHTML}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} each</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
        <span class="qty-val">${qty}</span>
        <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
      </div>
    `;
    el.cartItems.appendChild(cartItem);
  });

  // Qty buttons
  el.cartItems.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      changeQty(parseInt(btn.dataset.id), parseInt(btn.dataset.delta));
    });
  });

  el.cartFooter.style.display = '';
  el.cartSubtotal.textContent = `₹${totalPrice}`;
  el.cartTotal.textContent = `₹${totalPrice}`;
}

function placeOrder() {
  if (state.cart.length === 0) return;
  const names = state.cart.map(c => c.item.name).join(', ');
  closeCart();
  showToast(`🎉 Order placed! Your ${names} ${state.cart.length > 1 ? 'are' : 'is'} being prepared.`);
  state.cart = [];
  updateCartUI();
  // earn bonus points
  state.loyaltyPts += 50;
  el.loyaltyPts.textContent = state.loyaltyPts;
  // Start order tracking
  startOrderTracking();
}

// ═══════════════════════════════════════════════
//   ORDER TRACKING
// ═══════════════════════════════════════════════
const TRACKER_STEPS = ['Received', 'Preparing', 'Ready', 'Served ✓'];
const PROGRESS_MAP  = [0, 33, 66, 100];

function setupOrderTracker() {
  el.trackerClose.addEventListener('click', () => {
    el.orderTracker.style.display = 'none';
  });
  el.advanceOrderBtn.addEventListener('click', advanceOrder);
}

function startOrderTracking() {
  state.orderStep = 0;
  el.orderTracker.style.display = '';
  renderTrackerSteps();
  // simulate auto-advance
  setTimeout(() => { advanceOrder(); }, 4000);
}

function renderTrackerSteps() {
  const steps = el.trackerSteps.querySelectorAll('.tracker-step');
  steps.forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i < state.orderStep)  s.classList.add('done');
    if (i === state.orderStep) s.classList.add('active');
  });
  el.trackerFill.style.width = `${PROGRESS_MAP[state.orderStep] || 0}%`;
}

function advanceOrder() {
  if (state.orderStep >= TRACKER_STEPS.length - 1) return;
  state.orderStep++;
  renderTrackerSteps();
  showToast(`☕ Order update: ${TRACKER_STEPS[state.orderStep]}`);
  if (state.orderStep === TRACKER_STEPS.length - 1) {
    setTimeout(() => { el.orderTracker.style.display = 'none'; state.orderStep = -1; }, 5000);
  }
}

// ═══════════════════════════════════════════════
//   AI CHAT
// ═══════════════════════════════════════════════
const AI_RESPONSES = {
  tired: {
    text: "You need an energy boost! ☕ Try our **Signature Espresso** — a powerful double shot loaded with rich caffeine. Or if you prefer cold, our **Cold Brew** is steeped for 18 hours and hits smoothly.",
    recs: [1, 7],
  },
  happy: {
    text: "Wonderful! Let's celebrate with something special 🌹 Our **Rose Latte** is a mood — delicate, floral, and utterly elegant. Or brighten your day with a **Gold Iced Latte**.",
    recs: [8, 3],
  },
  focus: {
    text: "For deep focus 🧠 I recommend our **Ceremonial Matcha** — calming clarity in a cup. Or the **Signature Espresso** for a sharper, faster kick.",
    recs: [4, 1],
  },
  sweet: {
    text: "Sweet tooth activated 🍬 Our **Rose Latte** with its floral sweetness is divine. Pair it with the **Artisan Croissant** for the ultimate indulgence.",
    recs: [8, 5],
  },
  specialty: {
    text: "Our chef's pride is the **Ceremonial Matcha** 🍵 — sourced from Uji, Japan and whisked tableside. The **Rose Latte** runs a close second. Both are exclusive to Taccino.",
    recs: [4, 8],
  },
  morning: {
    text: "Rise and shine! 🌅 Start your morning with a **Velvet Cappuccino** and our **Avocado Tartine** — the perfect power-up breakfast combo.",
    recs: [2, 6],
  },
  default: {
    text: "I'm Aria, your personal AI waiter at Taccino ✦ Tell me how you're feeling or what you're craving — I'll find the perfect match for you.",
    recs: [],
  },
};

const GREETINGS = [
  "Hello! I'm **Aria**, your personal AI waiter 🌿 How are you feeling today? I can suggest the perfect drink for your mood.",
  "Welcome to Taccino ✦ I'm Aria — tell me if you're tired, happy, focused, or just craving something sweet. I'll curate your perfect order.",
];

function setupChat() {
  el.chatBubble.addEventListener('click', () => openChat());
  el.chatClose.addEventListener('click', closeChat);
  el.aiWelcomeBtn.addEventListener('click', () => {
    openChat();
    document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' });
  });
  el.chatSend.addEventListener('click', sendMessage);
  el.chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
  el.quickReplies.querySelectorAll('.qr-btn').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.dataset.msg));
  });
  el.voiceBtn.addEventListener('click', simulateVoice);
}

function openChat(auto = false) {
  if (state.chatOpen) return;
  state.chatOpen = true;
  el.chatPanel.classList.add('open');
  el.chatBubble.style.opacity = '0';
  el.chatBubble.style.pointerEvents = 'none';

  if (el.chatMessages.children.length === 0) {
    const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setTimeout(() => addAiMessage(greeting), auto ? 400 : 100);
  }
}

function closeChat() {
  state.chatOpen = false;
  el.chatPanel.classList.remove('open');
  el.chatBubble.style.opacity = '';
  el.chatBubble.style.pointerEvents = '';
}

function sendMessage(text) {
  const msg = text || el.chatInput.value.trim();
  if (!msg) return;
  addUserMessage(msg);
  el.chatInput.value = '';

  // Show typing
  const typingEl = addTyping();
  const delay = 900 + Math.random() * 600;
  setTimeout(() => {
    typingEl.remove();
    const response = getAiResponse(msg.toLowerCase());
    addAiMessage(response.text);
    if (response.recs.length > 0) {
      response.recs.forEach(id => {
        const item = MENU_ITEMS.find(i => i.id === id);
        if (item) addAiRecCard(item);
      });
    }
  }, delay);
}

function getAiResponse(msg) {
  if (msg.includes('tired') || msg.includes('sleepy') || msg.includes('exhausted')) return AI_RESPONSES.tired;
  if (msg.includes('happy') || msg.includes('great') || msg.includes('good')) return AI_RESPONSES.happy;
  if (msg.includes('focus') || msg.includes('study') || msg.includes('work')) return AI_RESPONSES.focus;
  if (msg.includes('sweet') || msg.includes('sugar') || msg.includes('dessert')) return AI_RESPONSES.sweet;
  if (msg.includes('specialty') || msg.includes('special') || msg.includes('best') || msg.includes('recommend')) return AI_RESPONSES.specialty;
  if (msg.includes('morning') || msg.includes('breakfast') || msg.includes('start')) return AI_RESPONSES.morning;
  if (msg.includes('matcha')) return { text: "Our **Ceremonial Matcha** 🍵 is sourced from Uji, Japan — Grade A powder whisked with oat milk. It's calming, earthy, and packed with antioxidants. Want me to add it?", recs: [4] };
  if (msg.includes('espresso')) return { text: "The **Signature Espresso** ☕ is our crown jewel — a bold double shot with notes of dark chocolate and toasted oak. Absolutely divine.", recs: [1] };
  if (msg.includes('cold') || msg.includes('iced')) return { text: "Cool you down? 🧊 Our **Gold Iced Latte** is velvety smooth with vanilla gold syrup. Or the **Cold Brew** for a stronger, cleaner hit.", recs: [3, 7] };
  if (msg.includes('snack') || msg.includes('food') || msg.includes('eat') || msg.includes('hungry')) return { text: "Feeling peckish? 🥐 Our **Artisan Croissant** is golden, flaky, and buttered perfection. For something heartier, try the **Avocado Tartine**.", recs: [5, 6] };
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) return { text: "Hello there! 👋 Welcome to Taccino. I'm Aria, your AI waiter. How are you feeling today? I can suggest the perfect drink based on your mood!", recs: [] };
  if (msg.includes('price') || msg.includes('cost') || msg.includes('cheap')) return { text: "Our drinks start at ₹160 and go up to ₹320. All worth every rupee! 😊 What mood are you in? I'll find you the best value pick.", recs: [] };
  if (msg.includes('loyalty') || msg.includes('points') || msg.includes('reward')) return { text: `You currently have **${state.loyaltyPts} Taccino Points** ✦ Every order earns more — redeem them for exclusive drinks and experiences!`, recs: [] };
  return AI_RESPONSES.default;
}

function addUserMessage(text) {
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `
    <div class="chat-bubble-msg">${escapeHtml(text)}</div>
    <span class="chat-time">${now}</span>
  `;
  el.chatMessages.appendChild(div);
  scrollChat();
}

function addAiMessage(md) {
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = 'chat-msg ai';
  div.innerHTML = `
    <div class="chat-bubble-msg">${parseMarkdown(md)}</div>
    <span class="chat-time">${now}</span>
  `;
  el.chatMessages.appendChild(div);
  scrollChat();
}

function addAiRecCard(item) {
  const div = document.createElement('div');
  div.className = 'chat-msg ai';
  const card = document.createElement('button');
  card.className = 'ai-rec-card';
  card.innerHTML = `
    <span class="ai-rec-icon">${item.emoji}</span>
    <div>
      <div class="ai-rec-name">${item.name}</div>
      <div class="ai-rec-price">₹${item.price}</div>
    </div>
  `;
  card.addEventListener('click', () => {
    addToCart(item.id, card);
    addAiMessage(`Great choice! **${item.name}** has been added to your cart 🛍`);
    openCart();
  });
  div.appendChild(card);
  el.chatMessages.appendChild(div);
  scrollChat();
}

function addTyping() {
  const div = document.createElement('div');
  div.className = 'chat-msg ai';
  div.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
  el.chatMessages.appendChild(div);
  scrollChat();
  return div;
}

function scrollChat() {
  el.chatMessages.scrollTop = el.chatMessages.scrollHeight;
}

// Simple markdown parser for bold and linebreaks
function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Voice Input Simulation ─────────────────────
const MOCK_VOICE_INPUTS = [
  "I'm feeling tired, what do you suggest?",
  "Something sweet please",
  "I need focus for studying",
  "What's your specialty?",
  "I want something cold",
];

function simulateVoice() {
  if (state.listening) return;
  state.listening = true;
  el.voiceBtn.classList.add('listening');
  el.micIcon.textContent = '🔴';
  showToast('🎙 Listening…');
  setTimeout(() => {
    state.listening = false;
    el.voiceBtn.classList.remove('listening');
    el.micIcon.textContent = '🎙';
    const input = MOCK_VOICE_INPUTS[Math.floor(Math.random() * MOCK_VOICE_INPUTS.length)];
    el.chatInput.value = input;
    sendMessage();
  }, 2200);
}

// ═══════════════════════════════════════════════
//   TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════
let toastTimer;
function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('show'), 3200);
}

// ═══════════════════════════════════════════════
//   RUN
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', init);
