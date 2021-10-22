import { Component, OnInit } from '@angular/core';
import { Banner } from '../banner';
import { BANNERS } from '../mock-banners';
import { BannerService } from '../banner.service';
import { Campaign } from '../campaign';
import { CAMPAIGNS } from '../mock-campaigns';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {
  // banners: Banner[];
  banners = BANNERS;
  campaigns = CAMPAIGNS;

  constructor(private bannerService: BannerService) { }

  ngOnInit() {
    this.getBanners();
  }
  
  getBanners(): void {
    this.bannerService.getBanners()
      .subscribe(banners => {
        this.banners = banners

        this.bannerService.setId(
          this.banners.length > 0 ? 
            Math.max(...this.banners.map(banner => banner.id)) + 1 :
            1
        )
      });
  }

  add(name: string, text: string): void {
    name = name.trim();
    text = text.trim();
    if (!name || !text) { return; }
    this.bannerService.addBanner({ name, text } as Banner)
      .subscribe(banner => {
        this.banners.push(banner);
      });
  }

  delete(banner: Banner): void {
    this.banners = this.banners.filter(h => h !== banner);
    this.bannerService.deleteBanner(banner).subscribe();
  }

  // bindCampaign(banner: Banner, campaign: Campaign): void {
  //   const extendedBanner = banner
  //   extendedBanner.campaigns = [...banner.campaigns, campaign.id]

  //   this.bannerService.updateBanner(extendedBanner).subscribe()
  // }

}
