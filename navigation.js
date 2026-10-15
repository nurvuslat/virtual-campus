function calculateYaw(current, target) {
    const dx = target.x - current.x;  
    const dy = target.y - current.y;  

    const yaw = Math.atan2(dx, -dy) * (180 / Math.PI);
    return yaw;
}

function getClosestLocations(current, locations, maxCount = 3) {
    return locations
        .filter(loc => loc.id !== current.id)
        .map(loc => ({
            loc,
            dist: Math.hypot(loc.x - current.x, loc.y - current.y)
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, maxCount)
        .map(d => d.loc);
}

function generateHotspots(current, locations) {
    const closest = getClosestLocations(current, locations);

    return closest.map(loc => {
        const yaw = calculateYaw(current, loc);

        return {
            pitch: -5,        
            yaw:   yaw,         
            type:  "custom",     
            cssClass: "nav-hotspot",   
            text:  loc.name,
            clickHandlerFunc: (e, args) => {
                const newHotspots = generateHotspots(loc, locations);
                window.panorama.loadPanorama(loc, newHotspots);

                const idx = locations.indexOf(loc);
                const targetMarker = window.campusMap.markers[idx];
                window.campusMap.setActiveMarker(targetMarker);
                window.campusMap.updateDirectionArrow(window.panorama.getPanoramaYaw(), loc);
            }
        };
    });
}

window.navigation = {
    calculateYaw,
    getClosestLocations,
    generateHotspots
};