
const FaceTracking = require('FaceTracking');
const Scene = require('Scene');
const CameraInfo = require('CameraInfo');
const Patches = require('Patches');
const R = require('Reactive');
const D = require('Diagnostics');


// Enable async/await in JS [part 1]
(async function() {

	//const faceIndex = await Patches.outputs.getScalar('faceIndex');

	const [face] = await Promise.all([
		FaceTracking.face(0),
	]);

	const screenWidth = CameraInfo.previewSize.width;
	const screenHeight = CameraInfo.previewSize.height;
	const screenScale = CameraInfo.previewScreenScale;

	const points = {
		noseBridge: pointS(face.nose.bridge),
		noseLeftNostril: pointS(face.nose.leftNostril),
		noseRightNostril: pointS(face.nose.rightNostril),
		noseTip: pointS(face.nose.tip),			
	};
	
	Object.keys(points).forEach((k) => {
	    Patches.inputs.setPoint2D(k, R.div(R.point2d(points[k].x, R.sub(screenHeight, points[k].y)),screenScale))
	    .catch(e => D.log('[EN] You should set '+k+' in From Script. Select the noseToScreen.js file in the assets list, after that go to the right panel and click in + beside the From Script field, select Vector2 type and name it '+k+'\n[BR] Você deve definir um valor '+k+' em From Script. Selecione o arquivo noseToScreen.js na lista de assets, após isto vá no painel a direita e clique em + ao lado do campo From Script, selecione o tipo Vector2 e chame de '+k));
	});

	function pointS(id) {
		return Scene.projectToScreen(face.cameraTransform.applyToPoint(id));
	}

// Enable async/await in JS [part 2]
})();

