document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const pageNumber = document.getElementById("page-number");

  let currentPage = 1;
  const cardsPerPage = 6;

  // 카드의 위치를 약간 조정
 const positions = [
    { top: "0px", left: "10px" }, // 첫 번째 카드
    { top: "0px", left: "470px" }, // 두 번째 카드
    { top: "0px", left: "930px" }, // 세 번째 카드
    { top: "500px", left: "10px" }, // 네 번째 카드, 위아래 간격을 조정
    { top: "500px", left: "470px" }, // 다섯 번째 카드, 위아래 간격을 조정
    { top: "500px", left: "930px" }, // 여섯 번째 카드, 위아래 간격을 조정
];

  showPage(currentPage);

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
    } else {
      currentPage = Math.ceil(cards.length / cardsPerPage);
    }
    showPage(currentPage);
  });

  nextButton.addEventListener("click", () => {
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
    } else {
      currentPage = 1;
    }
    showPage(currentPage);
  });

  function showPage(page) {
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;

    cards.forEach((card, index) => {
      if (index >= startIndex && index < endIndex) {
        card.style.display = "block"; // 카드를 보이게 함
        const position = positions[index % cardsPerPage];
        card.style.position = "absolute";
        card.style.top = position.top;
        card.style.left = position.left;
      } else {
        card.style.display = "none"; // 카드를 숨김
      }
    });

    pageNumber.textContent = page;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const url = this.getAttribute("data-url");
      if (url) {
        window.location.href = url;
      }
    });
  });
});

function resetCardPositions() {
  const visibleCards = document.querySelectorAll(
    ".card[style*='display: block']"
  );

  visibleCards.forEach((card, index) => {
    // 위치가 겹치지 않도록 positions 배열에서 좌표를 설정
    const position = positions[index % cardsPerPage];

    // 카드의 위치와 스타일을 명확히 지정
    card.style.position = "absolute";
    card.style.top = position.top;
    card.style.left = position.left;
    card.style.zIndex = 1; // 카드가 다른 카드 위로 올라오지 않도록 z-index 설정
  });
}
document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.getElementById("search-box");

    searchBox.addEventListener("input", function () {
      if (this.value === "") {
        // 검색창이 비워지면 페이지 새로고침
        location.reload();
      }
    });
  });
document.addEventListener("DOMContentLoaded", function () {
 
  
  // body에 로그인 상태 클래스 추가
  if (isLoggedIn) {
    document.body.classList.add('logged-in');
  } else {
    document.body.classList.remove('logged-in');
  }
});

