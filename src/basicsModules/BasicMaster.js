/**
 * @property {AudioNode} inputNode
 * @property {AudioNode} outputNode
 * @property {Boolean} gateState
 * 
 * @property {GainNode} gain - for gain lvl manipulation
 * @property {GainNode} gate - for play/stop
 * 
 * 
 * @method play()
 * @method stop()
 * 
 * @method setGain(value) 
 * @method getGain()
 */

class BasicMaster {
    gateState = false;
    inputNode; 
    outputNode;

    constructor(context) {
        this.context = context;

        this.gain = new GainNode(context, {gain: 0.2});
        this.gate = new GainNode(context, {gain: 0});

        this.inputNode = this.gain;
        this.outputNode = this.gate;

        this.gain.connect(this.gate);
    }

    gateOn() {
        if(this.gateState === false) {
            this.gate.gain.value = 1;
            this.gateState = true;
        }
    }
    gateOff() {
        if(this.gateState === true) {
            this.gate.gain.value = 0;
            this.gateState = false;
        }
    }

    setGain(value) {
        this.gain.gain.value = value;
    }
    getGain() {
        return this.gain.gain.value;
    }

}