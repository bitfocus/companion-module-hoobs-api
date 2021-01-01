const mround = (value, precision) => Math.round(value / precision) * precision;

const miredToKelvin = (mired) => 1e6 / mired;
const kelvinToMired = (kelvin) => 1e6 / kelvin;

const getKelvin = (mired) => mround(miredToKelvin(mired), 50);
const getMired = (kelvin) => Math.round(kelvinToMired(kelvin));

class Http {
    constructor(system) {
        this.system = system;
    }

    send(cmd, url, { body = {}, headers = {} }) {
        // console.log('send', cmd, url, body);
        return new Promise((resolve, reject) => {
            if (cmd === 'rest_get') {
                this.system.emit(cmd, url, (err, result) => {
                    if (err !== null) {
                        reject(result.error.code);
                    }
                    resolve(result.data);
                }, headers);
            } else {
                this.system.emit(cmd, url, body, (err, result) => {
                    if (err !== null) {
                        reject(result.error.code);
                    }
                    resolve(result.data);
                }, headers);
            }
        })
        // .then(data => (console.log('result', data), data));
    }

    get(url, options) {
        return this.send('rest_get', url, options);
    }

    post(url, options) {
        return this.send('rest', url, options);
    }

    put(url, options) {
        return this.send('rest_put', url, options);
    }
}

module.exports = {
    mround,
    miredToKelvin,
    kelvinToMired,
    getKelvin,
    getMired,
    Http
}
