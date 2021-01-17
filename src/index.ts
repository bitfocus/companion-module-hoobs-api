import InstanceSkel from '../../../instance_skel';
import { CompanionConfigField, CompanionSystem } from '../../../instance_skel_types';

import { HttpService } from './http';
import { Accessory, HoobsController } from './controller';
import { DeviceConfig, GetConfigFields } from './config';
import { LogMessage, Status } from './utils';
import { GetActionsList } from './actions';

class ControllerInstance extends InstanceSkel<DeviceConfig> {
    private accessories: Accessory[] = [];
    private running = false;

    private controller: HoobsController;

    constructor(system: CompanionSystem, id: string, config: DeviceConfig) {
        super(system, id, config);

        this.system = system;
        this.config = config;

        const http = new HttpService(this.system);
        this.controller = new HoobsController(this.config, http);
    }

    init(): void {
        this.controller.subscribe('log', this.logMessage.bind(this));
        this.initHoobs();
    }

    updateConfig(config: DeviceConfig): void {
        this.config = config;
        this.controller.updateConfig(config);
        this.initHoobs();
    }

    config_fields(): CompanionConfigField[] {
        return GetConfigFields(this.REGEX_IP)
    }

    destroy(): void {
        this.controller.destroy();
    }

    initHoobs(): void {
        if (this.config.ip && this.config.port) {
            this.status(this.STATUS_UNKNOWN, 'Connecting ...');
            this.controller.getAccessories()
                .then(accessories => {
                    this.accessories = accessories;

                    this.setActions(GetActionsList((() => ({
                        accessories: this.accessories,
                        log: this.log,
                        running: this.running,
                        controller: this.controller,
                    }))));

                    this.status(this.STATUS_OK);
                })
                .catch(({ error }) => {
                    this.logMessage({ level: 'error', message: error }, this.STATUS_ERROR)
                });
        } else {
            this.logMessage({ level: 'warn', message: 'Unable to connect to HOOBS, please check configuration.' }, this.STATUS_ERROR);
        }
    }

    status(level: Status, message?: string): void {
        super.status(level, message);
        this.running = level === this.STATUS_OK;
    }

    logMessage({ level, message }: LogMessage, status: Status = this.STATUS_OK): void {
        this.log(level, message);
        this.status(status, message);
    }

}

export = ControllerInstance
