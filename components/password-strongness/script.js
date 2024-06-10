app.component('password-strongness', {
    template: $TEMPLATES['password-strongness'],

    components: {
        VueRecaptcha
    },

    props: {
        password: {
            type: String,
            required: true
        }
    },

    setup() {
        const text = Utils.getTexts('password-strongness')
        return { text }
    },

    mounted() {
        let api = new API();
        api.GET($MAPAS.baseURL + "auth/passwordvalidationinfos").then(async response => response.json().then(validations => {
            
            this.passwordRules = validations.passwordRules;

            this.passwordRules.minimumPasswordLength = this.passwordRules.minimumPasswordLength || 8;
        }));
    },

    data() {
        const passwordRules = {};

        const passwordMustHaveCapitalLetters = /[A-Z]/;
        const passwordMustHaveLowercaseLetters = /[a-z]/;
        const passwordMustHaveSpecialCharacters = /[$@$!%*#?&\.\,\:<>+\_\-\"\'()]/;
        const passwordMustHaveNumbers = /[0-9]/;

        return {
            passwordRules,
            passwordMustHaveCapitalLetters,
            passwordMustHaveLowercaseLetters,
            passwordMustHaveSpecialCharacters,
            passwordMustHaveNumbers
        }
    },

    methods: {
        getErrors() {
            const errors = [
                {
                    "rule": this.passwordRules.minimumPasswordLength,
                    "error": this.password.length < this.passwordRules.minimumPasswordLength,
                    "message": this.text('pelo menos {num} caracteres').replace('{num}', this.passwordRules.minimumPasswordLength)
                },
                {
                    "rule": this.passwordRules.passwordMustHaveCapitalLetters,
                    "error": this.passwordRules.passwordMustHaveCapitalLetters && !this.passwordMustHaveCapitalLetters.test(this.password),
                    "message": this.text('pelo menos uma letra maiúscula')
                },
                {
                    "rule": this.passwordRules.passwordMustHaveLowercaseLetters,
                    "error": this.passwordRules.passwordMustHaveLowercaseLetters && !this.passwordMustHaveLowercaseLetters.test(this.password),
                    "message": this.text('pelo menos uma letra minúscula')
                },
                {
                    "rule": this.passwordRules.passwordMustHaveSpecialCharacters,
                    "error": this.passwordRules.passwordMustHaveSpecialCharacters && !this.passwordMustHaveSpecialCharacters.test(this.password),
                    "message": this.text('pelo menos um caracter especial')
                },
                {
                    "rule": this.passwordRules.passwordMustHaveNumbers,
                    "error": this.passwordRules.passwordMustHaveNumbers && !this.passwordMustHaveNumbers.test(this.password),
                    "message": this.text('pelo menos um número')
                }
            ];

            return errors;
        },

        rules() {
            const rules = [];
            
            if (this.passwordRules.passwordMustHaveCapitalLetters) {
                rules.push(this.passwordMustHaveCapitalLetters);
            }

            if (this.passwordRules.passwordMustHaveLowercaseLetters) {
                rules.push(this.passwordMustHaveLowercaseLetters);
            }

            if (this.passwordRules.passwordMustHaveSpecialCharacters) {
                rules.push(this.passwordMustHaveSpecialCharacters);
            }

            if (this.passwordRules.passwordMustHaveNumbers) {
                rules.push(this.passwordMustHaveNumbers);
            }

            return rules;
        },
        strongness() {
            if (this.password) {
                const minimumPasswordLength = this.passwordRules.minimumPasswordLength;
                const rules = this.rules();
                
                const rulesLength = rules.length;
                const percentToAdd = 100 / (rulesLength + 1);
                const pass = this.password;

                let prog = 0;

                for(let rule of rules) {
                    if(rule.test(this.password)) {
                        prog++;
                    }
                }

                let currentPercent = prog * 100 / (rulesLength + 1);

                if (this.password.length > minimumPasswordLength - 1) {
                    currentPercent = currentPercent + percentToAdd;
                }

                return currentPercent.toFixed(0);
            } else {
                return 0;
            }

        },

        strongnessClass() {
            if (this.strongness() <= 40) {
                return 'fraco';
            } else if (this.strongness() <= 80) {
                return 'medio';
            } else {
                return 'forte';
            }
        }
    },
});
