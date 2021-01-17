import { SomeCompanionConfigField } from '../../../instance_skel_types';

const DEFAULT_PORT = 80;
// TODO polling
// const INTERVAL_MIN = 100;
// const INTERVAL_DEFAULT = 250;

export interface DeviceConfig {
  ip?: string
  port?: number,
  username?: string,
  password?: string,
}

export function GetConfigFields(REGEX_IP: string): SomeCompanionConfigField[] {
  return  [
	{
		type: 'textinput',
		id: 'ip',
		label: 'HOOBS Host IP Address',
		width: 6,
		regex: REGEX_IP,
		default: '192.168.1.1',
	},
	{
		type: 'number',
		id: 'port',
		label: `TCP Port (Default: ${DEFAULT_PORT})`,
		min: 80,
		max: 65535,
		width: 6,
		default: DEFAULT_PORT,
		required: true,
	},
	{
		type: 'textinput',
		id: 'username',
		label: 'HOOBS User Name',
		width: 6,
	},
	{
		type: 'textinput',
		id: 'password',
		label: 'HOOBS Password',
		width: 6,
	},
	// TODO polling
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