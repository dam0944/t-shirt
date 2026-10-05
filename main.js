var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var PAPER = '#f7f2e8';
var INK   = '#1e1a15';

// prefix data
var data = [
  { name: 'Bloom', image: 'picture/t-shirt-5.png', bg: '#9d1c52', textMode: 'light' },
  { name: 'Chalk', image: 'picture/t-shirt-1.png', bg: '#e7e2d4', textMode: 'dark'  },
  { name: 'Sand',  image: 'picture/t-shirt-3.png', bg: '#cebb79', textMode: 'dark'  },
  { name: 'Slate', image: 'picture/t-shirt-4.png', bg: '#5D828D', textMode: 'light' },
  { name: 'Umber', image: 'picture/t-shirt-2.png', bg: '#1f1b18', textMode: 'light' }
];
var N = data.length;

// state
var currentIndex = 0;
var mainIsA      = true;   
var animating    = false;

// dom element
var hero        = document.getElementById('hero');
var stageA      = document.getElementById('stageA');
var stageB      = document.getElementById('stageB');
var stageShadow = document.getElementById('stageShadow');
var priceNow    = document.getElementById('priceNow');
var colorName   = document.getElementById('colorName');
var dotsWrap    = document.getElementById('dots');
var prevBtn     = document.getElementById('prevBtn');
var nextBtn     = document.getElementById('nextBtn');

// function for create HTML 
function shirtIMG(src, alt) {
  var img = document.createElement('img');   // <image class="garment-img" src="" />
  img.className = 'garment-img';
  img.src = src;
  img.alt = alt || '';
  img.draggable = false;
  return img;
}

function preloadImages(list) {
  list.forEach(function (src) {
    var img = new Image();
    img.src = src;
  });
}

function paint(el, theme) {
  var img = el.querySelector('img');
  if (img) {
    img.src = theme.image;
    img.alt = 'Hally tee — ' + theme.name;
  }
}

var idleTweens = {};

function startIdle(el, amt) {
  stopIdle(el);
  if (reduced) return;
  idleTweens[el.id] = gsap.to(el, {
    rotation: amt,
    y: '+=9',
    duration: 2.4 + Math.random() * 0.6,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    transformOrigin: 'top center'
  });
}

function stopIdle(el) {
  if (idleTweens[el.id]) {
    idleTweens[el.id].kill();
    delete idleTweens[el.id];
  }
}

function initIdle() {
  startIdle(stageA, 2.3);
  startIdle(stageB, -2.3);
  if (!reduced) {
    gsap.to(stageShadow, {
      scaleX: 0.9,
      opacity: 0.45,
      duration: 2.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }
}

// function for change them of hero section
function applyTheme(theme, instant) {
  if (instant) { // 
    gsap.set(hero, 
      { 
        backgroundColor: theme.bg 
      }
    );
    gsap.set('.tt', 
      { 
        color: theme.textMode === 'light' ? PAPER : INK 
      }
    );
  } else {
    gsap.to(hero, 
      { 
        backgroundColor: theme.bg, 
        duration: 0.9, 
        ease: 'power2.inOut' 
      }
    );
    gsap.to('.tt', 
      { 
        color: theme.textMode === 'light' ? PAPER : INK, 
        duration: 0.6,
        ease: 'power1.inOut' 
      }
    );
  }
  colorName.textContent = theme.name; // id= "colorName"
  dots.forEach(function (dot, i) {
    dot.classList.toggle('is-active', i === currentIndex);
  });
}

data.forEach(function (theme, i) {
  var dot = document.createElement('button');

  dot.className = 'dot' + (i === 0 ? ' is-active' : '');
  dot.setAttribute('role', 'tab');
  dot.setAttribute('aria-label', 'Show ' + theme.name + ' colorway');

  dot.addEventListener('click', function () {
    if (animating || i === currentIndex) return;

    var diff = i - currentIndex;  
    var forward = ((diff + N) % N) <= N / 2;

    forward ? next() : prev();
  });
  dotsWrap.appendChild(dot);
});

var dots = Array.prototype.slice.call(dotsWrap.children);

function render(direction) {
  var mainEl  = mainIsA ? stageA : stageB;
  var thumbEl = mainIsA ? stageB : stageA;

  // Thumb previews the next item in the same direction
  var previewIndex = (currentIndex + direction + N) % N;

  applyTheme(data[currentIndex], false);
  stopIdle(mainEl);
  stopIdle(thumbEl);

  // Load the new current image into the thumb
  paint(thumbEl, data[currentIndex]);
  var flipState = Flip.getState(thumbEl, { props: 'opacity' });

  gsap.to(mainEl, {
    opacity: 0,
    x: direction > 0 ? 260 : -260,
    y: direction > 0 ? 160 : -160,
    scale: 0.55,
    rotation: direction > 0 ? 12 : -12, // Ternary operator = condition  ?  true : false
    duration: reduced ? 0.01 : 0.45,
    ease: 'power2.in'
  });

  // Promote thumb to main
  thumbEl.classList.remove('slot-thumb');
  thumbEl.classList.add('slot-main');

  // Directional entrance tilt so forward/back feel distinct
  gsap.set(thumbEl, { rotation: direction > 0 ? 10 : -10 });
  gsap.to(thumbEl, { rotation: 0, duration: reduced ? 0.01 : 0.7, ease: 'power3.out' });

  Flip.from(flipState, {
    duration: reduced ? 0.01 : 0.7,
    ease: 'power3.inOut',
    scale: true,
    onComplete: function () {
     
      mainEl.classList.remove('slot-main');
      mainEl.classList.add('slot-thumb');
    
      paint(mainEl, data[previewIndex]);  

      gsap.set(mainEl, { 
        x: 0,
        y: 0,
        rotation: 0, 
        opacity: 1, 
        scale: 1 
      }
    );

      mainIsA = !mainIsA;
      animating = false;

      startIdle(thumbEl, thumbEl === stageA ? 2.3 : -2.3);  
      startIdle(mainEl, mainEl === stageA ? 2.3 : -2.3);
    }
  });

  gsap.fromTo(stageShadow,
    { 
      scaleX: 0.75, 
      opacity: 0.3 
    },
    { 
      scaleX: 1, 
      opacity: 0.55, 
      duration: reduced ? 0.01 : 0.65, 
      ease: 'elastic.out(1, 0.45)', 
      delay: 0.25 
    }
  );
}

function next() {
  if (animating) return;
  animating = true;
  currentIndex = (currentIndex + 1) % N;
  render(1);
}

function prev() {
  if (animating) return;
  animating = true;
  currentIndex = (currentIndex - 1 + N) % N;
  render(-1);
}

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

[stageA, stageB].forEach(function (el) {
  el.addEventListener('click', function () {
    if (animating) return;
    if (el.classList.contains('slot-thumb')) next();
  });
});

Observer.create({
  target: '#hero-content',
  type: 'wheel,touch',
  wheelSpeed: 1,
  tolerance: 10,
  preventDefault: true,
  onUp:    function () { prev(); },
  onDown:  function () { next(); },
  onLeft:  function () { next(); },
  onRight: function () { prev(); }
});

Draggable.create([stageA, stageB], {
  type: 'x,y',
  bounds: { 
    minX: -60, 
    maxX: 60, 
    minY: -24, 
    maxY: 70 
  },
  allowContextMenu: true,
  onPress: function () {
    if (this.target.classList.contains('slot-thumb')) {
      this.endDrag();
      return;
    }
    stopIdle(this.target);
    gsap.killTweensOf(this.target);
  },
  onDrag: function () {
    gsap.set(this.target, { rotation: this.x * 0.14 });
  },
  onDragEnd: function () {
    var el = this.target;
    gsap.to(el, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: reduced ? 0.01 : 1.1,
      ease: 'elastic.out(1,.32)',
      onComplete: function () {
        startIdle(el, el === stageA ? 2.3 : -2.3);
      }
    });
  }
});

// connect event to html element 
document.querySelectorAll('.pill').forEach(function (pill) {
  pill.addEventListener('click', function () {
    document.querySelectorAll('.pill').forEach(function (p) { 
      p.classList.remove('is-active');   //  class = "pill is-active"  =>  class = "pill"
    });
    pill.classList.add('is-active');   // class = "pill"  =>  class = "pill is-active"
    gsap.fromTo(pill, 
      { 
        scale: 0.82 
      }, 
      { 
        scale: 1, 
        duration: 0.5, 
        ease: 'back.out(3)' 
      } 
    );
  });
});

preloadImages(data.map(function (t) { return t.image; }));
stageA.appendChild(shirtIMG(data[0].image, 'Hally tee — ' + data[0].name));
stageB.appendChild(shirtIMG(data[1].image, 'Hally tee — ' + data[1].name));
applyTheme(data[0], true);

// entrance animation timeline for the page load    
var tl = gsap.timeline({ defaults: { 
  ease: 'power3.out' 
  },
  delay: 0.15 
});

tl.from('#nav', { 
    y: -30, 
    opacity: 0, 
    duration: 0.6 
  })
  .from('.navbar-link', { 
    opacity: 0, 
    y: -8, 
    stagger: 0.06, 
    duration: 0.4 
  }, '-=.3')
  .from('.navbar-icons .icon-btn', { 
    opacity: 0, 
    scale: 0.6, 
    stagger: 0.08, 
    duration: 0.4, 
    ease: 'back.out(2)' 
  }, '-=.3')
  .from('.eyebrow', { 
    opacity: 0, 
    y: 14, 
    duration: 0.5 
  }, '-=.2')
  .from('.headline .line', { 
    opacity: 0, 
    y: 34, 
    duration: 0.75, 
    stagger: 0.1, 
    ease: 'power4.out' 
  }, '-=.25')
  .from('.sub', { 
    opacity: 0, 
    y: 16, 
    duration: 0.6 
  }, '-=.4')
  .from('.cta', { 
    opacity: 0, 
    y: 10, 
    scale: 0.92, 
    duration: 0.55, 
    ease: 'back.out(1.8)' 
  }, '-=.35')
  .from('.social-row a', { 
    opacity: 0, 
    y: 12, 
    stagger: 0.07, 
    duration: 0.45, 
    clearProps: 'opacity,transform' 
  }, '-=.25')
  .from('#stageA img', { 
    y: -40, 
    opacity: 0, 
    scale: 0.92, 
    duration: 0.75, 
    ease: 'back.out(1.4)' 
  }, '-=.5')
  .from('#stageShadow', { 
    scaleX: 0.4, 
    opacity: 0, 
    duration: 0.6 
  }, '-=.4')
  .from('.rail-btn', { 
    opacity: 0, 
    scale: 0.5, 
    stagger: 0.1, 
    duration: 0.5, 
    ease: 'back.out(2)' 
  }, '-=.5')
  .from('.tagline', { 
    opacity: 0, 
    y: 10, 
    duration: 0.5 
  }, '-=.4')
  .from('.dot', { 
    opacity: 0, 
    scale: 0, 
    stagger: 0.06, 
    duration: 0.35, 
    ease: 'back.out(2)' 
  }, '-=.35')
  .from('.price-row, .price-was, .size-label', { 
    opacity: 0, 
    x: 16, 
    duration: 0.5, 
    stagger: 0.08 
  }, '-=.9')
  .from('.pill', { 
    opacity: 0, 
    y: 10, 
    scale: 0.7, 
    stagger: 0.07, 
    duration: 0.4, 
    ease: 'back.out(2)' 
  }, '-=.45')
  .from('.drag-hint', { 
    opacity: 0, 
    duration: 0.5 
  }, '-=.2')
  .from('.social-row a', { 
    opacity: 0, 
    y: 12, 
    stagger: 0.07, 
    duration: 0.45, 
    clearProps: 'opacity,transform' 
  }, '-=.8')
  .from('#stageB', { 
    opacity: 0, 
    scale: 0.6, 
    duration: 0.5, 
    ease: 'back.out(1.6)' 
  }, '-=.9')
  .add(initIdle, '-=.1');

// scroll effect
ScrollTrigger.create({
  start: 'top -1',
  end: 99999,
  toggleClass: { 
    targets: '#nav', 
    className: 'is-scrolled' 
  }
});

if (!reduced) {
  gsap.to(['#hero-left', '#hero-right'], {
    yPercent: -10,
    opacity: 0.2,
    ease: 'none',
    scrollTrigger: { 
      trigger: '#hero', 
      start: 'top top', 
      end: '65% top', 
      scrub: true 
    }
  });
}

