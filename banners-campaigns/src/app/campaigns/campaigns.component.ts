import { Component, OnInit } from '@angular/core';
import { Campaign } from '../campaign';
import { Banner } from '../banner';
import { CAMPAIGNS } from '../mock-campaigns';
import { CampaignService } from '../campaign.service';
import { BannerService } from '../banner.service';
import { BANNERS } from '../mock-banners';
import * as moment from 'moment';
import { interval } from 'rxjs';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {
  // campaigns: Campaign[];
  campaigns = CAMPAIGNS;
  banners = BANNERS;
  currentTime = moment().hours();


  constructor(private campaignService: CampaignService, 
    private bannerService: BannerService) { }

  ngOnInit() {
    this.getCampaigns();

    interval(1000).subscribe(n => {
      this.currentTime = moment().hours()
    })
  }
  
  getCampaigns(): void {
    this.campaignService.getCampaigns()
      .subscribe(campaigns => {
        this.campaigns = campaigns
        
        this.campaignService.setId(
          this.campaigns.length > 0 ?
          Math.max(...this.campaigns.map(campaign => campaign.id)) + 1 :
          1
        )

        this.bannerService.getBanners().subscribe(
          bannersData => {
            this.banners = bannersData
          }
        )
      });
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    
    this.campaignService.addCampaign({ name } as Campaign)
      .subscribe(campaign => {
        this.campaigns.push(campaign);
      });
  }

  delete(campaign: Campaign): void {
    this.campaigns = this.campaigns.filter(h => h !== campaign);
    this.campaignService.deleteCampaign(campaign).subscribe();
  }

  assignBanner(campaign: Campaign, banner: Banner): void {
    const extendedCampaign = campaign
    const extendedBanner = banner
    
    extendedCampaign.banners = campaign.banners ? 
      campaign.banners.find(bnr => bnr === banner.id) ? 
        campaign.banners : [...campaign.banners, banner.id] 
          : [banner.id]
    
    extendedBanner.campaigns = banner.campaigns ? 
      banner.campaigns.find(cmpgn => cmpgn === campaign.id) ?
        banner.campaigns : [...banner.campaigns, campaign.id] 
          : [campaign.id]


    this.campaignService.updateCampaign(extendedCampaign).subscribe()
    this.bannerService.updateBanner(extendedBanner).subscribe()
  }

  setActivityTime(campaign: Campaign, period: number): void {
    const periods = [0, 13, 14, 15];
    const activeCampaign = campaign;

    activeCampaign.activity = [period, periods[period]]
    
    this.campaignService.updateCampaign(activeCampaign).subscribe()

  }

}
