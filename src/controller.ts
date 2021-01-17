import { nanoid } from 'nanoid';

import { DeviceConfig } from './config';
import { HttpService } from './http';
import { LogMessage, Token} from './utils';

interface Subscription {
	channel: string,
	id: string,
}

type Callback = (message: LogMessage) => void;

interface SubscriptionStore {
	[channel: string]: {
		[id: string]: Callback,
	}
}

export interface Characteristic {
	aid: string,
	iid: string,
	type: string,
	format: string,
	value: string | number,
	unit: string,
	maxValue?: number,
	max_value?: number,
	minValue?: number,
	min_value?: number,
}

export interface Accessory {
	id: string,
	serial_number?: string,
	aid: string,
	type: string,
	name: string,
	characteristics: Characteristic[],
}

interface ControlRequest {
	aid: string,
	iid: string,
	value: string | number | boolean,
}

interface TokenResult {
	token: string | boolean,
	error: string,
}

interface ErrorResult {
	error: string,
}

export class HoobsController {
	private config: DeviceConfig = {};
	private token = '';
	private http: HttpService;
	private subscriptions: SubscriptionStore = {};
	private controlTimeout: NodeJS.Timeout | null = null;
	private baseUrl = '';

	private accessories: Accessory[] = [];
	private requests: ControlRequest[] = [];

	constructor(config: DeviceConfig, http: HttpService) {
		this.updateConfig(config);
		this.http = http;
	}

	destroy(): void {
		this.unsubscribeAll();
		if (this.controlTimeout !== null) {
			clearTimeout(this.controlTimeout);
		}
	}

	subscribe(channel: string, callback: Callback): Subscription {
		const id = nanoid(10);

		if (!this.subscriptions[channel]) {
			this.subscriptions[channel] = {};
		}
		this.subscriptions[channel][id] = callback;
		return { channel, id };
	}

	unsubscribe({ channel, id }: Subscription): void {
		if (this.subscriptions[channel]) {
			delete this.subscriptions[channel][id]
		}
	}

	unsubscribeAll(): void {
		this.subscriptions = {};
	}

	broadcast(channel: string, message: LogMessage): void {
		if (this.subscriptions[channel]) {
			Object.keys(this.subscriptions[channel]).forEach(subscription => {
				this.subscriptions[channel][subscription].call(null, message);
			});
		}
	}

	updateConfig(config: DeviceConfig): void {
		this.config = config;
		this.baseUrl = `http://${this.config.ip}:${this.config.port}/api`;
		this.token = '';
	}

	getToken(): Promise<Token> {
		const { username, password } = this.config;
		const body = { username, password };
		const url = `${this.baseUrl}/auth`;

		if (this.token.length > 0) {
			return Promise.resolve(this.token);
		}

		return this.http.post(url, { body }).then((result: TokenResult) => {
			if (result.token === false) {
				return Promise.reject(result);
			}
			this.token = String(result.token);
			return this.token;
		});
	}

	getAccessories(): Promise<Accessory[]> {
		const url = `${this.baseUrl}/accessories/list`;

		return this.getToken().then((token) => {
			return this.http.get(url, { headers: { authorization: token } }).then((result: ErrorResult & Accessory[]) => {
				if (result.error === 'unauthorized') {
					this.broadcast('log', { level: 'debug', message: 'Token expired, retrying ...' });
					this.token = '';
					return this.getToken().then((token) => {
						return this.http.get(url, { headers: { authorization: token } })
					});
				}
				return result;
			})
		}).then((result) => {
				this.accessories = result.map((accessory: Accessory) => ({
					id: accessory.serial_number,
					aid: accessory.aid,
					type: accessory.type,
					name: accessory.name,
					characteristics: accessory.characteristics.map((item: Characteristic) => ({
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

	controlAccessory({ aid, iid, value }: ControlRequest): void {
		this.requests.push({ aid, iid, value });

		if (this.controlTimeout === null) {
			this.controlTimeout = setTimeout(async () => {
				while (this.requests.length > 0) {
					const { aid, iid, value } = this.requests.shift() ?? {};
					const url = `${this.baseUrl}/accessory/${aid}/${iid}`;

					await this.getToken().then(token => {
						return this.http.put(url, { body: { value }, headers: { authorization: token } }).then(result => {
							if (result.error === 'unauthorized') {
								this.token = '';
								return this.getToken().then(token => {
									return this.http.put(url, { body: { value }, headers: { authorization: token } })
								});
							}
							return result;
						});
					}).catch(error => this.broadcast('log', { level: 'error', message: error }));
				}
				this.controlTimeout = null;
			}, 0);
		}
	}
}

exports.HoobsController = HoobsController;
