// 오늘 날짜를 가져옵니다.
const today = new Date();

// 모든 카드를 선택합니다.
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  // 각 카드의 마감일을 가져옵니다.
  const deadline = new Date(card.dataset.deadline);
  
  // 남은 일수를 계산합니다.
  const timeDiff = deadline - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 남은 일수

  // 남은 기간이 5일 이하라면 느낌표 아이콘을 표시합니다.
  if (daysLeft <= 5) {
    const warningIcon = card.querySelector('.warning-icon');
    warningIcon.style.display = 'inline'; // 아이콘 표시
  }
});
