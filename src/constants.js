const { getMired } = require('./utils');

module.exports = {
    initConstants() {

        this.BRIGHTNESS_MIN = 1;
        this.BRIGHTNESS_MAX = 100;

        this.TEMPERATURE_MIN = 154;
        this.TEMPERATURE_MAX = 370;

        this.defineConst('DEFAULT_PORT', 80)

        this.defineConst('BRIGHTNESS_MIN', 1);
        this.defineConst('BRIGHTNESS_MAX', 100);
        
        this.defineConst('MIRED_MIN', 154);
        this.defineConst('MIRED_MAX', 370);
        
        this.defineConst('KELVIN_MAX', 6500);
        this.defineConst('KELVIN_MIN', 2700);
        this.defineConst('KELVIN_STEP', 50);

        this.defineConst('KELVIN_LIST', Array.from(Array((this.KELVIN_MAX - this.KELVIN_MIN) / this.KELVIN_STEP + 1).keys())
            .map(n => (n + (this.KELVIN_MIN / this.KELVIN_STEP)) * this.KELVIN_STEP)
            .reverse());

        this.defineConst('TEMP_CHOICES', this.KELVIN_LIST.map(kelvin => ({
            id: getMired(kelvin),
            label: `${kelvin}K`,
        })));
    }
}
