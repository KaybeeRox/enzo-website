document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-pill");
    const reviewCards = document.querySelectorAll(".review-card");

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedCategory = button.getAttribute("data-filter");

            filterButtons.forEach(function (otherButton) {
                otherButton.classList.remove("active");
            });

            button.classList.add("active");

            reviewCards.forEach(function (card) {
                const cardCategory = card.getAttribute("data-category");

                if (
                    selectedCategory === "all" ||
                    selectedCategory === cardCategory
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});