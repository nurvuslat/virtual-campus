function initSearch(locations) {
    const input   = document.getElementById('search-input');
    const results = document.getElementById('search-results');

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        if (!query) {
            results.style.display = 'none';
            results.innerHTML = '';
            return;
        }
        const matches = locations.filter(loc =>
            loc.name.toLowerCase().includes(query)
        );
        results.innerHTML = matches
            .map(loc => `<div class="search-result" data-id="${loc.id}">${loc.name}</div>`)
            .join('');
        results.style.display = matches.length ? 'block' : 'none';
    });

    results.addEventListener('click', e => {
        if (e.target.classList.contains('search-result')) {
            const id       = parseInt(e.target.dataset.id);
            const location = locations.find(loc => loc.id === id);
            if (!location) return;

            window.panorama.loadPanorama(
                location,
                window.navigation.generateHotspots(location, locations)
            );
            window.campusMap.zoomToLocation(location);
            window.campusMap.setActiveMarker(
                window.campusMap.markers[locations.indexOf(location)]
            );
            window.campusMap.updateDirectionArrow(
                window.panorama.getPanoramaYaw(),
                location
            );

            results.style.display = 'none';
            input.value = '';
        }
    });
}

window.searchSystem = { initSearch };