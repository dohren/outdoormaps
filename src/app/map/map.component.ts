import { Component, HostListener } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import { Softkey } from '../softkey/softkey.component';
import Interaction from 'ol/interaction';
import Overlay from 'ol/overlay';
import Proj from 'ol/proj';
import XYZ from 'ol/source/xyz';


declare var ol: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
 
  public softkeys: Softkey = { left: 'Zoom out', center: '', right: 'Zoom in' };
  
  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  map: Map;
  source: XYZ;
  layer: TileLayer;
  view: View;
  olOverlay: Overlay;
  olFeature: Feature;
 
  ngOnInit() {
    var baseMapLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });
    var view =  new View({
      center: olProj.fromLonLat([7.0785, 51.4614]),
      zoom: 5
    });

    var map = new Map({
      target: 'map',
      keyboardEventTarget: document,
      controls: ol.control.defaults({      
        attributionOptions: {
          collapsible: false,
          
        },
        zoom: false
      }),
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: view
    });

    var marker: Feature = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([-74.006,40.7127])
      ),  // Cordinates of New York's Town Hall
    });
    marker.setStyle(new ol.style.Style({
      image: new ol.style.Icon(({
          crossOrigin: 'anonymous',
          src: 'assets/icons/pin.png'
      }))
    }));
    var vectorSource = new ol.source.Vector({
      features: [marker]
    });
    var markerVectorLayer = new ol.layer.Vector({
      source: vectorSource,
    });
    map.addLayer(markerVectorLayer);

    var geolocation = new ol.Geolocation({
      projection: map.getView().getProjection(),
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true,
        maximumAge: 2000  
      }
    });

    var geolocation = new ol.Geolocation({
      projection: map.getView().getProjection(),
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true,
        maximumAge: 2000  
      }
    });
  
    var iconStyle = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 13],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1.0,
        src: 'assets/icons/pin.png'
         })
        });
  
  // add an empty iconFeature to the source of the layer
    var iconFeature = new ol.Feature();   
    var iconSource = new ol.source.Vector({
      features: [iconFeature]
    });    
    var iconLayer = new ol.layer.Vector({
      source: iconSource,
      style : iconStyle
    });    
    map.addLayer(iconLayer); 
  
    geolocation.on('change', (event) => {
      var pos = geolocation.getPosition();
      iconFeature.setGeometry(new ol.geom.Point(pos));

      //view.setCenter(pos);
      //view.setZoom(8); 
    }); 
    
  }

  @HostListener('document:keydown.softright')
  onSoftRight() {
    var view = this.map.getView();
    view.setZoom(view.getZoom()+1);
  }

  @HostListener('document:keydown.softleft')
  onSoftLeft() {
    var view = this.map.getView();
    view.setZoom(view.getZoom()-1);
  }

  @HostListener('document:keydown.enter')
  onEnter() {
    navigator.geolocation.getCurrentPosition(this.showPosition, this.error, this.options);
    // id = navigator.geolocation.watchPosition(success[, error[, options]])
  }

  error() {
    alert("Position nicht ermittelbar.")
  }

  showPosition(pos) {
    var crd = pos.coords;
    alert("lat: " + crd.latitude + " long: " + crd.longitude);
  }

}