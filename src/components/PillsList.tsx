import React, { useState } from "react";
import { observer } from "mobx-react";
import PillItem from "./PillItem";
import { useStores, useDaysStores } from "../store/store"
import {action, observable} from "mobx"
import DropDown from "./DropDown";

const PillsList = observer(() => {
    const { pillsStore } = useStores();
    const { daysStore } = useDaysStores();

    let timelineValuesView = [];
    for(let el in pillsStore.getTimes(daysStore.current)) {
        timelineValuesView.push(
            <div className={"timeline-item"}>
                <span>{el}</span>
                <div className={"pills-container"}>
                    {pillsStore.getTimes(daysStore.current)[el].map( (pill: any) => (
                        <PillItem pill={pill} />
                        )
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={"timeline-item"}>
                <div>
                    <h2>Pills list</h2>
                </div>
                <DropDown/>
                {timelineValuesView}
                <h3>completed {pillsStore.getCompleteTodos} / {pillsStore.pillsCount}</h3>
            </div>
        </>
    );
});

export default PillsList;