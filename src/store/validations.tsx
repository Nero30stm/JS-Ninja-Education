import {action, configure, flow, observable, reaction, makeObservable, computed} from 'mobx';
import Validate from 'validate.js';

configure({ enforceActions: 'always' });

const rules = {
    name: {
        presence: { allowEmpty: false },
        length: { minimum: 3 },
    },
    meal: {
        presence: { allowEmpty: false },
        length: { minimum: 3 },
    },
    dose: {
        presence: { allowEmpty: false },
    },
    day: {
        presence: { allowEmpty: false },
    },
};

export class UserEnrollmentData {

    @observable name: any = '';
    @observable meal: any = '';
    @observable dose: any;
    @observable day: any = '';

    @observable validating: any = false;
    @observable.ref errors: any = null;
    @observable status: any;
    @observable isActive: any = false;
    disposeValidation: any;
    constructor() {
        makeObservable(this)
        this.setupValidation();
        this.isActive = false;
    }
    setupValidation() {
        this.disposeValidation = reaction(
            () => {
                const { name, meal, dose, day, } = this;
                return { name, meal, dose, day };
            },
            fields => {
                this.validateFields(fields);
            },
        );
    }
    @action
    setField(field: any, value: any) {
        this[field as keyof UserEnrollmentData] = value;
    }
    getFields() {
        const { name, meal, dose, day } = this;
        return { name, meal, dose, day };
    }
    @action
    setIsActive() {
        if(this.errors == null) {
            this.isActive = true;
        }
        else this.isActive = false;
    }

    validateFields = flow( function*(this: UserEnrollmentData, fields) {
        this.validating = true;
        this.errors = null;
        try {
            yield Validate.async(fields, rules);
            this.errors = null;
        } catch (err) {
            this.errors = err;
        } finally {
            this.validating = false;
            this.setIsActive();
        }
    });
    enroll = flow(function*(this: UserEnrollmentData) {
        try {
            const fields = this.getFields();
            yield this.validateFields(fields);
            if (this.errors) {
                throw new Error('Invalid fields');
            }
        } catch (e) {
            this.status = 'failed';
        };

    });
}
configure({
    enforceActions: 'never',
});