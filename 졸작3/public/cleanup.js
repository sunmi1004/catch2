document.addEventListener("DOMContentLoaded", () => {
  markExpiredCards(); // 페이지 로드 시 카드 상태 확인
});

// 카드 마감 상태 확인 함수
function markExpiredCards() {
  const currentDate = new Date();
  const cardElements = document.querySelectorAll(".card");

  cardElements.forEach((card) => {
    const deadline = card.getAttribute("data-deadline");
    const cardDate = new Date(deadline);

    if (cardDate < currentDate) {
      // 카드 배경색 변경
      card.style.backgroundColor = "lightgray"; // 회색으로 변경
      card.style.color = "darkgray"; // 텍스트 색상도 어두운 회색으로 변경
      card.style.textDecoration = "line-through"; // 텍스트에 취소선 추가

      // 느낌표 아이콘 숨기기
      const wishlistButton = card.querySelector(".wishlist-btn");
      if (wishlistButton) {
        wishlistButton.style.display = "none"; // 버튼 숨기기
      }

      // warning-icon 숨기기
      const warningIcon = card.querySelector(".warning-icon");
      if (warningIcon) {
        warningIcon.style.display = "none"; // warning-icon 숨기기
      }
    }
  });
}
