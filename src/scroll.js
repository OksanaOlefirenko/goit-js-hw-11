export { onScroll, onBtnTop }

const btnTop = document.querySelector('.button-top');

window.addEventListener('scroll', onScroll);
btnTop.addEventListener('click', onBtnTop);

function onScroll() {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;
    console.log(scrolled, coords);

  if (scrolled > coords) {
    btnTop.classList.add('button-top--visible')
    };
  if (scrolled < coords) {
    btnTop.classList.remove('button-top--visible')
    };
};

function onBtnTop() {
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
};