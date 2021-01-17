import { CompanionInputFieldDropdown, CompanionInputFieldNumber, DropdownChoice } from '../../../instance_skel_types';
import { Accessory } from './controller';
import { BRIGHTNESS_MIN, BRIGHTNESS_MAX, MIRED_MIN, TEMP_CHOICES } from './constants';

export enum OnOffToggle {
	On = 'on',
	Off = 'off',
	Toggle = 'toggle'
}

const choicesByType = (type: string, accessories: Accessory[]): DropdownChoice[] => accessories.filter(accessory => (
	accessory.characteristics.find(({ type }) => type === type)
)).map(({ id, name }): DropdownChoice => ({ id, label: name }));

export const OnOffTogglePicker = (): CompanionInputFieldDropdown => {
	const options = [
		{ id: OnOffToggle.On, label: 'On' },
		{ id: OnOffToggle.Off, label: 'Off' },
		// { id: OnOffToggle.Toggle, label: 'Toggle' },
	];

	return {
		type: 'dropdown',
		label: 'State',
		id: 'state',
		default: OnOffToggle.On,
		choices: options
	}
}

export const BrightnessPicker = (): CompanionInputFieldNumber => {
	return {
		type: 'number',
		label: 'Brightness',
		id: 'value',
		min: BRIGHTNESS_MIN,
		max: BRIGHTNESS_MAX,
		default: BRIGHTNESS_MAX,
		range: true,
	}
}

export const TemperaturePicker = (): CompanionInputFieldDropdown => {
	return {
		type: 'dropdown',
		label: 'Color Temperatiore',
		id: 'value',
		default: MIRED_MIN,
		choices: TEMP_CHOICES,
	}
}

export const AccessoryPicker = (type: string, accessories: Accessory[]): CompanionInputFieldDropdown => {
	const selectedChoices = choicesByType(type, accessories);
	const defaultChoice = selectedChoices[0].id;

	return {
		type: 'dropdown',
		label: 'Accessory',
		id: 'id',
		default: defaultChoice,
		choices: selectedChoices,
	}
};
