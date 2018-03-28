const map = L.map("map",{
   center: [35.858496, 139.657109],
   zoom: 13
});

const attribution = '<a href="https://openstreetmap.org/">&copy OpenStreetMap contributors</a> | <a href="http://www.ekidata.jp/">駅データ.jp</a>';

L.tileLayer(
   'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
   {
      attribution: attribution,
      maxZoom: 18
   }
).addTo(map);

map._initPathRoot();

const centerCross = L.icon({
   iconUrl: "img/cross.png",
   iconSize: [32, 32],
   iconAnchor: [16, 16]
});

const crossHair = new L.marker(
   map.getCenter(),
   {
      icon: centerCross,
      clickable: false
   }
).addTo(map);

map.on("move", e => {
   crossHair.setLatLng(map.getCenter());
})

const voronoi = d3.voronoi()
   .x(d => { return d.x; })
   .y(d => { return d.y; });

drawVoronoi = data => {
   const svg = d3.select("#map").select("svg");
   const voroLayer = svg.append("g")
      .attr("class", "leaflet-zoom-hide")
      .attr("id", "voroLayer");

   addLabel = (x, y, text) => {
      d3.selectAll(".stationLabel").remove();
      voroLayer.append("text")
         .attr("class", "stationLabel")
         .attr("x", x)
         .attr("y", y)
         .attr("font-size", "20px")
         .text(text);
      
      voroLayer.append("circle")
         .attr("cx", x)
         .attr("cy", y)
         .attr("r", 2)
         .attr("fill", "red")
         .attr("stroke", "red")
         .attr("stroke-width", "1px")
         .attr("class", "stationLabel")
   }

   update = () => {
      d3.selectAll(".voronoi").remove();

      let pointData = [];
      data.features.forEach(d => {
         const latlng = new L.LatLng(
            d.geometry.coordinates[1],
            d.geometry.coordinates[0]
         );
         pointData.push({
            x: map.latLngToLayerPoint(latlng).x,
            y: map.latLngToLayerPoint(latlng).y,
            name: d.properties.station_name
         });
      });

      const polygons = voronoi(pointData).polygons();
   
      voroLayer.selectAll("path")
         .data(polygons)
         .enter()
         .append("path")
         .attr("class", "voronoi")
         .attr("stroke", "blue")
         .attr("stroke-width", 1)
         .attr("fill", "#ffffff")
         .attr("fill-opacity", 0.4)
         .attr("name", d => {
            if (!d) return null;
            return d.data.name;
         })
         .attr("d", d => {
            if (!d) return null;
            return "M" + d.filter( dd => {
               return dd != null
            }).join("L") + "Z";
         })
         .on("click", function(d) {
            const mouseCoords = d3.mouse(this);
            addLabel(mouseCoords[0], mouseCoords[1], d.data.name);
         });

   };

   map.on("moveend", update);
   map.on("zoomend", e => {
      d3.selectAll(".stationLabel").remove();
   });

   update();
};

d3.json("station.geojson", drawVoronoi);

const lock_opt = {
   enableHightAccuray: true,
   timeout: 10000,
   maximumAge: 0
};

lock_on = () => {
   here_ng = () => {
      window.alert("位置情報を利用できません");
   };

   here_ok = (position) => {
      map.setView([
         position.coords.latitude,
         position.coords.longitude
      ]);
   };

   const GNSS_here = navigator.geolocation.getCurrentPosition(here_ok, here_ng, lock_opt);
}

