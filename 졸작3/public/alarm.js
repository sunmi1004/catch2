document.addEventListener("DOMContentLoaded", function() {
    // 오늘 날짜를 가져옵니다.
    const today = new Date();

    // 모든 카드를 선택합니다.
    const cards = document.querySelectorAll('.card');

    // 알람 리스트와 카운트를 초기화합니다.
    const alarmList = document.getElementById('alarmList');
    const alarmCount = document.getElementById('alarmCount');
    let count = 0;

    // 각 카드를 순회하며 마감일을 체크합니다.
    cards.forEach(card => {
        // 카드의 마감일을 가져옵니다.
        const deadline = new Date(card.dataset.deadline);

        // 남은 일수를 계산합니다.
        const timeDiff = deadline - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 남은 일수

        // 남은 기간이 5일 이하라면 알람 아이콘에 추가합니다.
        if (daysLeft <= 5 && daysLeft >= 0) {
            count++;

            // 알람 리스트에 카드 제목을 추가합니다.
            const title = card.getAttribute('title');
            const listItem = document.createElement('li');
            listItem.textContent = title; // 카드 제목 표시
            alarmList.appendChild(listItem);
        }
    });

    // 알람 카운트 업데이트
    if (count > 0) {
        alarmCount.textContent = count;
        alarmCount.style.display = 'inline'; // 카운트 표시
    } else {
        alarmCount.style.display = 'none'; // 카운트 숨김
    }

    // 알람 박스를 토글하는 함수
// 알람 박스를 토글하는 함수
window.toggleAlarmBox = function() {
    const alarmBox = document.getElementById('alarmBox');
    alarmBox.style.display = (alarmBox.style.display === 'none' || alarmBox.style.display === '') ? 'block' : 'none';
};

});
