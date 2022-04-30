import { ENDPOINTS } from '../constants';

const constants = {
    class: {
        response: 'wpcf7-response-output',
        field: 'form-control',
        fieldInvalid: 'is-invalid',
        fieldInvalidFeedback: 'invalid-feedback',
        hide: 'd-none',
    },
};

export default class {
    constructor(form, axios) {
        this.form = form;
        this.$axios = axios;
    }

    #messageEl = null;

    init() {
        this.#messageEl = this.form.querySelector(`.${constants.class.response}`);

        const onSubmit = (event) => {
            event.preventDefault();

            this.#feedbackReset();

            const data = new FormData();
            this.form.querySelectorAll('[name]').forEach((el) => {
                data.set(el.name, el.value);
            });

            this.$axios({
                method: 'post',
                url: this.#getEndpoint(),
                data,
                config: { headers: { 'Content-Type': 'multipart/form-data' } },
            }).then((response) => {
                const {
                    invalid_fields: invalidFields,
                    message,
                    status,
                } = response.data;

                this.#feedback(status, invalidFields, message);
            }).catch((error) => {
                console.error('axios error contact form: ', error);
            });
        };

        this.form.addEventListener('submit', onSubmit);
    }

    #getEndpoint() {
        const id = this.form.querySelector('input[name="_wpcf7"]').value;
        return ENDPOINTS.FORM_WPCF7(id);
    }

    #feedback(status, invalidFields, message) {
        let classNameAlertMessage = null;

        if (status === 'validation_failed') {
            classNameAlertMessage = 'danger';

            invalidFields.forEach((field) => {
                const fieldEl = this.form.querySelector(field.into);

                fieldEl.querySelector(`.${constants.class.field}`).classList.add(constants.class.fieldInvalid);

                const fieldElError = fieldEl.querySelector(`.${constants.class.fieldInvalidFeedback}`);
                if (!fieldElError) {
                    const errorEl = document.createElement('span');
                    errorEl.className = constants.class.fieldInvalidFeedback;
                    errorEl.textContent = field.message;
                    fieldEl.appendChild(errorEl);
                } else {
                    fieldElError.textContent = field.message;
                    fieldElError.classList.remove(constants.class.hide);
                }
            });
        } else if (status === 'mail_sent') {
            classNameAlertMessage = 'success';

            this.form.querySelectorAll(`.${constants.class.field}`).forEach((el) => {
                Object.assign(el, {
                    value: '',
                });
            });
        }

        this.#messageEl.textContent = message;
        this.#messageEl.classList.add('alert', `alert-${classNameAlertMessage}`);
    }

    #feedbackReset() {
        this.form.querySelectorAll(`.${constants.class.fieldInvalid}`).forEach((el) => {
            el.classList.remove(constants.class.fieldInvalid);
        });

        this.form.querySelectorAll(`.${constants.class.fieldInvalidFeedback}`).forEach((el) => {
            el.classList.add(constants.class.hide);
        });

        this.#messageEl.className = constants.class.response;
        this.#messageEl.textContent = '';
    }
}
