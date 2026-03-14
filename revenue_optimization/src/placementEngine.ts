export interface Ad {
    adId: string;
    advertiserId: string;
    timeReceived: number;
    timeout: number;
    duration: number;
    baseRevenue: number;
    bannedLocations: string[];
}

export interface Area {
    areaId: string;
    location: string;
    multiplier: number;
    totalScreens: number;
    timeWindow: number;
}

export interface ScheduledAd {
    adId: string;
    areaId: string;
    startTime: number;
    endTime: number;
}

export type Schedule = Record<string, ScheduledAd[]>;

export class PlacementEngine {

    constructor() {
    }

    isAdCompatibleWithArea(ad: Ad, area: Area): boolean {
        if(ad.bannedLocations.includes(area.location))
            return false;

        return true;
    }

    getTotalScheduledTimeForArea(areaSchedule: ScheduledAd[]): number {
        let total: number = 0;
        for(const sched of areaSchedule)
        {
            total += sched.endTime - sched.startTime;
        }
        return total;
    }

    doesPlacementFitTimingConstraints(
        ad: Ad,
        area: Area,
        startTime: number
    ): boolean {
        if(startTime < 0 || startTime > ad.timeReceived + ad.timeout || startTime < ad.timeReceived) return false;
        if(ad.duration + startTime <= area.timeWindow)
            return true;

        return false;
    }

    isAdAlreadyScheduled(adId: string, schedule: Schedule): boolean {
        for(const key in schedule)
        {
            for(const sched of schedule[key])
            {
                if(sched.adId === adId)
                    return true;
            }
        }

        return false;
    }

    canScheduleAd(
        ad: Ad,
        area: Area,
        schedule: Schedule,
        startTime: number
    ): boolean {
        let overlap = false;

        for(const key in schedule)
        {
            for(const sched of schedule[key])
            {
                let endTime = startTime + ad.duration;
                if(sched.endTime > startTime && startTime > sched.startTime)
                    overlap = true;
                else
                    if(sched.startTime < endTime && endTime < sched.endTime)
                        overlap = true;
            }
        }


        if(this.isAdCompatibleWithArea(ad, area) && 
        !this.isAdAlreadyScheduled(ad.adId, schedule) && 
        this.doesPlacementFitTimingConstraints(ad, area, startTime) &&
        !overlap)
            return true;
        return false;
    }

    isAreaScheduleValid(area: Area, areaSchedule: ScheduledAd[], ads: Ad[]): boolean {
        for(const sched of areaSchedule)
        {
            let adExist = ads.find(ad => ad.adId === sched.adId);
            if(adExist === undefined || adExist.duration !== sched.endTime - sched.startTime)
                return false;

            let allows = ads.find(ad => !this.isAdCompatibleWithArea(ad, area));
            if(allows !== undefined)
                return false;

            let totalTime = this.getTotalScheduledTimeForArea(areaSchedule);
            if(totalTime > area.timeWindow)
                return false;
        }

        // overlap
        let overlap = false;
        for(let i = 0; i < areaSchedule.length && !overlap; ++i)
        {
            for(let j = 0; j < areaSchedule.length && !overlap; ++j)
            {
                if(i === j) continue;
            
                let endTime = areaSchedule[i].endTime;
                let startTime = areaSchedule[i].startTime;
                let sched = areaSchedule[j];
                if(sched.endTime > startTime && startTime > sched.startTime)
                    overlap = true;
                else
                    if(sched.startTime < endTime && endTime < sched.endTime)
                        overlap = true;
            }
        }

        if(overlap) return false;
        return true;
    }
}