import { ENDPOINTS } from '../constants';

const constants = {
    class: {
        response: 'wpcf7-response-output',
        field: 'form-control',
        fieldInvalid: 'is-invalid',
        fieldInvalidFeedback: 'invalid-feedback',
        hide: 'hidden',
    },
    message: {
        fetchError: 'Mesajul nu a fost trimis. Încearcă din nou.',
    },
};

const initializedForms = new WeakSet();

export default class {
    constructor(form) {
        this.form = form;
    }

    #messageEl = null;

    #submitEl = null;

    #sending = false;

    init() {
        if (initializedForms.has(this.form)) return;
        initializedForms.add(this.form);

        this.#messageEl = this.form.querySelector(`.${constants.class.response}`);
        this.#submitEl = this.form.querySelector('[type="submit"]');

        const onSubmit = (event) => {
            event.preventDefault();

            if (this.#sending) return;
            this.#setSending(true);

            this.#feedbackReset();

            const data = new FormData();
            this.form.querySelectorAll('[name]').forEach((el) => {
                data.set(el.name, el.value);
            });

            $fetch(this.#getEndpoint(), {
                method: 'POST',
                body: data,
            }).then((response) => {
                const {
                    invalid_fields: invalidFields,
                    message,
                    status,
                } = response;

                this.#feedback(status, invalidFields, message);
            }).catch((error) => {
                console.error('fetch error contact form: ', error);
                this.#feedbackFetchError();
            }).finally(() => {
                this.#setSending(false);
            });
        };

        this.form.addEventListener('submit', onSubmit);
    }

    #setSending(sending) {
        this.#sending = sending;

        if (this.#submitEl) this.#submitEl.disabled = sending;
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
                const fieldEl = this.form.querySelector(`[data-name="${field.field}"]`);

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

    #feedbackFetchError() {
        this.#messageEl.textContent = constants.message.fetchError;
        this.#messageEl.classList.add('alert', 'alert-danger');
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
