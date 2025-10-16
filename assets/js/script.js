/*
====================================================
 Rawabi — Consolidated Scripts
 Source: index.html (all inline <script> moved here)
 Order preserved to avoid regressions. Uses: jQuery, Owl Carousel, GSAP.

 Sections
 1) HERO2 slider (stacked background items)
 2) Mobile Off-canvas Navbar
 3) Hero Background Slider (API exposed at window.__heroBgSlider)
 4) GSAP Scroll Animations (about/features)
 5) GSAP Plane Animation on Travel section
 6) Right-panel Carousel (main image/title/desc/counter + previews)
 7) Carousels: Top Destinations, Testimonials, Partners (OwlCarousel)
 8) Latest Tour Packages — mobile-only Load More control
 9) Destinations grid — responsive initial visibility + Load More
 10) Accordion Slider (India packages)
 11) Preloader and legacy card carousel glue (kept no-op safe)
 12) Stats counters with IntersectionObserver
====================================================
*/

// 1) HERO2 slider logic (exact stacked transition)
(function () {
	const slide = document.querySelector('.hero2-slide');
	const prev = document.querySelector('.hero2-prev');
	const next = document.querySelector('.hero2-next');
	if (!slide) return;

	function doNext() {
		const items = slide.querySelectorAll('.hero2-item');
		if (items.length < 2) return;
		slide.appendChild(items[0]);
	}
	function doPrev() {
		const items = slide.querySelectorAll('.hero2-item');
		if (!items.length) return;
		slide.prepend(items[items.length - 1]);
	}
	next?.addEventListener('click', doNext);
	prev?.addEventListener('click', doPrev);

	// auto-advance every 3s
	setInterval(doNext, 3000);
})();

// 2) Mobile off-canvas navbar (slide in from right)
(function () {
	const toggle = document.getElementById('home-nav-toggle');
	const menu = document.getElementById('home-nav-menu');
	if (!toggle || !menu) return;

	// Create dim overlay once
	let dim = document.querySelector('.home-nav-dim');
	if (!dim) {
		dim = document.createElement('div');
		dim.className = 'home-nav-dim';
		document.body.appendChild(dim);
	}

	function openMenu() {
		menu.classList.add('is-open');
		toggle.setAttribute('aria-expanded', 'true');
		dim.classList.add('is-visible');
		document.body.classList.add('nav-open');
	}
	function closeMenu() {
		menu.classList.remove('is-open');
		toggle.setAttribute('aria-expanded', 'false');
		dim.classList.remove('is-visible');
		document.body.classList.remove('nav-open');
	}
	function toggleMenu() {
		if (menu.classList.contains('is-open')) closeMenu(); else openMenu();
	}

	toggle.addEventListener('click', toggleMenu);
	dim.addEventListener('click', closeMenu);
	document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
})();



// 4) GSAP Scroll Animations (about/features)
try {
	gsap.registerPlugin(ScrollTrigger);

	gsap.from('.about-images img', {
		scrollTrigger: { trigger: '.about-section', start: 'top 80%' },
		y: 80,
		opacity: 0,
		stagger: 0.2,
		duration: 1,
		ease: 'power3.out'
	});

	gsap.from('.about-content', {
		scrollTrigger: { trigger: '.about-content', start: 'top 80%' },
		x: 100,
		opacity: 0,
		duration: 1,
		ease: 'power3.out'
	});

	gsap.from('.feature-box', {
		scrollTrigger: { trigger: '.features-section', start: 'top 85%' },
		y: 60,
		opacity: 0,
		stagger: 0.25,
		duration: 1,
		ease: 'power3.out'
	});
} catch (e) {
	// GSAP not loaded; skip animations gracefully.
}

// 5) GSAP Plane Animation on Travel section
try {
	gsap.registerPlugin(ScrollTrigger);
	gsap.fromTo('.plane-img',
		{ x: -180, y: 70, scale: 0.4, opacity: 0, rotate: -10 },
		{
			x: 0, y: 0, scale: 1, opacity: 1, rotate: 0,
			duration: 3, ease: 'power2.out',
			scrollTrigger: { trigger: '#travel-section', start: 'top 80%', toggleActions: 'play none none reverse' }
		}
	);
} catch (e) { /* noop */ }

// 6) Right-panel Carousel (content + previews + progress)
(function () {
	const DURATION = 3000; // ms per slide
	let currentIndex = 0;
	let intervalId;

	const mainImage = document.getElementById('main-image');
	const mainTitle = document.getElementById('main-title-text');
	const descriptionText = document.getElementById('description-text');
	const priceText = document.getElementById('price-text');
	const durationText = document.getElementById('duration-text');
	const counter = document.getElementById('counter');
	const prevBtn = document.getElementById('prev-btn');
	const nextBtn = document.getElementById('next-btn');
	const previewList = document.getElementById('preview-list');
	const progressLine = document.getElementById('progress-line');

	if (!mainImage || !mainTitle || !descriptionText || !priceText || !durationText || !counter || !previewList) return;

	const slides = [
		{
			number: 1,
			subtitle: 'Fall in love with',
			title: 'Turkey',
			description: 'Experience the ancient empires that have left their mark in world-famous ruins immerse yourself in blockbuster scenery by sea, land and air and feast on world-class gastronomy, celebrating the best of its regional bounty.',
			price: '₹ 81,500',
			duration: '5N/6D',
			mainImageUrl: 'assets/images/worldturkey.jpeg',
			previewImageUrl: 'assets/images/worldturkey.jpeg',
			previewTitle: 'Vietnam'
		},
		{
			number: 2,
			subtitle: 'Discover the heart of',
			title: 'Vietnam',
			description: 'Vietnam is a land of contrasts. It is home to some of the most beautiful beach destinations in the world, like Da Nang, Nha Trang, or Phu Quoc Island, where crystal-clear waters and white sands create a tropical paradise.',
			price: '₹ 81,500',
			duration: '4N/5D',
			mainImageUrl: 'assets/images/vietnam-world.jpg',
			previewImageUrl: 'assets/images/vietnam-world.jpg',
			previewTitle: 'Oman'
		},
		{
			number: 3,
			subtitle: 'Hike the majestic',
			title: 'Oman',
			description: 'Oman is the land of adventures, starting from exploring the Hoota Cave, going through the experience of zip-lining in Musandam Governorate. The Sultanate of Oman is globally renowned for its unique culture and rich heritage',
			price: '₹ 85,000',
			duration: '5N/6D',
			mainImageUrl: 'assets/images/oman-world.jpg',
			previewImageUrl: 'assets/images/oman-world.jpg',
			previewTitle: 'Indonesia'
		},
		{
			number: 4,
			subtitle: 'Visit the seaside',
			title: 'Indonesia',
			description: 'Volcanic landscapes, beautiful beaches, exotic wildlife and a varied cultural heritage make this string of islands an appealing vacation destination. Indonesia is home to a wide range of religions, races and cultures.',
			price: '₹ 64,000',
			duration: '4N/5D',
			mainImageUrl: 'assets/images/indonasia-world.jpg',
			previewImageUrl: 'assets/images/indonasia-world.jpg',
			previewTitle: 'Malaysia'
		},
		{
			number: 5,
			subtitle: 'Discover the vibrant',
			title: 'Malaysia',
			description: 'Malay Peninsula and the island of Borneo. It’s known for its beaches, rainforests and colonial buildings, busy shopping districts such as Bukit Bintang and skyscrapers such as the iconic, 451m-tall Petronas Twin Towers',
			price: '₹ 51,500',
			duration: '3N/4D',
			mainImageUrl: 'assets/images/malaysia-world.jpg',
			previewImageUrl: 'assets/images/malaysia-world.jpg',
			previewTitle: 'Thailand'
		},
		{
			number: 6,
			subtitle: 'Relax in paradise',
			title: 'Thailand',
			description: 'Thailand is one of the world’s most renowned holiday destinations, with a wide variety of things to see and do, from culture, religion, food, nature, water, adventure, sports and also relaxing activities.',
			price: '₹ 35,000',
			duration: '2N/3D',
			mainImageUrl: 'assets/images/tailand-world.jpg',
			previewImageUrl: 'assets/images/tailand-world.jpg',
			previewTitle: 'Turkey'
		}
        
	];

	const formatNumber = (num) => String(num).padStart(2, '0');

	function animateProgress() {
		try {
			gsap.killTweensOf(progressLine);
			gsap.set(progressLine, { scaleX: 0 });
			gsap.to(progressLine, { scaleX: 1, duration: DURATION / 1000, ease: 'linear' });
		} catch (e) { /* if GSAP missing, skip progress anim */ }
	}

	function updateCarousel(newIndex) {
		clearInterval(intervalId);
		try { gsap.killTweensOf(progressLine); } catch (e) {}

		newIndex = (newIndex + slides.length) % slides.length;
		const newSlide = slides[newIndex];

		const exploreBtnSpan = document.querySelector('.explore-btn span:first-child');

		try {
			gsap.timeline()
				.to([mainTitle, descriptionText, priceText, durationText, exploreBtnSpan], { opacity: 0, y: 10, duration: 0.3 })
				.call(() => {
					mainTitle.textContent = newSlide.title;
					descriptionText.textContent = newSlide.description;
					priceText.innerHTML = `<span>${newSlide.price}</span>`;
					durationText.innerHTML = `<i class="fa-regular fa-clock"></i><span> ${newSlide.duration}</span>`;
					counter.textContent = formatNumber(newSlide.number);
					if (exploreBtnSpan) {
						exploreBtnSpan.textContent = `EXPLORE ${newSlide.title.toUpperCase().replace(/\s/g, ' ')}`;
					}
				})
				.to([mainTitle, descriptionText, priceText, durationText, exploreBtnSpan], { opacity: 1, y: 0, duration: 0.5 });
		} catch (e) {
			// Fallback without GSAP
			mainTitle.textContent = newSlide.title;
			descriptionText.textContent = newSlide.description;
			priceText.innerHTML = `<span>${newSlide.price}</span>`;
			durationText.innerHTML = `<i class="fa-regular fa-clock"></i><span> ${newSlide.duration}</span>`;
			counter.textContent = formatNumber(newSlide.number);
			if (exploreBtnSpan) exploreBtnSpan.textContent = `EXPLORE ${newSlide.title.toUpperCase().replace(/\s/g, ' ')}`;
		}

		// Main image crossfade
		try {
			gsap.to(mainImage, {
				opacity: 0, duration: 0.4, onComplete: () => {
					mainImage.src = newSlide.mainImageUrl;
					try { gsap.to(mainImage, { opacity: 1, duration: 0.6 }); } catch (e) { mainImage.style.opacity = '1'; }
				}
			});
		} catch (e) {
			mainImage.src = newSlide.mainImageUrl;
		}

		// Sync hero background slider to the same index
		if (window.__heroBgSlider && typeof window.__heroBgSlider.goto === 'function') {
			window.__heroBgSlider.goto(newIndex);
		}

		document.querySelectorAll('.preview-item').forEach((item, i) => {
			const slideIndex = (currentIndex + 1 + i) % slides.length;
			const slide = slides[slideIndex];
			item.dataset.index = String(slideIndex);
			const img = item.querySelector('img');
			const title = item.querySelector('.preview-item-title');
			if (img) img.src = slide.mainImageUrl;
			if (img) img.alt = slide.title;
			if (title) title.textContent = slide.title;
			item.onclick = () => { updateCarousel(slideIndex); };
		});

		currentIndex = newIndex;
		setTimeout(() => { startAutoAdvance(); }, 1000);
	}

	function autoAdvance() {
		const nextIndex = (currentIndex + 1) % slides.length;
		updateCarousel(nextIndex);
		animateProgress();
	}

	function startAutoAdvance() {
		animateProgress();
		intervalId = setInterval(autoAdvance, DURATION);
	}

	function initializePreviews() {
		for (let i = 0; i < 3; i++) {
			const item = document.createElement('div');
			item.className = 'preview-item';
			item.dataset.index = String((currentIndex + 1 + i) % slides.length);
			const slideIndex = (currentIndex + 1 + i) % slides.length;
			const slide = slides[slideIndex];
			item.innerHTML = `
				<img src="${slide.mainImageUrl}" alt="${slide.title}">
				<div class="preview-item-content">
					<p class="preview-item-title">${slide.title}</p>
				</div>`;
			item.addEventListener('click', () => { updateCarousel(slideIndex); });
			previewList.appendChild(item);
		}
	}

	document.addEventListener('DOMContentLoaded', () => {
		initializePreviews();
		updateCarousel(0);
		prevBtn?.addEventListener('click', () => updateCarousel(currentIndex - 1));
		nextBtn?.addEventListener('click', () => updateCarousel(currentIndex + 1));
	});

	// Helper retained from original (unused here, can be used elsewhere)
	function base64ToArrayBuffer(base64) {
		const binaryString = atob(base64);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
		return bytes.buffer;
	}
})();

// 7) jQuery document.ready — OwlCarousel instances
$(document).ready(function () {
	// Top Destinations carousel
	const $top = $('.top-dest-carousel');
	$top.owlCarousel({
		loop: true,
		margin: 24,
		nav: false,
		dots: true,
		autoplay: true,
		autoplayTimeout: 3000,
		autoplayHoverPause: true,
		smartSpeed: 650,
		responsive: { 0: { items: 3 }, 576: { items: 3 }, 992: { items: 3 } }
	});
	$('.td-prev').on('click', function () { $top.trigger('prev.owl.carousel'); });
	$('.td-next').on('click', function () { $top.trigger('next.owl.carousel'); });

	// Testimonial carousel (separate instance)
	$('.testimonial-section .owl-carousel').owlCarousel({
		loop: true,
		margin: 20,
		nav: false,
		dots: true,
		autoplay: true,
		autoplayTimeout: 2500,
		autoplayHoverPause: true,
		items: 1,
		animateOut: 'fadeOut',
		smartSpeed: 600
	});

	// Partners carousel (endless loop)
	$('.partners-carousel').owlCarousel({
		loop: true,
		margin: 24,
		nav: false,
		dots: false,
		autoplay: true,
		autoplayTimeout: 1800,
		autoplaySpeed: 650,
		autoplayHoverPause: false,
		slideTransition: 'linear',
		responsive: { 0: { items: 2 }, 576: { items: 3 }, 992: { items: 4 } }
	});
});

// 8) Latest Tour Packages: mobile Load More control
(function () {
	const isMobile = () => window.innerWidth <= 575;
	const grid = document.querySelector('.mix-dests .md-grid');
	if (!grid) return;

	// Create a button dynamically to avoid changing HTML markup
	let btn = document.getElementById('md-load-more');
	if (!btn) {
		btn = document.createElement('button');
		btn.id = 'md-load-more';
		btn.className = 'btn-dest-more';
		btn.textContent = 'Load More';
		const section = document.getElementById('latest-packages');
		if (section) section.appendChild(btn);
	}

	function applyMdVisibility() {
		const cards = Array.from(grid.querySelectorAll('.md-card'));
		cards.forEach(c => c.classList.remove('hidden'));
		if (isMobile()) {
			cards.forEach((c, i) => { if (i >= 4) c.classList.add('hidden'); });
			const hiddenCount = cards.filter(c => c.classList.contains('hidden')).length;
			btn.style.display = hiddenCount > 0 ? 'inline-block' : 'none';
		} else {
			btn.style.display = 'none';
		}
	}

	function revealAllMd() {
		grid.querySelectorAll('.md-card.hidden').forEach(c => c.classList.remove('hidden'));
		btn.style.display = 'none';
	}

	btn.addEventListener('click', revealAllMd);
	window.addEventListener('resize', () => {
		clearTimeout(window.__mdResizeT);
		window.__mdResizeT = setTimeout(applyMdVisibility, 150);
	});

	applyMdVisibility();
})();

// 9) Destinations: responsive initial counts + Load More
(function () {
	const grid = document.getElementById('destinations-grid');
	if (!grid) return;
	const btn = document.getElementById('destinations-load-more');
	if (!btn) return;

	function applyInitialVisibility() {
		const cards = Array.from(grid.querySelectorAll('.destination-card'));
		cards.forEach(c => c.classList.remove('hidden'));

		const w = window.innerWidth;
		let showCount;
		if (w <= 575) showCount = 3;     // mobile
		else if (w <= 992) showCount = 4; // tablet
		else showCount = cards.length;    // desktop: show all

		cards.forEach((c, i) => { if (i >= showCount) c.classList.add('hidden'); });

		const hiddenCount = cards.filter(c => c.classList.contains('hidden')).length;
		if (hiddenCount === 0) {
			btn.style.display = 'none';
		} else {
			btn.style.display = 'inline-block';
			btn.textContent = window.innerWidth <= 575 ? 'Load More' : 'More Packages';
		}
	}

	function revealAll() {
		grid.querySelectorAll('.destination-card.hidden').forEach(c => c.classList.remove('hidden'));
		btn.style.display = 'none';
	}

	btn.addEventListener('click', revealAll);
	window.addEventListener('resize', () => {
		clearTimeout(window.__destResizeT);
		window.__destResizeT = setTimeout(applyInitialVisibility, 150);
	});

	applyInitialVisibility();
})();

// 10) Accordion Slider (India packages)
class AccordionSlider {
	constructor() {
		this.slides = document.querySelectorAll('.slide');
		this.prevBtn = document.querySelector('.nav-prev');
		this.nextBtn = document.querySelector('.nav-next');
		this.currentIndex = -1;
		this.init();
	}
	init() {
		this.slides.forEach((slide, index) => {
			slide.addEventListener('click', () => this.setActiveSlide(index));
			slide.addEventListener('mouseenter', () => this.setActiveSlide(index));
		});
		this.prevBtn?.addEventListener('click', () => this.previousSlide());
		this.nextBtn?.addEventListener('click', () => this.nextSlide());
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft') this.previousSlide();
			if (e.key === 'ArrowRight') this.nextSlide();
		});
	}
	setActiveSlide(index) {
		if (this.currentIndex === index) {
			this.slides.forEach((slide) => slide.classList.remove('active'));
			this.currentIndex = -1;
		} else {
			this.slides.forEach((slide) => slide.classList.remove('active'));
			this.slides[index].classList.add('active');
			this.currentIndex = index;
		}
	}
	nextSlide() {
		const nextIndex = this.currentIndex === -1 ? 0 : (this.currentIndex + 1) % this.slides.length;
		this.setActiveSlide(nextIndex);
	}
	previousSlide() {
		const prevIndex = this.currentIndex === -1 ? this.slides.length - 1 : (this.currentIndex - 1 + this.slides.length) % this.slides.length;
		this.setActiveSlide(prevIndex);
	}
}
document.addEventListener('DOMContentLoaded', () => { new AccordionSlider(); });

// 11) Preloader and legacy card carousel glue (kept no-op safe)
document.addEventListener('DOMContentLoaded', () => {
	const carouselTrack = document.getElementById('card-carousel');
	const dynamicBgImg = document.getElementById('dynamic-bg-img');
	const homePreloader = document.getElementById('home-preloader');
	// const navToggle = document.getElementById('home-nav-toggle');
	// const navMenu = document.getElementById('home-nav-menu');

	// Preloader: show for 3s, then fade out
	setTimeout(() => {
		if (homePreloader) {
			homePreloader.classList.add('home-preloader--hide');
			setTimeout(() => homePreloader.remove(), 550);
		}
	}, 3000);

	// Cards / Carousel setup (old hero)
	if (!carouselTrack || !dynamicBgImg) {
		return; // old hero removed, skip this block but keep nav/preloader
	}

	const allCardsInTrack = Array.from(carouselTrack.querySelectorAll('.trip-card'));
	const originalCards = allCardsInTrack.slice(0, 4);
	const cardCount = originalCards.length;
	const cardWidth = 200; // 180px + 20px gap
	let currentIndex = 0;
	let carouselTimer = null;

	// Clone first few cards for loop
	const clonesNeeded = 3;
	for (let i = 0; i < clonesNeeded; i++) {
		const clone = originalCards[i]?.cloneNode?.(true);
		if (clone) {
			clone.classList.add('clone');
			carouselTrack.appendChild(clone);
		}
	}

	// Transition helper: expand from the card's image position to the hero background
	function playExpandFromCard(newSrc, fromRect) {
		const heroImgRect = dynamicBgImg.getBoundingClientRect();
		const overlay = document.createElement('div');
		overlay.className = 'home-hero-transition';
		const overlayImg = document.createElement('img');
		overlayImg.src = newSrc;
		overlay.appendChild(overlayImg);
		document.body.appendChild(overlay);
		// Start at preview position/size (fallback to small center if not available)
		if (fromRect) {
			overlay.style.top = fromRect.top + 'px';
			overlay.style.left = fromRect.left + 'px';
			overlay.style.width = fromRect.width + 'px';
			overlay.style.height = fromRect.height + 'px';
		} else {
			const vw = Math.min(window.innerWidth * 0.3, 200);
			const vh = vw * 0.66;
			overlay.style.top = (window.innerHeight / 2 - vh / 2) + 'px';
			overlay.style.left = (window.innerWidth / 2 - vw / 2) + 'px';
			overlay.style.width = vw + 'px';
			overlay.style.height = vh + 'px';
		}
		// Force style calc
		overlay.getBoundingClientRect();
		// Animate to hero image bounds
		requestAnimationFrame(() => {
			overlay.style.top = heroImgRect.top + 'px';
			overlay.style.left = heroImgRect.left + 'px';
			overlay.style.width = heroImgRect.width + 'px';
			overlay.style.height = heroImgRect.height + 'px';
			overlay.style.borderRadius = '0px';
		});
		// After transition completes, swap bg and remove overlay
		setTimeout(() => {
			dynamicBgImg.style.opacity = '0';
			const handler = () => { dynamicBgImg.removeEventListener('transitionend', handler); };
			dynamicBgImg.addEventListener('transitionend', handler);
			dynamicBgImg.src = newSrc;
			setTimeout(() => { dynamicBgImg.style.opacity = '1'; }, 50);
			overlay.style.opacity = '0';
			setTimeout(() => overlay.remove(), 350);
		}, 620);
	}

	function updateActiveState(index) {
		const actualIndex = cardCount ? index % cardCount : 0;
		const nextCard = originalCards[actualIndex];
		if (!nextCard) return;
		const nextBgSrc = nextCard.getAttribute('data-bg-img');
		// Transition effect
		const imgEl = nextCard.querySelector('img');
		const fromRect = imgEl ? imgEl.getBoundingClientRect() : null;
		if (nextBgSrc) playExpandFromCard(nextBgSrc, fromRect);
		if (window.__heroBgSlider && typeof window.__heroBgSlider.goto === 'function') {
			window.__heroBgSlider.goto(actualIndex);
		}
		document.querySelector('.trip-card.active')?.classList.remove('active');
		nextCard.classList.add('active');
	}

	// Initial: set hero without animation
	if (originalCards.length > 0) {
		const firstSrc = originalCards[0].getAttribute('data-bg-img');
		if (firstSrc) dynamicBgImg.src = firstSrc;
		originalCards[0].classList.add('active');
	}

	// Manual click: expand from clicked card image
	allCardsInTrack.forEach(card => {
		card.addEventListener('click', function () {
			const newBgSrc = this.getAttribute('data-bg-img');
			const imgEl = this.querySelector('img');
			const fromRect = imgEl ? imgEl.getBoundingClientRect() : null;
			if (newBgSrc) playExpandFromCard(newBgSrc, fromRect);
			if (!this.classList.contains('clone')) {
				document.querySelector('.trip-card.active')?.classList.remove('active');
				this.classList.add('active');
				currentIndex = originalCards.indexOf(this);
				if (window.__heroBgSlider && typeof window.__heroBgSlider.goto === 'function') {
					window.__heroBgSlider.goto(currentIndex);
				}
			}
		});
	});

	// Auto-scroll
	function moveCarousel() {
		currentIndex++;
		updateActiveState(currentIndex);
		carouselTrack.style.transition = 'transform 0.5s ease-in-out';
		carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
		if (currentIndex >= cardCount) {
			setTimeout(() => {
				carouselTrack.style.transition = 'none';
				currentIndex = 0;
				carouselTrack.style.transform = 'translateX(0)';
				const firstSrc = originalCards[0]?.getAttribute('data-bg-img');
				if (firstSrc) dynamicBgImg.src = firstSrc;
				document.querySelector('.trip-card.active')?.classList.remove('active');
				originalCards[0]?.classList.add('active');
			}, 500);
		}
	}

	const startCarousel = () => {
		if (carouselTimer) clearInterval(carouselTimer);
		carouselTimer = setInterval(moveCarousel, 3500);
	};
	// If preloader exists, start after it; otherwise start immediately
	if (homePreloader) setTimeout(startCarousel, 3600); else startCarousel();
});

// 12) Stats divider counters: animate each time the section is visible
(function () {
	const box = document.getElementById('stats-counters');
	if (!box) return;
	const counters = Array.from(box.querySelectorAll('.counter'));
	const durations = { slow: 1600, fast: 900 };
	let active = [];

	function animate(el) {
		const target = parseInt(el.getAttribute('data-target'), 10) || 0;
		const start = 0;
		const duration = target > 500 ? durations.slow : durations.fast;
		const t0 = performance.now();
		function step(t) {
			const p = Math.min(1, (t - t0) / duration);
			const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
			const val = Math.floor(start + (target - start) * eased);
			el.textContent = val.toLocaleString();
			if (p < 1) {
				const id = requestAnimationFrame(step);
				active.push(id);
			}
		}
		const id = requestAnimationFrame(step);
		active.push(id);
	}

	function reset() {
		active.forEach(id => cancelAnimationFrame(id));
		active = [];
		counters.forEach(c => c.textContent = '0');
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				reset();
				counters.forEach(animate);
			} else if (entry.intersectionRatio === 0) {
				reset();
			}
		});
	}, { threshold: [0, 0.45] });

	observer.observe(box);
})();

