function initMap() {
    let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 52.55032693998129, lng: 13.36833241447274 },
    zoom: 9,
    });

    var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    var locations = [
        { lat: 52.468605383600746, lng: 13.511677663002171, },
        { lat: 52.579974739192956, lng: 13.285905429690139, },
        { lat: 52.552527896817416, lng: 13.470893002284551 }
    ];

    var markers = locations.map(function(location, i) {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
        });
    });

    var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
}