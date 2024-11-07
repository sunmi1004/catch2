
function addToWishlist(event) {
  // 기본 클릭 동작과 이벤트 전파 중지
  event.preventDefault();
  event.stopPropagation();

  // 클릭된 버튼의 부모 카드로 이동
  const card = event.target.closest(".card");
  if (card) {
    // 카드 ID나 정보를 저장하거나 처리를 수행할 수 있음
    console.log("Added to wishlist:", card.getAttribute("data-url"));
  }
}

document.querySelectorAll(".card").forEach(function (card) {
  // 카드 클릭 이벤트 리스너를 등록
  card.addEventListener("click", function (event) {
    // 클릭된 요소가 'wishlist-btn'인 경우에는 링크로 이동하지 않음
    if (event.target.classList.contains("wishlist-btn")) {
      return; // 버튼 클릭 시 카드 클릭 이벤트 중지
    }

    // data-url 속성의 값 가져오기
    const url = card.getAttribute("data-url");
    if (url) {
      // 현재 페이지에서 링크로 이동
      window.location.href = url; // 현재 페이지에서 링크로 이동
    }
  });
});

