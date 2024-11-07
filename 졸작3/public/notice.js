document.addEventListener("DOMContentLoaded", () => {
  const noticeTab = document.getElementById("notice-tab");
  const faqTab = document.getElementById("faq-tab");
  const noticeContent = document.getElementById("notice-content");
  const faqContent = document.getElementById("faq-content");

  noticeTab.addEventListener("click", () => {
    noticeTab.classList.add("active");
    faqTab.classList.remove("active");
    noticeContent.style.display = "block";
    faqContent.style.display = "none";
  });

  faqTab.addEventListener("click", () => {
    faqTab.classList.add("active");
    noticeTab.classList.remove("active");
    noticeContent.style.display = "none";
    faqContent.style.display = "block";
  });
});
