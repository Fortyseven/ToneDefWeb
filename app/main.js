var ToneDef = angular.module( "ToneDef", ['ngRoute'] );

ToneDef.OnKeyDown = function ( e )
{
    e = e || window.event;

    var button = ToneDef.keybinds[e.key] || ToneDef.keybinds[ e.which || e.keyCode ] || null;

    // play tone and highlight button
    if ( button ) {
        $( button ).get( 0 ).tonegen.playTones();
        $( button ).addClass( "active" );
    }
}

ToneDef.OnKeyUp = function ( e )
{
    e = e || window.event;

    var button = ToneDef.keybinds[e.key] || ToneDef.keybinds[ e.which || e.keyCode ] || null;

    if ( button ) {
        $( button ).get( 0 ).tonegen.stopTones();
        $( button ).removeClass( "active" );
    }
}

//var oscillatorNode = [];
//var gainNode = [];

init();

/* ------------------------- */
function init()
{
    ToneDef.audioContext = null;

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
                .when( '/redbox', {
                    templateUrl: 'app/views/redbox.html',
                    controller:  "KeypadRedbox"
                } )
                .when( '/other', {
                    templateUrl: 'app/views/other.html',
                    controller:  "KeypadOther"
                } )
                .otherwise( {
                    redirectTo: '/'
                } );
    }] );

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

    ToneDef.keybinds = [];

    //TODO: Keep track of key state to avoid key repeats?
    document.onkeydown = ToneDef.OnKeyDown;
    document.onkeyup = ToneDef.OnKeyUp;
}

function bindDTMF( id_suffix, keys, freqs )
{
    ToneDef.bindButton( "#dtmf" + id_suffix, keys, Array.prototype.slice.call( arguments, 2 ) );
}

function bindBlueBox( id_suffix, keys, freqs )
{
    ToneDef.bindButton( "#bluebox" + id_suffix, keys, Array.prototype.slice.call( arguments, 2 ) );
}

ToneDef.resetKeyboardBindings = function ()
{
    ToneDef.keybinds = [];
}

ToneDef.controller( "Main", ['$scope', function ( $scope )
{
    $( "#Tabs *" ).removeClass( "selected" );
    $( "#tab_home" ).addClass( "selected" );
}] );

ToneDef.KEY_0 = [48, 96];
ToneDef.KEY_1 = [49, 97];
ToneDef.KEY_2 = [50, 98];
ToneDef.KEY_3 = [51, 99];
ToneDef.KEY_4 = [52, 100];
ToneDef.KEY_5 = [53, 101];
ToneDef.KEY_6 = [54, 102];
ToneDef.KEY_7 = [55, 103];
ToneDef.KEY_8 = [56, 104];
ToneDef.KEY_9 = [57, 105];
ToneDef.KEY_A = ["a", "A", 65];
ToneDef.KEY_B = ["b", "B", 66];
ToneDef.KEY_C = ["c", "C", 67];
ToneDef.KEY_D = ["d", "D", 68];
ToneDef.KEY_STAR = ["*", 106];
ToneDef.KEY_HASH = ["#", 80];

ToneDef.controller( "KeypadDTMF", ['$scope', function ( $scope )
{
    $( "#Tabs *" ).removeClass( "selected" );
    $( "#tab_dtmf" ).addClass( "selected" );

    ToneDef.resetKeyboardBindings();

    bindDTMF( "1", ToneDef.KEY_1, 697, 1209 );
    bindDTMF( "2", ToneDef.KEY_2, 697, 1336 );
    bindDTMF( "3", ToneDef.KEY_3, 697, 1477 );
    bindDTMF( "A", ToneDef.KEY_A, 697, 1633 );

    bindDTMF( "4", ToneDef.KEY_4, 770, 1209 );
    bindDTMF( "5", ToneDef.KEY_5, 770, 1336 );
    bindDTMF( "6", ToneDef.KEY_6, 770, 1477 );
    bindDTMF( "B", ToneDef.KEY_B, 770, 1633 );

    bindDTMF( "7", ToneDef.KEY_7, 852, 1209 );
    bindDTMF( "8", ToneDef.KEY_8, 852, 1336 );
    bindDTMF( "9", ToneDef.KEY_9, 852, 1477 );
    bindDTMF( "C", ToneDef.KEY_C, 852, 1633 );

    bindDTMF( "Pnd", ToneDef.KEY_HASH, 941, 1477 );
    bindDTMF( "0", ToneDef.KEY_0, 1336 );
    bindDTMF( "Str", ToneDef.KEY_STAR, 941, 1209 );
    bindDTMF( "D", ToneDef.KEY_D, 941, 1633 );
}] );

ToneDef.controller( "KeypadBluebox", ['$scope', function ( $scope )
{
    $( "#Tabs *" ).removeClass( "selected" );
    $( "#tab_bluebox" ).addClass( "selected" );

    ToneDef.resetKeyboardBindings();

    bindBlueBox( "2600", " ", 2600 );

    bindBlueBox( "1", ToneDef.KEY_1, 700, 900 );
    bindBlueBox( "2", ToneDef.KEY_2, 700, 1100 );
    bindBlueBox( "3", ToneDef.KEY_3, 900, 1100 );

    bindBlueBox( "4", ToneDef.KEY_4, 700, 1300 );
    bindBlueBox( "5", ToneDef.KEY_5, 900, 1300 );
    bindBlueBox( "6", ToneDef.KEY_6, 1100, 1300 );

    bindBlueBox( "7", ToneDef.KEY_7, 700, 1500 );
    bindBlueBox( "8", ToneDef.KEY_8, 900, 1500 );
    bindBlueBox( "9", ToneDef.KEY_9, 1100, 1500 );

    bindBlueBox( "Pnd", ToneDef.KEY_HASH, 1100, 1700 );
    bindBlueBox( "0", ToneDef.KEY_0, 1300, 1500 );
    bindBlueBox( "Str", ToneDef.KEY_STAR, 1500, 1700 );
}] );

ToneDef.controller( "KeypadRedbox", ['$scope', function ( $scope )
{
    $( "#Tabs *" ).removeClass( "selected" );
    $( "#tab_redbox" ).addClass( "selected" );

    ToneDef.resetKeyboardBindings();

//    bindBlueBox( "2600", " ", 2600 );
//
//    bindBlueBox( "1", "1", 700, 900 );
//    bindBlueBox( "2", "2", 700, 1100 );
//    bindBlueBox( "3", "3", 900, 1100 );
//
//    bindBlueBox( "4", "4", 700, 1300 );
//    bindBlueBox( "5", "5", 900, 1300 );
//    bindBlueBox( "6", "6", 1100, 1300 );
//
//    bindBlueBox( "7", "7", 700, 1500 );
//    bindBlueBox( "8", "8", 900, 1500 );
//    bindBlueBox( "9", "9", 1100, 1500 );
//
//    bindBlueBox( "Pnd", "#", 1100, 1700 );
//    bindBlueBox( "0", "0", 1300, 1500 );
//    bindBlueBox( "Str", "*", 1500, 1700 );
}] );

/* ------------------------- */
ToneDef.controller( "KeypadOther", ['$scope', function ( $scope )
{
    $( "#Tabs *" ).removeClass( "selected" );
    $( "#tab_other" ).addClass( "selected" );
}] );
