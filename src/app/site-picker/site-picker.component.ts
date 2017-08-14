import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-site-picker',
  templateUrl: './site-picker.component.html',
  styleUrls: ['./site-picker.component.css']
})
export class SitePickerComponent {

  @Input() sites: {siteName, siteUrl}[];
  @Output() onSiteChosen = new EventEmitter<String>();

  constructor() { }

  chooseSite(site:String) {
    this.onSiteChosen.emit(site);
  }

}
