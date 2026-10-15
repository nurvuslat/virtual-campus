
let map, imageOverlay, markers = [], directionArrow;
let locations = [];
let activeMarker = null;


const MAP_WIDTH  = 2222;
const MAP_HEIGHT = 3555;

function initMap(locationsData, onMarkerClick) {
    locations = locationsData;

    map = L.map('minimap', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
        zoomControl: false,
        attributionControl: false
    });


    const bounds = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]];
    imageOverlay = L.imageOverlay('assets/campus_map.png', bounds).addTo(map);
    map.fitBounds(bounds);


    markers = locations.map(loc => {
        const marker = L.marker([loc.y, loc.x], { title: loc.name }).addTo(map);

        marker.on('click', () => {
            setActiveMarker(marker);
            onMarkerClick(loc);
        });

        marker.on('mouseover', () => {
            marker.bindTooltip(loc.info || loc.name, {
                permanent: false,
                direction: 'top'
            }).openTooltip();
        });

        marker.on('mouseout', () => marker.closeTooltip());

        return marker;
    });

    window.campusMap.markers = markers;

    map.on('click', e => {
        console.log(`Coords → "x": ${e.latlng.lng.toFixed(1)}, "y": ${e.latlng.lat.toFixed(1)}`);
    });
}

function setActiveMarker(marker) {
    if (activeMarker && activeMarker.getElement()) {
        activeMarker.getElement().classList.remove('marker-active');
    }
    activeMarker = marker;
    if (marker && marker.getElement()) {
        marker.getElement().classList.add('marker-active');
    }
}

function updateDirectionArrow(yaw, location) {
    if (!directionArrow) {
        directionArrow = L.marker([location.y, location.x], {
            icon: L.divIcon({
                className: 'direction-arrow-container',
                html: `<div class="arrow-rotate" style="
                            width:32px; height:32px;
                            transform-origin: 50% 50%;
                            transform: rotate(0deg);
                            display:flex; align-items:center; justify-content:center;">
                         <svg width="32" height="32" viewBox="0 0 32 32">
                           <polygon points="16,2 30,30 16,23 2,30"
                                    style="fill:#0078ff; stroke:#fff; stroke-width:1.5;"/>
                         </svg>
                       </div>`,
                iconSize:   [32, 32],
                iconAnchor: [16, 16]
            }),
            zIndexOffset: 1000,
            interactive: false
        }).addTo(map);
    }

    directionArrow.setLatLng([location.y, location.x]);

    const el = directionArrow.getElement();
    if (el) {
        const inner = el.querySelector('.arrow-rotate');
        if (inner) inner.style.transform = `rotate(${yaw}deg)`;
    }
}

function zoomToLocation(location) {
    map.setView([location.y, location.x], 1);
}

window.campusMap = {
    initMap,
    updateDirectionArrow,
    zoomToLocation,
    setActiveMarker,
    markers  
};