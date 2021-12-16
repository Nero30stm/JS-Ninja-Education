import { createContext, useContext } from "react";
import { PillsStore } from "./PillStore";
import { action, configure, flow, observable, reaction, makeObservable } from 'mobx';
import Validate from 'validate.js';
import { checkUser, enrollUser } from './service';


configure({ enforceActions: 'always' });

Validate.validators.checkUser = async function(value) {
    try {
        await checkUser(value);
        return null;
    } catch (e) {
        return 'Email already in use';
    }
};

const rules = {
    name: {
        presence: { allowEmpty: false },
    },

    email: {
        presence: { allowEmpty: false },
        email: true,
        checkUser: true,
    },
};

export class UserEnrollmentData {
    @observable email = '';
    @observable name = '';
    @observable validating = false;
    @observable.ref errors = null;
    @observable enrollmentStatus = 'none';
    disposeValidation;
    constructor() {
        makeObservable(this)
        this.setupValidation();
    }
    setupValidation() {
        this.disposeValidation = reaction(
            () => {
                const { name, lastName, password, email } = this;
                return { name: name, lastName, password, email };
            },
            fields => {
                this.validateFields(fields);
            },
        );
    }
    @action
    setField(field, value) {
        this[field] = value;
    }
    getFields() {
        const { name, email } = this;
        return { name: name, email };
    }
    validateFields = flow(function*(fields) {
        this.validating = true;
        this.errors = null;
        try {
            yield Validate.async(fields, rules);
            this.errors = null;
        } catch (err) {
            this.errors = err;
        } finally {
            this.validating = false;
        }
    });
    enroll = flow(function*() {
        this.status = 'pending';
        try {
            // Validation
            const fields = this.getFields();
            yield this.validateFields(fields);
            if (this.errors) {
                throw new Error('Invalid fields');
            }
            // Enrollment
            yield enrollUser(fields);
            this.status = 'completed';
        } catch (e) {
            this.status = 'failed';
        }
    });
    @action
    reset() {
        this.enrollmentStatus = 'none';
    }
    cleanup() {
        this.disposeValidation();
    }
}
configure({
    enforceActions: 'never',
});