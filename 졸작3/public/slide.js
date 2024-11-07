const next = document.querySelector("#next");
const prev = document.querySelector("#prev");

function handleScrollNext() {
  const cards = document.querySelector(".card-content");
  const scrollAmount = window.innerWidth / 2 > 600 ? window.innerWidth / 2 : window.innerWidth - 100;
  const maxScrollLeft = cards.scrollWidth - cards.clientWidth; // 최대 스크롤 위치
  cards.scrollLeft = Math.min(cards.scrollLeft + scrollAmount, maxScrollLeft); // 오른쪽으로 스크롤
}

function handleScrollPrev() {
  const cards = document.querySelector(".card-content");
  const scrollAmount = window.innerWidth / 2 > 600 ? window.innerWidth / 2 : window.innerWidth - 100;
  
  // 스크롤 이동 후 카드 컨테이너의 왼쪽 경계에 도달했는지 확인
  cards.scrollLeft = Math.max(cards.scrollLeft - scrollAmount, 0); // 왼쪽으로 스크롤
}

next.addEventListener("click", handleScrollNext);
prev.addEventListener("click", handleScrollPrev);
