let viewer;
let currentLocation = null;

function loadPanorama(location, hotspots = []) {
    currentLocation = location;

    window.panorama.currentLocation = location;

    const config = {
        type:               "equirectangular",
        panorama:           `panoramas/${location.image}`,
        autoLoad:           true,
        showZoomCtrl:       true,
        showFullscreenCtrl: false,
        compass:            false,
        hotSpots:           hotspots,
        yaw:                0,
        pitch:              0,
        hfov:               100,
        title:              location.name
    };

    if (viewer) {
        viewer.destroy();
    }

    viewer = pannellum.viewer('panorama', config);

    const syncArrow = () => {
        if (currentLocation) {
            window.campusMap.updateDirectionArrow(viewer.getYaw(), currentLocation);
        }
    };

    viewer.on('load',      syncArrow);
    viewer.on('yawchange', syncArrow);
}

function getPanoramaYaw() {
    return viewer ? viewer.getYaw() : 0;
}

window.panorama = {
    loadPanorama,
    getPanoramaYaw,
    currentLocation: null   
};