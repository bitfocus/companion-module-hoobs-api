import { CompanionActions, CompanionActionEvent } from '../../../instance_skel_types';

import { Accessory, HoobsController } from './controller';
import { AccessoryPicker, BrightnessPicker, OnOffToggle, OnOffTogglePicker, TemperaturePicker } from './choices';
import { Level } from './utils';

export enum ActionId {
	AccessoryPower = 'on',
	AccessoryBrightness = 'brightness',
	AccessoryTemperature = 'color_temperature',
}

type LogFunction = (level: Level, message: string) => void;

type GetStateFunction = () => { accessories: Accessory[], running: boolean, log: LogFunction, controller: HoobsController };

export function GetActionsList(getState: GetStateFunction): CompanionActions {
	const callback = ({ action, options }: CompanionActionEvent) => {
		const { accessories, running, log, controller } = getState();

		if (!running) {
			log('warn', `[${action.toUpperCase()}] action received before instance was ready`);
			return;
		}

		const accessory = accessories.find(({ id }) => id === options.id);
		const value = action === 'on' ? options.state === OnOffToggle.On : Number(options.value);
	
		if (!accessory) {
			log('error', `accessory not found for [${action}] action`);
			return;
		}

		const { aid, iid } = accessory.characteristics.find(({ type }) => type === action) ?? {};

		if (aid === undefined || iid === undefined || value === undefined) {
			log('error', `unable to perform [${action.toUpperCase()}] action on selected accesory`);
			return;
		}

		controller.controlAccessory({ aid, iid, value });
	}

	const { accessories } = getState();

	return {
		[ActionId.AccessoryPower]: {
			label: 'Accessory Power',
			options: [AccessoryPicker(ActionId.AccessoryPower, accessories), OnOffTogglePicker()],
			callback,
		},
		[ActionId.AccessoryBrightness]: {
			label: 'Accessory Brightness',
			options: [AccessoryPicker(ActionId.AccessoryBrightness, accessories), BrightnessPicker()],
			callback,
		},
		[ActionId.AccessoryTemperature]: {
			label: 'Accessory Color Temperature',
			options: [AccessoryPicker(ActionId.AccessoryTemperature, accessories), TemperaturePicker()],
			callback,
		},
	}
}
  