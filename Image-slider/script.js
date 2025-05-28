const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.slider-button.left');
const nextBtn = document.querySelector('.slider-button.right');
const dotsContainer = document.querySelector('.dots-container');

let currentIndex = 0;
let slideInterval;

// Create dots dynamically
slides.forEach((_, index) => {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.display = i === index ? 'block' : 'none';
    dots[i].classList.toggle('active', i === index);
  });
  currentIndex = index;
}

function goToSlide(index) {
  showSlide(index);
  resetInterval();
}

function nextSlide() {
  let nextIndex = (currentIndex + 1) % slides.length;
  showSlide(nextIndex);
}

function prevSlide() {
  let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(prevIndex);
}

function startSlideShow() {
  slideInterval = setInterval(nextSlide, 4000); // Auto slide every 4 seconds
}

function resetInterval() {
  clearInterval(slideInterval);
  startSlideShow();
}

// Button event listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Initialize
showSlide(currentIndex);
startSlideShow();
