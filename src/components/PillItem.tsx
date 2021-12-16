import React, { useState } from "react";
import { Pill } from "../store/PillStore";
import { observer } from "mobx-react-lite";
import {useStores} from "../store/store";
import classNames from 'classnames';

interface IProps {
    pill: Pill;
}

const PillItem = observer(({ pill }: IProps) => {
    const { pillsStore } = useStores();

    const [active, setActive] = useState("");

    let elementTap = (completed: boolean) => { //отслеживание нажатия на таблетку чтобы показать/скрыть кропку с галочкой
        if(active.length > 1) {
            setActive("")
        }
        else {
            if (!completed) {
                setActive("active-state")
            }
        }
    }

    return (
        <div className={"tablet-button-container"}>
            <button className={"button bordered-element tablet-check-button " + active} onClick={() => pillsStore.completePill(pill)}/>
            <div className={classNames({"bordered-element": true, "tablet-container": true, "resolved": pill.completed})} onClick={() => elementTap(pill.completed)}>
                <span>{pill.name}</span>
                <span>{pill.meal}</span>
                <span>{pill.time}</span>
                <div>
                    <button onClick={() => pillsStore.removePill(pill.id)}>
                        X
                    </button>
                </div>

            </div>
        </div>
    );
});

export default PillItem;