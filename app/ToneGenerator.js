var ToneGenerator = function ()
{
    this.oscillatorNode = [];
    this.gainNode = [];
    this.freqs = [];

    /* Originally I had an oscillator pool, but apparently "the API is optimized for repeated creating of
     audio nodes". So ALL OF THIS, *EVERY TIME* is better than starting/stopping a single object?
     Really? */

    this.playTones = function ()
    {
        this.stopTones();

        for ( var i = 0; i < this.freqs.length; i++ ) {
            this.oscillatorNode[i] = ToneDef.audioContext.createOscillator();
            this.gainNode[i] = ToneDef.audioContext.createGain();

            this.gainNode[i].gain.value = 1.0 / this.freqs.length;
            this.gainNode[i].connect( ToneDef.audioContext.destination );

            //gainNode[i].connect( ToneDef.audioContext.destination );
            this.oscillatorNode[i].frequency.value = this.freqs[i];
            this.oscillatorNode[i].connect( this.gainNode[i] );
            this.oscillatorNode[i].isPlaying = true;
            this.oscillatorNode[i].start( 0 );
        }
    }

    this.stopTones = function ()
    {
        for ( var i = 0; i < this.oscillatorNode.length; i++ ) {
            if ( this.oscillatorNode[i] ) {
                if ( this.oscillatorNode[i].isPlaying ) {
                    this.oscillatorNode[i].stop( 0 );
                    this.oscillatorNode.isPlaying = false;
                }
            }
        }
    }

    this.setFrequencies = function ( freqs )
    {
        this.freqs = freqs;
    }
};

ToneDef.bindKeys = function ( id_label, keys )
{
    for ( var k = 0; k < keys.length; k++ ) {
        ToneDef.keybinds[ keys[k] ] = id_label;
    }
}

ToneDef.bindButton = function ( id_label, keys, freqs )
{
    console.log("Binding " + id_label);
    var element = $( id_label );
    var dom = element.get(0);

    dom.tonegen = new ToneGenerator();
    dom.tonegen.setFrequencies( freqs );
    element
            .on( "touchstart", function ()
            {
                dom.tonegen.playTones();
            } )
            .on( "mousedown", function ()
            {
                dom.tonegen.playTones();
            } )
            .on( "mouseup", function ()
            {
                dom.tonegen.stopTones();
            } )
            .on( "touchend", function ()
            {
                dom.tonegen.stopTones();
            } )
            .on( "touchmove", function ()
            {
                dom.tonegen.stopTones();
            } )
            .on( "touchcancel", function ()
            {
                dom.tonegen.stopTones();
            } );
    ;

    ToneDef.bindKeys( id_label, keys );
}