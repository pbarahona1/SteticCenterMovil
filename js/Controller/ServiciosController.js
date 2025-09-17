document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".element-card");

  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      cards.forEach(c => { if (c !== card) c.classList.remove('open'); });
      card.classList.toggle("open");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".element-card")) {
      cards.forEach(c => c.classList.remove("open"));
    }
  }, true);
});
