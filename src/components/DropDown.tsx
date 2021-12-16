import {observer} from "mobx-react";
import React, {useState} from "react";
import {useDaysStores} from "../store/store";

let DropDown = observer(() => {
        const [isDrop, setDrop] = useState(false);
        const { daysStore } = useDaysStores();

        let changeDrop = () => {
            setDrop(!isDrop);
        }

        let changeDay = (day: any) => {
            daysStore.changeDay(day);
            changeDrop();
        }

        let dropDownBox =
            <div className="drop-down-box">
                {daysStore.days.map((e: any) => (
                    <span onClick={()=>{changeDay(e)}}>{e}</span>
                ))}

            </div>;

        return (
            <div className="date-container">
                <h2 className="day-header" onClick={changeDrop}>{daysStore.current}</h2>
                <button className={isDrop?"arrow-down-button":"arrow-up-button"} onClick={changeDrop}></button>
                {isDrop?( dropDownBox):null}
            </div>
        );
    })

export default DropDown