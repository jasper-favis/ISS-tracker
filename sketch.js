var canvas;
var slider;
var mapChoice = 3;
var poppins;

var ISSimg = 'https://static01.nyt.com/images/2018/09/14/science/14SPACESTATION-print-sub/14SPACESTATION1-articleLarge.jpg?quality=75&auto=webp&disable=upscale';
var url = 'https://api.wheretheiss.at/v1/satellites/25544';
var issX = 0;
var issY = 0;

var pic;
var mapAPI = 'https://api.mapbox.com';
var mapAPIkey = '?access_token=pk.eyJ1IjoiamFzcGVyZmF2aXMiLCJhIjoiY2p5YzExYXRpMDVlZjNobjNoNnV4dTM4NiJ9.EEWrRWQBWsPj8IJTU2ussw';
var style = ["light-v9", "dark-v10", "streets-v11", "satellite-streets-v11"];
var tempLat = 0;
var tempLon = 0;
var zoom = 3;
var mapIMG;

var showSAT = false;
var velocity;
var altitude;
var lat;
var lon;
var currLat = 0;
var currLon = 0;
var prevLat = 0;
var prevLon = 0;

var next = false;
var first = true;
var interpolateLat = [];
var interpolateLon = [];
var count = 0;

var bg;


function setup() {
    document.getElementById("mapStyle").addEventListener("click", openMenu);
  sel = document.getElementsByClassName("sel");
  for (var i = 0; i < sel.length; i++) {
    sel[i].addEventListener('click', chooseStyle, false);
}
  
  
  loadJSON(url, gotData);
  bg = loadImage(ISSimg) 
  canvas = createCanvas(600, 400);
  canvas.parent('canvas-pos');
  createP('');
  setInterval(query, 5000);
  setInterval(displayLocation, 1000);
}


function rangeSlider (value){
 document.getElementById('rangeValue').innerHTML = value;
 zoom = value;
}

function query() {
  loadJSON(url, gotData);
}

function gotData(data) {
  prevLat = currLat;
  prevLon = currLon;
  currLat = data.latitude;
  currLon = data.longitude;
  velocity = data.velocity;
  altitude = data.altitude;
  document.getElementById("velocity").innerHTML = velocity.toFixed(2);
  document.getElementById("altitude").innerHTML = altitude.toFixed(2);
  count = 0;
  
  if (currLat == prevLat && currLon == prevLon || (currLat == 0 && currLon == 0))
  {
    return;
  }
  var diffLat = abs(currLat - prevLat);
  var diffLon = abs(currLon - prevLon);
  var i;
  for (i = 0; i < 5; i++)
  {
    if (currLat > prevLat) {
    interpolateLat[i] = prevLat + diffLat*i/5;
    }
    else {
      interpolateLat[i] = prevLat - diffLat*i/5;
    }
    
    if (currLon > prevLon) {
    interpolateLon[i] = prevLon + diffLon*i/5;
    }
    else {
      interpolateLon[i] = prevLon - diffLon*i/5;
    }
  }

}

function displayLocation() {
  if (currLat == prevLat && currLon == prevLon || (prevLat == 0 && prevLon == 0))
  {
    return;
  }
  
  lat = interpolateLat[count];
  lon = interpolateLon[count];
  
  // for debugging
  // console.log(lat + ' ' + lon);

  mapIMG = mapAPI + '/styles/v1/mapbox/' + style[mapChoice] + '/static/' + lon + ',' + lat + ',' + zoom + ',0,0/600x400' + mapAPIkey;
  
  bg = loadImage(mapIMG);
  showSAT = true;
  count++;
}

function openMenu() {
  document.getElementById("dropdown").classList.toggle("active");
}

function chooseStyle() {
  var style = this.getAttribute('id');
  if (style == 'light'){
    mapChoice = 0;
  }
  else if (style == 'dark') {
    mapChoice = 1;
  }
  else if (style == 'terrain') {
    mapChoice = 2;
  }
  else if (style == 'terrainStreets') {
    mapChoice = 3;
  }
}


const navSlide = () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');

  burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('nav-active');

    // Animate Links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      }
      else {
      link.style.animation = `navLinkFade 0.5s forwards ${index/3 + 0.5}s`;
      }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
  });

}

navSlide();



function draw() {
  background(bg);
  if (showSAT) {
    fill(255,99,71);
    circle(width / 2, height / 2, 20);
    stroke(255,99,71);
    line(0, height/2, width, height/2);
    line(width/2, 0, width/2, height);
    textSize(18);
    text('latitude: ' + nf(lat,3,3), width - 140, height/2 - 5);
    text('longitude: ' + nf(lon,3,3), width/2 + 5, 20);
  }
}