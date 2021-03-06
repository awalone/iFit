// Third-party
import * as moment from 'moment';

// Models
import { Goal } from './goal';

export class ActivityCategory {
    constructor(
        public category: string,
        public icon: string,
        public types: ActivityType[]
    ) {}
}

export class ActivityType {
    constructor(
        public duration: number = 0,
        public energyConsumption: number = 0,
        public met: number = 1,
        public name: string = '',
        public time: string = moment().format('HH:mm')
    ) { }
}

export class ActivityPlan {
    constructor(
        public activities: ActivityType[] = [],
        public combos: {
            energy: boolean,
            goalsAchieved: boolean,
            hiit: boolean,
            lowActivity: boolean,
            overtraining: boolean,
            sedentarism: boolean
        } = { energy: false, goalsAchieved: false, hiit: false, lowActivity: false, overtraining: false, sedentarism: true},
        public date: number = moment().dayOfYear(),
        public lifePoints: number = 0,
        public totalDuration: number = 0,
        public totalEnergyConsumption: number = 0,
        public weekLog: ExerciseLog[] = []
    ) { }
}

export class ExerciseGoals {
    constructor(
        public duration: Goal = new Goal(false, 0),
        public energy: Goal = new Goal(false, 0)
    ) { }
}

export class ExerciseLog {
    constructor(
        public date: string,
        public totalDuration: number = 0,
        public totalEnergyConsumption: number = 0
    ) { }
}