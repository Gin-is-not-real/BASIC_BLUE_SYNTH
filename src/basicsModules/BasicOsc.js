/**
 * @property {AudioNode} outputNode
 * 
 * @property {OscillatorNode} oscillator
 * @property {GainNode} gain 
 * 
 * @method SETTERS type, frequency, gain
 * @method GETTERS type, frequency, gain
 */

class BasicOsc {
    outputNode;

    constructor(context) {
        this.context = context;

        this.oscillator = new OscillatorNode(context);
        this.gain = new GainNode(context);

        this.outputNode = this.gain;

        this.oscillator.connect(this.gain);
    }


    setType(type) {
        this.oscillator.type = type;
    }
    setFrequency(value) {
        this.oscillator.frequency.value = value;
    }
    setGain(value) {
        this.gain.gain.value = value;
    }

    getType() {
        return this.oscillator.type;
    }
    getFrequency() {
        return this.oscillator.frequency.value;
    }
    getGain() {
        return this.gain.gain.value;
    }
}