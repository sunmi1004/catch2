function searchCards() {
            let input = document.getElementById('search').value.toLowerCase();
            let cards = document.getElementsByClassName('card');

            for (let i = 0; i < cards.length; i++) {
                let card = cards[i];
                let text = card.textContent.toLowerCase();

                if (text.includes(input)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            }
        }

        function searchCards() {
            let input = document.getElementById('search').value.toLowerCase();
            let cards = document.getElementsByClassName('card');
        
            // 검색창이 비어 있을 때 페이지 새로고침
            if (input.trim() === "") {
                location.reload();
                return; // 페이지가 새로고침되므로 아래 코드는 실행되지 않음
            }
        
            for (let i = 0; i < cards.length; i++) {
                let card = cards[i];
                let text = card.textContent.toLowerCase();
        
                if (text.includes(input)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            }
        }