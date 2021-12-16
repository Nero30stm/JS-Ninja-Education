import {observable, action, computed, makeObservable, autorun, reaction} from "mobx";

export class daysObj {
    days= ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    @observable current;

    constructor() {
        makeObservable(this)
        this.current = this.days[new Date().getDay()]
    }

    @action
    public changeDay(day: any){
        this.current = day;
    }
}

export class Pill {
    id;
    @observable name = '';
    @observable meal = '';
    @observable time = '';
    @observable day = '';
    @observable completed = false;

    constructor(id: number, name: string, meal: string, time:any, day: string) {
        makeObservable(this)
        this.id = id
        this.name = name;
        this.meal = meal;
        this.time = time;
        this.day = day;
    }
}

export class PillsStore {
    @observable public pills: Pill[] = [];

    constructor() {
        makeObservable(this)
        if (localStorage.getItem("pillsArray") !== null) {
            try {
                this.pills =
                    JSON.parse(
                        localStorage.getItem("pillsArray")!,
                    );
            } catch (err) {
                console.log(err)
            }

        }
        reaction(
            () => this.pills.length,
            _ => localStorage.setItem(
                "pillsArray",
                JSON.stringify(this.pills),
        ))
    }

    @action
    addPill(pill: Pill) {
        this.pills.push(pill);
    }

    @action
    removePill(index: number) {
        const updatedTodos = this.pills.filter(pill => pill.id !== index);
        this.pills = updatedTodos;
    }

    @action
    public completePill = (pill: Pill) => {
        pill.completed = !pill.completed;
    };

    @computed
    get pillsCount() {
        return this.pills.length;
    }

    @action
    public getTimes(day: string) {
        let timelineValues: any = {} ;
        this.pills.forEach(pill => {
            if(pill.day == day) {
                if (!timelineValues[pill.time]) { // если раньше не было таблеток, которые надо принять в это время
                    timelineValues[pill.time] = []; // создать свойство с таким временем
                }
                if (pill) {
                    timelineValues[pill.time].push(pill); //иначе добавить на это время таблетку
                }
            }
        })

        return timelineValues;
    }

    @action
    public getDay(day: string) {
        this.pills.filter(pill => pill.day !== day);
    }
    
    @computed
    get getCompleteTodos() {
        let completeTodos = 0;
        this.pills.forEach(pill => {
            if(pill.completed) {
                completeTodos++;
            }
        })

        return completeTodos;
    }
}
