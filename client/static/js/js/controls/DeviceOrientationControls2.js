/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls2= function ( object ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( "YXZ" );

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	var deltaAlpha=0,deltaBeta=0,deltaGamma=0,deltaScreenOrientation=0;

	var onDeviceOrientationChangeEvent = function ( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function () {

		scope.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function () {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function ( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler );                               // orient the device

			quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation

		}

	}();

	this.connect = function() {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = true;

	};

	this.disconnect = function() {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	this.addDelta=function(firstScope,secondScope)
	{
		deltaAlpha+=(secondScope.deviceOrientation.alpha-firstScope.deviceOrientation.alpha);
		deltaBeta+=(secondScope.deviceOrientation.Beta-firstScope.deviceOrientation.Beta);
		deltaGamma+=(secondScope.deviceOrientation.Gamma-firstScope.deviceOrientation.Gamma);
		deltaScreenOrientation+=(secondScope.screenOrientation-firstScope.screenOrientation);
	}

	this.update = function () {

		if ( scope.enabled === false ) return;

		var alpha  = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha) : 0; // Z
		var beta   = scope.deviceOrientation.beta  ? THREE.Math.degToRad( scope.deviceOrientation.beta ) : 0; // X'
		var gamma  = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma) : 0; // Y''
		var orient = scope.screenOrientation? THREE.Math.degToRad( scope.screenOrientation) : 0; // O

		setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

	};

	this.currentupdate = function (currentScope) {
		var alpha  = currentScope.deviceOrientation.alpha-deltaAlpha ? THREE.Math.degToRad( currentScope.deviceOrientation.alpha-deltaAlpha) : 0; // Z
		var beta   = currentScope.deviceOrientation.beta-deltaBeta  ? THREE.Math.degToRad( currentScope.deviceOrientation.beta-deltaBeta ) : 0; // X'
		var gamma  = currentScope.deviceOrientation.gamma-deltaGamma ? THREE.Math.degToRad( currentScope.deviceOrientation.gamma-deltaGamma) : 0; // Y''
		var orient = currentScope.screenOrientation-deltaScreenOrientation? THREE.Math.degToRad( currentScope.screenOrientation-deltaScreenOrientation) : 0; // O

		setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.connect();

};
