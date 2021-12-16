import React, {useState, Fragment, useContext, createContext} from 'react';
import { Link } from 'react-router-dom';
import {useStores} from "../store/store";
import {Pill, PillsStore} from "../store/PillStore";
import {observer, inject, Provider} from "mobx-react";
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Grid,
    TextField,
} from '@material-ui/core';
import {UserEnrollmentData} from "../store/validations";
import {action, makeObservable, observable} from "mobx";


class Dose {
    @observable time;

    constructor(_time: string) {
        makeObservable(this)
        this.time = _time;
    }

    public setTime = (time: any) => {
        this.time = time;
    };
}

class DosesStore {
    @observable public doses: Dose[] = [];
    constructor() {
        makeObservable(this);
    }

    @action
    addDose(dose: Dose) {
        this.doses.push(dose);
    }
}


const NewPill = (props: any) => {

    const { pillsStore } = useStores();
    const dosesStore = new DosesStore();
    const navigate = useNavigate();

    const InputField = observer(({field, type, label}: any) => {
        const errors = props.userEnrollmentData.errors && props.userEnrollmentData.errors[field];
        const hasError = !!errors;

        return (
            <TextField
                className="input"
                type={type}
                placeholder="name"
                label={label}
                error={hasError}
                onChange={event => props.userEnrollmentData.setField(field, event.target.value)}
                margin={'normal'}
                helperText={errors ? errors[0] : null}
            />
        )
    });

    const InputDose = observer(({field, type, label, time}: any) => {
        const errors = props.userEnrollmentData.errors && props.userEnrollmentData.errors[field];
        const hasError = !!errors;
        const handleChange = (field: any, event: any) => {
            props.userEnrollmentData.setField(field, event.target.value);
            time.setTime(props.userEnrollmentData.dose);
        }
        return (
            <TextField
                className="input"
                type={type}
                placeholder="name"
                label={label}
                error={hasError}
                onChange={event => handleChange(field, event)}
                margin={'normal'}
                helperText={errors ? errors[0] : null}
            />
        )
    });

    const AddingDosesList =observer( () => {
        return (
            <div className="content-container-only-mobile">
                {dosesStore.doses.map((x, i) => {
                    return (
                        <div className="time-input-container">
                            <InputDose
                                type={'time'}
                                field={'dose'}
                                label={'dose'}
                                time={x}
                            />
                        </div>
                    )
                })
                }
            </div>
        )
    });

    const NewDose =observer( () => {
        return (
            <Fragment>
                <Button
                    className="first-btn adding-button"
                    onClick={() => dosesStore.addDose(new Dose("00:00"))}
                >
                    Add dose
                </Button>
            </Fragment>
        )
    });

    const EnrollButton = observer(() => {
        const disabled = !props.userEnrollmentData.isActive;

        return (
            <Fragment>
                <Button

                    className="first-btn adding-button"
                    type="submit"
                    disabled={disabled}
                    onClick={() => props.userEnrollmentData.enroll()}
                >
                    Save
                </Button>
            </Fragment>
        )
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        dosesStore.doses.map((e) => {
            pillsStore.addPill(
                new Pill(
                    pillsStore.pillsCount,
                    props.userEnrollmentData.name,
                    props.userEnrollmentData.meal,
                    e.time,
                    props.userEnrollmentData.day,
                )
            )
        })
        dosesStore.doses = [];
        navigate('/')
    };

    return (
        <div className="adding-form">
            <h2 id="modal-new-todo">Add new pill</h2>
            <form onSubmit={handleSubmit} noValidate className="create-pill">
                <InputField
                    type={'text'}
                    field={'name'}
                    label={'Name'}
                />
                <InputField
                    type={'text'}
                    field={'meal'}
                    label={'Meal'}
                />
                <InputField
                    type={'text'}
                    field={'day'}
                    label={'Day'}
                />
                <AddingDosesList/>
                <NewDose />
                <EnrollButton/>
            </form>
        </div>
    );
};

export class AddingTask extends React.Component {
    store: any;
    constructor(props: any) {
        super(props);
        this.store = new UserEnrollmentData();
    }
    render() {
        return (
            <div className="adding-page">
                <Link to='/'>return</Link>
                <NewPill userEnrollmentData={this.store}/>
            </div>
        );
    }

}
export default AddingTask;