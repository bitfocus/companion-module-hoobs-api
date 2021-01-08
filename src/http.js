class Http {
    constructor(system) {
        this.system = system;
    }

    send(cmd, url, { body = {}, headers = {} }) {
        return new Promise((resolve, reject) => {
            if (cmd === 'rest_get') {
                this.system.emit(cmd, url, (err, result) => {
                    if (err !== null) {
                        reject(result.error);
                    }
                    resolve(result.data);
                }, headers);
            } else {
                this.system.emit(cmd, url, body, (err, result) => {
                    if (err !== null) {
                        reject(result.error);
                    }
                    resolve(result.data);
                }, headers);
            }
        })
        .catch(error => {
            throw { code: error.code, error: error.toString() };
        })
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
    Http
}
