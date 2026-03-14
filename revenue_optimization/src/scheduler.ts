import { Ad, Area, Schedule, ScheduledAd, PlacementEngine } from './placementEngine';
import { RevenueEngine } from './revenueEngine';

export class Scheduler {
    placementEngine: PlacementEngine;
    revenueEngine: RevenueEngine;

    constructor(placementEngine: PlacementEngine, revenueEngine: RevenueEngine) {
        this.placementEngine = placementEngine;
        this.revenueEngine = revenueEngine;
    }

    getNextAvailableStartTime(areaSchedule: ScheduledAd[]): number {
        for(let i = 0; i < 1000; ++i)
        {
            let state = false;
            for(const sched of areaSchedule)
            {
                if(i >= sched.startTime && i < sched.endTime){
                   state = true;
                    break;}
            }

            if(!state)
                return i;
        }

        return 0;
    }

    

    isValidSchedule(
        schedule: Schedule,
        areas: Area[],
        ads: Ad[]
    ): boolean {
        for(const key in schedule)
        {
            const adId = schedule[key].map(sched => {return sched.adId});
            if(adId === undefined) return false;
            const uniqAdId = new Set(adId);
            if(uniqAdId.size < adId.length)
                return false;

            for(const sched of schedule[key])
            {
                const areaExist = areas.find(area => area.areaId === sched.areaId)
                if(areaExist === undefined)
                    return false;
            }
            
        }



        return false;
    }

    compareSchedules(
        ads: Ad[],
        areas: Area[],
        scheduleA: Schedule,
        scheduleB: Schedule,
        decayRate: number
    ): number {
      
        return 0;
    }

    buildSchedule(
        ads: Ad[],
        areas: Area[],
        decayRate: number
    ): Schedule {
        return {};
    }
}
