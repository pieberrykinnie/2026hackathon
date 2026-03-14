import { Ad, Area, Schedule, ScheduledAd, PlacementEngine } from './placementEngine';

export class RevenueEngine {
    placementEngine: PlacementEngine;

    constructor(placementEngine: PlacementEngine) {
        this.placementEngine = placementEngine;
    }

    getAdvertiserScheduleCount(
        advertiserId: string,
        ads: Ad[],
        schedule: Schedule
    ): number {
        let count = 0;
        for(const key in schedule)
        {
            for(const sched of schedule[key])
            {
                let ad = ads.find(ad => ad.adId === sched.adId);
                if(ad !== undefined && ad.advertiserId === advertiserId)
                    count++;
            }
        }

        return count;
    }

    calculateDiminishedRevenue(
        baseRevenue: number,
        advertiserScheduledCount: number,
        decayRate: number
    ): number {
        return baseRevenue*(decayRate**advertiserScheduledCount);
    }

    calculatePlacementRevenue(
        ad: Ad,
        areas: Area[],
        ads: Ad[],
        schedule: Schedule,
        decayRate: number
    ): number {
       
        let baseRev = 0;
        let order = 0;
        let advertised = [];
        for(const key in schedule)
        {
            for(let i = 0; i < schedule[key].length; ++i)
            {
                const sched = schedule[key][i];
                const tempAd = ads.find(ad => ad.adId === sched.adId);
                if(tempAd?.advertiserId === ad.advertiserId)
                    advertised.push(sched);
            }
        }

        advertised = advertised.sort((a: ScheduledAd, b : ScheduledAd) => {
            if (a.startTime < b.startTime) 
                return 1;
            else if (a.startTime > b.startTime)
                return 0;
            else
            {
                let areaA = areas.find(area => area.areaId === a.areaId);
                let areaB = areas.find(area => area.areaId === b.areaId);
                let adA = ads.find(ad => ad.adId === a.adId);
                let adB = ads.find(ad => ad.adId === b.adId);

                if(areaA !== undefined && areaB !== undefined && adA !== undefined && adB !== undefined)
                {
                    if(areaA.multiplier*adA?.baseRevenue > areaB.multiplier*adB?.baseRevenue)
                        return 0;
                    else if(areaA.multiplier*adA?.baseRevenue < areaB.multiplier*adB?.baseRevenue)
                        return 1;
                    else
                    {
                        if(a.adId > b.adId)
                            return 1;
                        else if(a.adId <  b.adId)
                            return 0;
                        return 0;
                    }
                }
            }

            return 0;
        })

        let count = 0;
        for(let i = 0; i < advertised.length; ++i)
        {
            if(advertised[i].adId === ad.adId){
                let areaA = areas.find(area => area.areaId === advertised[i].areaId);
                if(areaA !== undefined)
                baseRev = ad.baseRevenue*areaA?.multiplier;
                count = i;}
        }
        return this.calculateDiminishedRevenue(baseRev, count, decayRate);
    }

    getAdvertiserDiversity(ads: Ad[], schedule: Schedule): number {
        let adver: string[] = [];
        for(const key in schedule)
        {
            for(const sched of schedule[key])
            {
                const ad =  ads.find(ad => ad.adId === sched.adId);
                if(ad !== undefined)
                {
                    if(!adver.includes(ad?.advertiserId))
                    {
                        adver.push(ad.advertiserId);
                    }
                }
            }
            
          
        }

          return adver ? adver.length : 0;
    }

    getAreaRevenue(
        area: Area,
        areasArray: Area[],
        fullSchedule: Schedule,
        ads: Ad[],
        decayRate: number
    ): number {
        return 0;
    }
}