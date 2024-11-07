function addToWishlist(event) {
  event.preventDefault(); // 기본 동작 방지
  event.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
  const card = event.target.closest(".card");

  if (card) {
    const url = card.getAttribute("data-url"); // 카드의 URL을 가져옴

    // 기존 찜 목록 불러오기
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // URL을 기준으로 중복 확인
    const isDuplicate = wishlist.some((item) => {
      const itemCard = document.createElement("div");
      itemCard.innerHTML = item; // HTML을 DOM 요소로 변환
      return itemCard.querySelector(".card").getAttribute("data-url") === url; // URL 비교
    });

    if (!isDuplicate) {
      wishlist.push(card.outerHTML);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert("찜 목록에 추가되었습니다.");
      updateWishlistUI(wishlist); // UI 업데이트
    } else {
      alert("이미 찜 목록에 추가된 항목입니다.");
    }
  }
}

// 카드 클릭 시 링크로 이동하게 설정
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", function () {
    const url = card.getAttribute("data-url"); // 카드의 data-url 속성에서 링크 가져오기
    if (url) {
      window.location.href = url; // 링크로 이동
    }
  });
});

// 찜 목록 UI 업데이트 함수
function updateWishlistUI(wishlist) {
  const wishlistContainer = document.getElementById("wishlistContainer"); // 찜 목록을 표시할 컨테이너의 ID
  wishlistContainer.innerHTML = ""; // 기존 내용 초기화
  wishlist.forEach((cardHTML) => {
    wishlistContainer.innerHTML += cardHTML; // 카드 추가
  });
  showWarningIcons(); // 아이콘 표시 함수 호출
}

// 마이페이지 로드 시 찜 목록 UI 업데이트
document.addEventListener("DOMContentLoaded", () => {
  // 로컬 스토리지에서 찜 목록 불러오기
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // 찜 목록 UI 업데이트
  updateWishlistUI(wishlist); // UI 업데이트

  // 느낌표 아이콘 표시
  showWarningIcons(); // 아이콘 표시 함수 호출
});

// 느낌표 아이콘 표시 함수
function showWarningIcons() {
  const today = new Date(); // 오늘 날짜
  const wishlistContainer = document.getElementById("wishlistContainer"); // 찜 목록 컨테이너
  const cards = wishlistContainer.querySelectorAll(".card"); // 찜 목록의 카드 선택

  cards.forEach((card) => {
    const deadline = new Date(card.dataset.deadline); // 카드의 데이터 속성에서 마감일 가져오기
    const timeDiff = deadline - today; // 남은 시간 계산
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 남은 일수 계산

    const warningIcon = card.querySelector(".warning-icon"); // 카드 내의 경고 아이콘 선택
    if (warningIcon) {
      if (daysLeft <= 5) {
        warningIcon.style.display = "inline"; // 아이콘 표시
      } else {
        warningIcon.style.display = "none"; // 아이콘 숨김
      }
    }
  });
}