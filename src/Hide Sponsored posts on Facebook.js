(() => {
    const paidSocialItems = document.body.querySelectorAll("[href*='utm_medium=paid_social']");
    const items = Array.from(paidSocialItems).map(i => i.parentElement
        .parentElement
        .parentElement
        .parentElement
        .parentElement
        .parentElement
        .parentElement);
    items.forEach(i => i.hidden = true);
    console.log(items);
})();