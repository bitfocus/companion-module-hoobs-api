const { nanoid } = require('nanoid');

class HoobsController {
    constructor(config, http) {
        this.accessories = [];
        this.token = null;

        this.updateConfig(config);
        this.http = http;
        this.subscriptions = {};
        this.requests = [];
        this.controlTimeout = null;
    }

    destroy() {
        this.unsubscribe()
        if (this.controlTimeout) {
            clearTimeout(this.controlTimeout);
        }
    }

    subscribe(channel, callback) {
        const subscription = nanoid(10);
    
        if (!this.subscriptions[channel]) {
            this.subscriptions[channel] = {};
        }
        this.subscriptions[channel][subscription] = callback;
        return {channel, subscription };
    }

    unsubscribe({channel, subscription}) {
        if (this.subscriptions[channel]) {
            delete this.subscriptions[channel][subscription]
        }
    }

    unsubscribeAll() {
        this.subscriptions = {};
    }

    broadcast(channel, message) {
        if (this.subscriptions[channel]) {
            Object.keys(this.subscriptions[channel]).forEach(subscription => {
                this.subscriptions[channel][subscription].call(null, message);
            });
        }
    }

    updateConfig(config) {
        this.config = config;
        this.baseUrl = `http://${this.config.ip}:${this.config.port}/api`;
        this.token = false;
    }

     getToken() {
        const { username, password } = this.config;
        const body = { username, password };
        const url = `${this.baseUrl}/auth`;

        if (this.token) {
            return Promise.resolve({ token: this.token }); 
        }

        return this.http.post(url, { body }).then(result => {
            if (result.token === false) {
                return Promise.reject(result);
            }
            this.token = result.token;
            return result;
        });
    }

    getAccessories() {
        const url = `${this.baseUrl}/accessories/list`;

        return this.getToken().then(({ token }) => {
            return this.http.get(url, { headers: { authorization: token } }).then(result => {
                if (result.error === 'unauthorized') {
                    this.broadcast('log', { level: 'debug', message: 'Token expired, retrying ...' });
                    this.token = false;
                    return this.getToken().then(({ token }) => {
                        return this.http.get(url, { headers: { authorization: token } })
                    });
                }
                return result;
            })
        })
        .then(result => {
            this.accessories = result.map(accessory => ({
                id: accessory.serial_number,
                aid: accessory.aid,
                type: accessory.type,
                name: accessory.name,
                characteristics: accessory.characteristics.map(item => ({
                    aid: item.aid,
                    iid: item.iid,
                    type: item.type,
                    format: item.format,
                    value: item.value,
                    unit: item.unit,
                    maxValue: item.max_value,
                    minValue: item.min_value,
                }))
            }));
            return this.accessories;
        });
    }

    controlAccessory({ aid, iid, value}) {
        this.requests.push({ aid, iid, value});

        if (this.controlTimeout === null) {
            this.controlTimeout = setTimeout(async () => {
                while (this.requests.length > 0) {
                    const { aid, iid, value } = this.requests.shift();
                    const url = `${this.baseUrl}/accessory/${aid}/${iid}`;
    
                    await this.getToken().then(({ token }) => {
                        return this.http.put(url, { body: { value }, headers: { authorization: token } }).then(result => {
                            if (result.error === 'unauthorized') {
                                this.token = false;
                                return this.getToken().then(({ token }) => {
                                    return this.http.put(url, { body: { value }, headers: { authorization: token } })
                                });
                            }
                            return result;
                        });
                    }).catch(error => this.broadcast('log', { level: 'error', message: error}));
                }
                this.controlTimeout = null;
            }, 0);
        }
    }
}

exports.HoobsController = HoobsController;
