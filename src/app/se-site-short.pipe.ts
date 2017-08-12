import { Pipe, PipeTransform } from '@angular/core';
import { url } from 'url-parse';

@Pipe({
  name: 'seSiteShort'
})
export class SeSiteShortPipe implements PipeTransform {

  private longUrlSites = {
    "stackoverflow.com": "stackoverflow",
    "superuser.com": "superuser",
    "stackapps.com": "stackapps",
    "askubuntu.com": "askubuntu",
    "serverfault.com": "serverfault",
    "mathoverflow.net": "mathoverflow.net"
  };

  transform(value: string, args?: any): String {
    const stackUrl = new URL(value);

    if(stackUrl.hostname in this.longUrlSites){
      return this.longUrlSites[stackUrl.hostname];
    }

    const search = stackUrl.hostname.match(/(.*)\.stackexchange.com$/);
    if(search === null || search.length < 2){
      return '';
    } else {
      return search[1];
    }
  }

}
