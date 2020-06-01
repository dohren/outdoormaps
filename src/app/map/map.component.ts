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
  // source: XYZ;
  // layer: TileLayer;
  view: View;
  pos: Geolocation;
  // olOverlay: Overlay;
  // olFeature: Feature;
 
  ngOnInit() {

    this.createMap();
    this.showPosition(); 
    
  }

  private showPosition() {
    const geolocation = new ol.Geolocation({
      projection: this.map.getView().getProjection(),
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
      style: iconStyle
    });
    this.map.addLayer(iconLayer);
    geolocation.on('change', (event) => {
      this.pos = geolocation.getPosition();
      iconFeature.setGeometry(new ol.geom.Point(this.pos));
    });
  }

  private createMap() {
    this.view = new View({
      center: olProj.fromLonLat([7.0785, 51.4614]),
      zoom: 8
    })

    this.map = new Map({
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
      view: this.view
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
    //navigator.geolocation.getCurrentPosition(this.showPosition2, this.error, this.options);
    // id = navigator.geolocation.watchPosition(success[, error[, options]])
    this.view.setCenter(this.pos);
    this.view.setZoom(12); 
  }

  error() {
    alert("Position nicht ermittelbar.")
  }

  showPosition2(pos) {
    var crd = pos.coords;
    alert("lat: " + crd.latitude + " long: " + crd.longitude);
  }

}