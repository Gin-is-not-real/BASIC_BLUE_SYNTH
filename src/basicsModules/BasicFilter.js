/**
 * @property {AudioNode} inputNode
 * @property {AudioNode} outputNode
 * 
 * @property {BiquadFilterNode} filter
 * 
 * @method SETTERS/GETTERS type, frequency, Q, gain, detune
 */

class BasicFilter {
    inputNode;
    outputNode;

    constructor(context, type = 'lowpass') {
        this.filter = new BiquadFilterNode(context, {type: type});
        this.inputNode = this.filter;
        this.outputNode = this.filter;
    }


    setType(type) {
        this.filter.type = type;
    }
    setFrequency(value) {
        this.filter.frequency.value = value;
    }
    setQ(value) {
        this.filter.Q.value = value;
    }
    setGain(value) {
        this.filter.gain.value = value;
    }
    setDetune(value) {  
        this.filter.detune.value = value;
    }


    getType() {
        return this.filter.type;
    }
    getFrequency() {
        return this.filter.frequency.value;
    }
    getQ() {
        return this.filter.Q.value;
    }
    getGain() {
        return this.filter.gain.value;
    }
    getDetune() {
        return this.filter.detune.value;
    }
}