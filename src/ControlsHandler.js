//////////////////////////////////////////////////////
// HANDLER FUNCTIONS
class ControlsHandler {

    // bypass
    static masterPlayHandler(input) {
        if(input.value === 'on') {
            master.gateOff();
        }
        else {
            master.gateOn();
        }
        input.value = input.value === 'on' ? 'off' : 'on';
        input.dataset.state = input.value;
    }


    static mergerBypassHandler(input, module, merger) {
        if(input.value === 'on') {
            merger.bypassModule(module);
        }
        else {
            merger.thruModule(module);
        }
        input.value = input.value === 'on' ? 'off' : 'on';
        // input.textContent = input.value;
        input.dataset.state = input.value;
    }


    // select
    static typeHandler(input, module) {
        module.setType(input.value);
    }


    //
    static gainHandler(input, module, label = undefined) {
        module.setGain(input.value);
    
        if(label !== undefined) {
            label.textContent = parseInt(input.value *100);
        }
    }
    
    static frequencyHandler(input, module, label = undefined) {
        module.setFrequency(input.value);
        
        if(label !== undefined) {
            label.textContent = input.value;
        }
    }
    
    static QHandler(input, module, label = undefined) {
        module.setQ(input.value);
        
        if(label !== undefined) {
            label.textContent = input.value;
        }
    }


    //kbd
    static keyboardHoldHandler(input) {
        input.value = input.value === 'on' ? 'off' : 'on';
        input.dataset.state = input.value;
    }

    static keyboardModeHandler(input, keyboard) {
        keyboard.mode = input.value;
    }

    static octaveHandler(input, keyboard, label = undefined) {
        let sign = input.value;

        if(sign === '-' && keyboard.octave > 0) {
            keyboard.octave --;
            keyboard.noteControllers.forEach(pad => {
                pad.dataset.frequency /= 2;
            });
        }
        else if(sign === '+' && keyboard.octave < 7) {
            keyboard.octave ++;
            keyboard.noteControllers.forEach(pad => {
                pad.dataset.frequency *= 2;
            });
        }

        label.textContent = keyboard.octave;
    }


    static keyboardNoteHandler(input, module) {
        let f = input.dataset.frequency;

        module.setFrequency(f);
        module.frequencyController.value = f;
        module.frequencyController.label.textContent = f;
    }


    
    static keyboardPadHandler(input, mode, modules) {
        let affected = new Array(modules.length);

        if(mode === 'solo') {
            affected.push({module: modules[0], index: 0});
        }
        else if(mode === 'unisson') {
            for(let i = 0; i < modules.length; i++) {
                affected.push({module: modules[i], index: i});
            }
        }


        affected.forEach(m => {
            let btn = mergerOsc.holdControllers[m.index].input;
            
            ControlsHandler.keyboardNoteHandler(input, m.module);

            if(btn.value === 'off') {
                mergerOsc.thruModule(m.module);
            }
        })
    }


    static keyboardMouseupHandler(input, modules) {

        for(let i = 0; i < modules.length; i++) {
            let controller = mergerOsc.holdControllers[i];
            
            if(controller.input.value == 'off') {
                mergerOsc.bypassModule(controller.targetModule, true);
            }
        }
    }


}









