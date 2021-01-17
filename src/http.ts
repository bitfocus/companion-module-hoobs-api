import { CompanionSystem } from '../../../instance_skel_types';

type KeyValueStore = Record<string, string | number | boolean | null | undefined>;
interface RequestOptions {
    body?: KeyValueStore,
    headers?: KeyValueStore,
}

interface RequestResult {
    error: string,
    data: KeyValueStore,
}

export class HttpService {
    private system: CompanionSystem;

    constructor(system: CompanionSystem) {
        this.system = system;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send(cmd: string, url: string, { body = {}, headers = {} }: RequestOptions):Promise<any> {
        return new Promise<KeyValueStore>((resolve, reject) => {
            if (cmd === 'rest_get') {
                this.system.emit(cmd, url, (err: boolean | null, result: RequestResult) => {
                    if (err !== null) {
                        reject(result.error);
                    }
                    resolve(result.data);
                }, headers);
            } else {
                this.system.emit(cmd, url, body, (err: boolean | null, result: RequestResult) => {
                    if (err !== null) {
                        reject(result.error);
                    }
                    resolve(result.data);
                }, headers);
            }
        })
        .catch(error => {
            throw { code: error.code, error: error.toString() };
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(url: string, options: RequestOptions):Promise<any> {
        return this.send('rest_get', url, options);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post(url: string, options: RequestOptions):Promise<any> {
        return this.send('rest', url, options);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    put(url: string, options: RequestOptions):Promise<any> {
        return this.send('rest_put', url, options);
    }
}
