module.exports = {
    config_fields() {
        return [
            {
                type: 'textinput',
                id: 'host',
                label: `1HOOBS Domain Name (Default: ${this.DEFAULT_HOST})`,
                width: 6,
                default: this.DEFAULT_HOST,
                required: true,
            },
            {
                type: 'textinput',
                id: 'port',
                label: `TCP Port (Default: ${this.DEFAULT_PORT})`,
                width: 6,
                regex: this.REGEX_PORT,
                default: this.DEFAULT_PORT,
                required: true,
            },
            {
                type: 'textinput',
                id: 'username',
                label: 'HOOBS User Name',
                width: 6,
                required: true,
            },
            {
                type: 'textinput',
                id: 'password',
                label: 'HOOBS Password',
                width: 6,
                required: true,
            },
            // TODO
            // {
            //     type: 'checkbox',
            //     id: 'polling',
            //     label: 'Enable Polling?',
            //     width: 3,
            //     default: true,
            // },
            // {
            //     type: 'number',
            //     id: 'interval',
            //     label: `Polling interval in milliseconds (default: ${this.INTERVAL_DEFAULT}, min: ${this.INTERVAL_MIN})`,
            //     width: 9,
            //     min: this.INTERVAL_MIN,
            //     default: this.INTERVAL_DEFAULT,
            //     required: true,
            // },
        ];
    }
}
