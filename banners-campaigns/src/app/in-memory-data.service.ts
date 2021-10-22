import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Banner } from './banner';
import { Campaign } from './campaign';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const banners = [
      { id: 1, name: 'Just', text: 'some message' },
      { id: 2, name: 'Just', text: 'some message' },
      { id: 3, name: 'Just', text: 'some message' }
    ];
    const campaigns = [
      { id: 1, name: 'some campaign' },
      { id: 2, name: 'some campaign' },
      { id: 3, name: 'some campaign' }
    ];
    return {banners, campaigns};
  }


  // Overrides the genId method to ensure that a banner always has an id.
  // If the banners array is empty,
  // the method below returns the initial number (11).
  // if the banners array is not empty, the method below returns the highest
  // banner id + 1.
  genId(banners: Banner[]): number {
    return banners.length > 0 ? Math.max(...banners.map(banner => banner.id)) + 1 : 11;
  }

  genCId(campaigns: Campaign[]): number {
    return campaigns.length > 0 ? Math.max(...campaigns.map(campaign => campaign.id)) + 1 : 11;
  }
}
