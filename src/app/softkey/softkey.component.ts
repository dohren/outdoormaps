import { Component, OnInit, Input } from '@angular/core';

export interface Softkey {
  left: string;
  center: string;
  right: string;
}

@Component({
  selector: 'app-softkey',
  templateUrl: './softkey.component.html',
  styleUrls: ['./softkey.component.css']
})
export class SoftkeyComponent {

  @Input() 
  public softkey: Softkey;
  
  private lastPressed: string;

  constructor() { }

}
