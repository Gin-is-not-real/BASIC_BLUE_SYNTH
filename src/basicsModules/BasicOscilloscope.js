/**
 * @property {AudioNode} inputNode
 * @property {AudioNode} outputNode
 * @property {AnalyserNode} analyser
 * 
 * @method drawScreen()
 * @method run()
 * @method animationStart(time)
 * @method animationStop()
 */
class BasicOscilloscope {
    inputNode;
    outputNode;


    constructor(context, canvas, fftSize = 256) {
        this.canvas = canvas;
        this.context2d = this.canvas.getContext('2d');
        this.context = context;

        this.analyser = new AnalyserNode(this.context, {
            smoothingTimeConstant: 1,
            fftSize: fftSize
        });


        this.inputNode = this.analyser;
        this.outputNode = this.analyser;
    }


    getFftSize() {
        return this.analyser.fftSize;
    }
    setFftSize(size) {
        this.analyser.fftSize = size;
    }


    drawScreen() {
        let s = window.getComputedStyle(this.canvas);
        
        this.context2d.fillStyle = s.backgroundColor;
        this.context2d.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        // this.context2d.lineWidth = 0.5;
        // this.context2d.strokeStyle = s.color;
    
        // // horizontal line
        // this.context2d.beginPath();
        // this.context2d.moveTo(0, this.canvas.height /2);
        // this.context2d.lineTo(this.canvas.width, this.canvas.height /2);
        // this.context2d.stroke();

        // // vertical line
        // this.context2d.beginPath();
        // this.context2d.moveTo(this.canvas.width / 2, 0);
        // this.context2d.lineTo(this.canvas.width /2, this.canvas.height);
        // this.context2d.stroke();
    }

    run() {
        // this.reqAnimationId = undefined;
        // this.animationStart();
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(this.dataArray);

        
        let bytes = this.dataArray.length;
        let width = this.canvas.width;
        let height = this.canvas.height;

        this.drawScreen();

        // segment length
        let segmentLength = width / bytes;

        // start path
        this.context2d.strokeStyle = 'rgba(63, 204, 247, 0.75)';
        this.context2d.beginPath();
        this.context2d.moveTo(-100, height/2);

        // loop on data
        for(let i = 0; i < this.dataArray.length; i ++) {
            let x = i * segmentLength;
            let v = this.dataArray[i] / 128.0;
            let y = (v * height) / 2;

            this.context2d.lineTo(x, y);
        }

        this.context2d.lineTo(width +100, height/2);
        this.context2d.stroke();
    }

    animationStart(time) {
        let self = this;
        this.intervalId = setInterval(function() {
            self.drawScreen();

            self.run();
        }, time);
    }
    
    animationStop() {
        if(this.intervalId) {
            window.clearInterval(this.intervalId);
            this.intervalId = undefined;
            this.drawScreen();
        }
    }

}