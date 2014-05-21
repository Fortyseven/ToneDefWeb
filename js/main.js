var ToneDef = angular.module( "ToneDef", ['ngRoute'] );

ToneDef.config( ['$routeProvider', function ( $routeProvider )
{
    $routeProvider
            .when( '/', {
                templateUrl: 'app/views/main.html',
                controller:  "Main"
            } )
            .when( '/dtmf', {
                templateUrl: 'app/views/dtmf.html',
                controller:  "KeypadDTMF"
            } )
            .when( '/bluebox', {
                templateUrl: 'app/views/bluebox.html',
                controller:  "KeypadBluebox"
            } )
            .when( '/other', {
                templateUrl: 'app/views/other.html',
                controller:  "KeypadOther"
            } )
            .otherwise( {
                redirectTo: '/'
            } );
}] );

ToneDef.audioContext = null;
var oscillatorNode = [];
var gainNode = [];

init();

function init()
{
    if ( typeof AudioContext !== "undefined" ) {
        ToneDef.audioContext = new AudioContext();
    }
    else if ( typeof webkitAudioContext !== "undefined" ) {
        ToneDef.audioContext = new webkitAudioContext();
    }
    else {
        throw new Error( "Web Audio API not supported" );
    }
    ToneDef.audioContext.destination.channelCount = 1;
}

function bindButton( id_label, freqs )
{
    $( id_label )
            .on( "touchstart", function ()
            {
                playTones( freqs );
            } )
            .on( "mousedown", function ()
            {
                playTones( freqs );
            } )
            .on( "mouseup", function ()
            {
                stopTones();
            } )
            .on( "touchend", function ()
            {
                stopTones();
            } )
            .on( "touchmove", function ()
            {
                stopTones();
            } )
            .on( "touchcancel", function ()
            {
                stopTones();
            } )
    ;

}

function bindDTMF( id_suffix, freqs )
{
    bindButton( "#dtmf" + id_suffix, Array.prototype.slice.call( arguments, 1 ) );
}
function bindBlueBox( id_suffix, freqs )
{
    bindButton( "#bluebox" + id_suffix, Array.prototype.slice.call( arguments, 1 ) );
}

function stopTones()
{
    for ( o in oscillatorNode ) {
        if ( oscillatorNode[o] ) {
            oscillatorNode[o].stop( 0 );
            oscillatorNode[o].disconnect();
        }
        oscillatorNode[o] = null;
    }
}

function playTones( freqs )
{
    for ( i = 0; i < freqs.length; i++ ) {
        if ( oscillatorNode[i] ) {
            if ( oscillatorNode[i].playbackState > 0 ) {
                oscillatorNode[i].stop( 0 );
                oscillatorNode[i].disconnect();
                oscillatorNode[i] = null;
            }
        }
        oscillatorNode[i] = ToneDef.audioContext.createOscillator();
        gainNode[i] = ToneDef.audioContext.createGain();

        gainNode[i].gain.value = 1.0 / freqs.length;
        gainNode[i].connect( ToneDef.audioContext.destination );

        //gainNode[i].connect( ToneDef.audioContext.destination );
        oscillatorNode[i].frequency.value = freqs[i];
        oscillatorNode[i].connect( gainNode[i] );

        oscillatorNode[i].start( 0 );
    }
}

ToneDef.controller( "Main", ['$scope', function ( $scope )
{
    $( "#Tabs *" ).removeClass( "selected" );
    $( "#tab_home" ).addClass( "selected" );
}] );

ToneDef.controller( "KeypadDTMF", ['$scope', function ( $scope )
{
    console.log( "Switching to DTMF mode" );

    $( "#Tabs *" ).removeClass( "selected" );
    $( "#tab_dtmf" ).addClass( "selected" );

    bindDTMF( "1", 697, 1209 );
    bindDTMF( "2", 697, 1336 );
    bindDTMF( "3", 697, 1477 );
    bindDTMF( "A", 697, 1633 );

    bindDTMF( "4", 770, 1209 );
    bindDTMF( "5", 770, 1336 );
    bindDTMF( "6", 770, 1477 );
    bindDTMF( "B", 770, 1633 );

    bindDTMF( "7", 852, 1209 );
    bindDTMF( "8", 852, 1336 );
    bindDTMF( "9", 852, 1477 );
    bindDTMF( "C", 852, 1633 );

    bindDTMF( "Pnd", 941, 1477 );
    bindDTMF( "0", 941, 1336 );
    bindDTMF( "Str", 941, 1209 );
    bindDTMF( "D", 941, 1633 );
}] );

ToneDef.controller( "KeypadBluebox", ['$scope', function ( $scope )
{
    $( "#Tabs *" ).removeClass( "selected" );
    $( "#tab_bluebox" ).addClass( "selected" );

    bindBlueBox( "2600", 2600 );

    bindBlueBox( "1", 700, 900 );
    bindBlueBox( "2", 700, 1100 );
    bindBlueBox( "3", 900, 1100 );

    bindBlueBox( "4", 700, 1300 );
    bindBlueBox( "5", 900, 1300 );
    bindBlueBox( "6", 1100, 1300 );

    bindBlueBox( "7", 700, 1500 );
    bindBlueBox( "8", 900, 1500 );
    bindBlueBox( "9", 1100, 1500 );

    bindBlueBox( "Pnd", 1100, 1700 );
    bindBlueBox( "0", 1300, 1500 );
    bindBlueBox( "Str", 1500, 1700 );
}] );

ToneDef.controller( "KeypadOther", ['$scope', function ( $scope )
{
    $( "#Tabs *" ).removeClass( "selected" );
    $( "#tab_other" ).addClass( "selected" );
}] );
