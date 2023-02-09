/**
 * Store data about notes, used by the keyboard controller
 */
const REF_NOTES = {
    do: {frequency: 261.63, FR: "do", EN: "C", key: "q"},
    dod: {frequency: 277.18, FR: "do#", EN: "C#", key: "z"},
    re: {frequency: 293.66, FR: "ré", EN: "D", key: "s"},
    red: {frequency: 311.13, FR: "ré", EN: "D#", key: "e"},
    mi: {frequency: 329.63, FR: "mi", EN: "E", key: "d"},
    fa: {frequency: 349.24, FR: "fa", EN: "F", key: "f"},
    fad: {frequency: 369.99, FR: "fa#", EN: "F#", key: "t"},
    sol: {frequency: 392, FR: "sol", EN: "G", key: "g"},
    sold: {frequency: 415.3, FR: "sol#", EN: "G#", key: "y"},
    la: {frequency: 440, FR: "la", EN: "A", key: "h"},
    lad: {frequency: 466.16, FR: "la#", EN: "A#", key: "u"},
    si: {frequency: 493.88, FR: "si", EN: "B", key: "j"},
}

/**
 * Used by all other audio nodes
 */
const ctx = new (window.AudioContext || window.webkitAudioContext)();


/**
 * The main output module (main gain and gate)
 */
let master = new BasicMaster(ctx);
master.gateOn();

/*
 * Two oscillators modules, including their own osc and gain nodes
 */
let osc1 = new BasicOsc(ctx);
osc1.setFrequency(440);

let osc2 = new BasicOsc(ctx);
osc2.setType('saw');
osc2.setFrequency(200);

/** 
 * contains the two oscillators modules
 */
let mergerOsc = new BasicMerger(ctx);
mergerOsc.addModule(osc1);
mergerOsc.addModule(osc2);


/*
 * Two filters modules, LPF and HPF
 */
let filter1 = new BasicFilter(ctx);
let filter2 = new BasicFilter(ctx);
filter2.setType('highpass');

/** 
 * contains filters and permit to bypass each of them individualy
 */
let mergerFilters = new BasicMerger(ctx);
mergerFilters.addModule(filter1);
mergerFilters.addModule(filter2);


/*
 * Connect elements beetween us
 */
mergerOsc.outputNode.connect(mergerFilters.inputNode);
mergerFilters.outputNode.connect(master.inputNode);
master.outputNode.connect(ctx.destination);


///////////////////////////////////////////
// SPECIAL RUN OSCILLATORS
/*
 * Run oscillator at the first click on the document
 */
document.addEventListener('click', (e) => {
    osc1.oscillator.start();
    osc2.oscillator.start();
},
{once: true});


///////////////////////////////////////
// INIT CONTROLLERS

/*
 * MASTER CONTROLS
 */
master.gainController = document.getElementById('master-gain-input');
master.gainController.value = master.getGain();


/*
 * MERGERS CONTROLS
 */
mergerOsc.holdControllers = [
    {targetModule: osc1, input: document.getElementById('osc1-hold-btn')},
    {targetModule: osc2, input: document.getElementById('osc2-hold-btn')},
];
mergerOsc.holdControllers[0].input.value = 'off';
// mergerOsc.holdControllers[0].input.textContent = 'off';
mergerOsc.holdControllers[0].input.dataset.state = 'off';
mergerOsc.holdControllers[1].input.value = 'off';
// mergerOsc.holdControllers[1].input.textContent = 'off';
mergerOsc.holdControllers[1].input.dataset.state = 'off';

mergerFilters.bypassControllers = [
    {targetModule: filter1, input: document.getElementById('filter1-bypass-btn')},
    {targetModule: filter2, input: document.getElementById('filter2-bypass-btn')},
];
mergerFilters.bypassControllers[0].input.value = 'off';
mergerFilters.bypassControllers[0].input.textContent = 'off';
mergerFilters.bypassControllers[0].input.dataset.state = 'off';
mergerFilters.bypassControllers[1].input.value = 'off';
mergerFilters.bypassControllers[1].input.textContent = 'off';
mergerFilters.bypassControllers[1].input.dataset.state = 'off';


/*
 * OSCILLATORS CONTROLS
 */
osc1.typeController = document.getElementById('osc1-type-select');
osc1.frequencyController = document.getElementById('osc1-frequency-input');
osc1.frequencyController.label = document.querySelector('#osc1-frequency-label span');
osc1.gainController = document.getElementById('osc1-gain-input');
osc1.frequencyController.value = osc1.getFrequency();
osc1.frequencyController.label.textContent = osc1.getFrequency();
osc1.gainController.value = osc1.getGain();


osc2.typeController = document.getElementById('osc2-type-select');
osc2.frequencyController = document.getElementById('osc2-frequency-input');
osc2.frequencyController.label = document.querySelector('#osc2-frequency-label span');
osc2.gainController = document.getElementById('osc2-gain-input');
osc2.frequencyController.value = osc2.getFrequency();
osc2.frequencyController.label.textContent = osc2.getFrequency();
osc2.gainController.value = osc2.getGain();



/*
 * FILTERS CONTROLS
 */
filter1.frequencyController = document.getElementById('filter1-frequency-input');
filter1.frequencyController.label = document.querySelector('#filter1-frequency-label span');
filter1.QController = document.getElementById('filter1-Q-input');
filter1.QController.label = document.querySelector('#filter1-Q-label span');
filter1.frequencyController.value = filter1.getFrequency();
filter1.frequencyController.label.textContent = filter1.getFrequency();
filter1.QController.value = filter1.getQ();
filter1.QController.label.textContent = filter1.getQ();


filter2.frequencyController = document.getElementById('filter2-frequency-input');
filter2.frequencyController.label = document.querySelector('#filter2-frequency-label span');
filter2.QController = document.getElementById('filter2-Q-input');
filter2.QController.label = document.querySelector('#filter2-Q-label span');
filter2.frequencyController.value = filter2.getFrequency();
filter2.frequencyController.label.textContent = filter2.getFrequency();
filter2.QController.value = filter2.getQ();
filter2.QController.label.textContent = filter2.getQ();


/*
 * KEYBOARD CONTROLS 
 */
keyboard1 = {octave: 4, mode: "solo"};
keyboard1.modeControllers = document.getElementsByName('keyboard1-mode');
keyboard1.octaveControllers = document.getElementsByName('keyboard1-octave');
keyboard1.octaveControllers.label = document.getElementById('keyboard1-octave-label');
keyboard1.noteControllers = document.getElementsByName('keyboard1-pad');
// init pad with data from REF_NOTES
keyboard1.modeControllers.forEach(input => {
    if(input.value === keyboard1.mode) {
        input.checked = true;
    }
})
keyboard1.noteControllers.forEach(pad => {
    let note = REF_NOTES[pad.dataset.note];
    pad.dataset.frequency = note.frequency;
    pad.dataset.key = note.key;
    pad.value = note.key;
});

console.log(keyboard1)
///////////////////////////////////////
// EVENTS LISTENERS

/*
 * MASTER EVENTS
 */
master.gainController.addEventListener('input', (e) => ControlsHandler.gainHandler(e.target, master, e.target.label));


/*
 * MERGERS EVENTS
 */
mergerOsc.holdControllers.forEach(controller => {
    controller.input.addEventListener('click', (e) => ControlsHandler.mergerBypassHandler(e.target, controller.targetModule, mergerOsc));
});

mergerFilters.bypassControllers.forEach(controller => {
    controller.input.addEventListener('click', (e) => ControlsHandler.mergerBypassHandler(e.target, controller.targetModule, mergerFilters));
});


/*
 * OSCILLATORS EVENTS 
 */
osc1.typeController.addEventListener('input', (e) => ControlsHandler.typeHandler(e.target, osc1));
osc1.frequencyController.addEventListener('input', (e) => ControlsHandler.frequencyHandler(e.target, osc1, e.target.label));
osc1.gainController.addEventListener('input', (e) => ControlsHandler.gainHandler(e.target, osc1));
osc2.typeController.addEventListener('input', (e) => ControlsHandler.typeHandler(e.target, osc2));
osc2.frequencyController.addEventListener('input', (e) => ControlsHandler.frequencyHandler(e.target, osc2, e.target.label));
osc2.gainController.addEventListener('input', (e) => ControlsHandler.gainHandler(e.target, osc2));


/*
 * FILTERS EVENTS 
 */
filter1.frequencyController.addEventListener('input', (e) => ControlsHandler.frequencyHandler(e.target, filter1, e.target.label));
filter1.QController.addEventListener('input', (e) => ControlsHandler.QHandler(e.target, filter1, e.target.label));

filter2.frequencyController.addEventListener('input', (e) => ControlsHandler.frequencyHandler(e.target, filter2, e.target.label));
filter2.QController.addEventListener('input', (e) => ControlsHandler.QHandler(e.target, filter2, e.target.label));


/*
 * KEYBOARDS EVENTS 
 */
keyboard1.modeControllers.forEach(elt => {
    elt.addEventListener('input', (e) => {ControlsHandler.keyboardModeHandler(e.target, keyboard1)});
})

keyboard1.octaveControllers.forEach(elt => {
    elt.addEventListener('click', (e) => { ControlsHandler.octaveHandler(e.target, keyboard1, keyboard1.octaveControllers.label)});
})


keyboard1.noteControllers.forEach(pad => {
    pad.addEventListener('mousedown', (e) => { 
        ControlsHandler.keyboardPadHandler(e.target, keyboard1.mode, [osc1, osc2])
    });

    pad.addEventListener('mouseup', (e) => {
        ControlsHandler.keyboardMouseupHandler(e.target, [osc1, osc2]);
    })
})


/*
 * KEYS EVENTS
 */

document.addEventListener('keydown', (e) => {
    keyboard1.noteControllers.forEach(pad => {
        if(e.key === pad.dataset.key) {
            ControlsHandler.keyboardPadHandler(pad, keyboard1.mode, [osc1, osc2])
        }
    })
})
document.addEventListener('keyup', (e) => {
    keyboard1.noteControllers.forEach(pad => {
        if(e.key === pad.dataset.key) {
            ControlsHandler.keyboardMouseupHandler(pad, [osc1, osc2]);

        }
    })
})