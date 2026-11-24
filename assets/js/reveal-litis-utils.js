function buildFooter(text, showTotalSlides) {
    const revealContainer = document.querySelector('.reveal');

    // Create the footer element
    const footer = document.createElement('div');
    footer.className = 'custom-footer';

    footer.innerHTML = `
        <div class="custom-footer-left">
            <span class="custom-footer-text">${footerConfig.text}</span>
        </div>
        <div class="custom-footer-right">
            <span class="custom-slide-number"></span>
        </div>
    `;

    revealContainer.appendChild(footer);

    // Update the footer on every slide change
    function updateFooter(currentSlide) {
        // Hide the footer on title slides
        if (currentSlide.classList.contains('title-slide')) {
            footer.classList.add('hidden');
        } else {
            footer.classList.remove('hidden');
        }

        // Compute the slide number (accounts for vertical slides)
        const indices = Reveal.getIndices(currentSlide);
        // +1 because the index starts at 0 (remove "+ 1" if slide 2 should show "1")
        const currentNum = Reveal.getSlidePastCount(currentSlide) + 1; 
        const totalSlides = Reveal.getTotalSlides();

        const numberEl = footer.querySelector('.custom-slide-number');
        numberEl.textContent = footerConfig.showTotalSlides 
            ? `${currentNum} / ${totalSlides}` 
            : `${currentNum}`;
    }

    // Run once on load
    updateFooter(Reveal.getCurrentSlide());

    // Run on every slide change
    Reveal.on('slidechanged', (event) => {
        updateFooter(event.currentSlide);
    });
}