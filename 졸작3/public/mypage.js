document.addEventListener("DOMContentLoaded", function () {
  const wishlistContainer = document.getElementById("wishlist-container");
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // 찜 목록이 있을 경우 카드 표시
  if (wishlist.length > 0) {
    displayWishlist(wishlist);
  } else {
    wishlistContainer.innerHTML = "<p>찜 목록이 비어 있습니다.</p>";
  }

  function displayWishlist(wishlist) {
    // 기존 내용을 초기화
    wishlistContainer.innerHTML = "";

    wishlist.forEach(function (cardHTML, index) {
      const cardElement = document.createElement("div");
      cardElement.classList.add("wishlist-item");
      cardElement.innerHTML = `
                <div class="card-content" data-index="${index}">
                    ${cardHTML}
                </div>
            `;
      wishlistContainer.appendChild(cardElement);
    });
  }

  wishlistContainer.addEventListener("click", function (event) {
    // 하트 버튼 클릭 시 카드 삭제
    if (event.target.closest(".wishlist-btn")) {
      const cardElement = event.target.closest(".card-content");
      const cardIndex = parseInt(cardElement.getAttribute("data-index"), 10); // 정수로 변환
      location.reload();
      if (!isNaN(cardIndex)) {
        wishlist.splice(cardIndex, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        // 클릭한 버튼의 부모 요소를 찾아서 UI에서 제거
        cardElement.closest(".wishlist-item").remove(); // 해당 카드 항목 제거
      }
    }
  });
});
