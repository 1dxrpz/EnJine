
function LoadContent(e) {
	if (e != undefined) {
		for (const [key, value] of Object.entries(e)) {
			var img = new Image();
			img.src = value;
			e[key] = img;
		}
		//GameState.ContentLoaded = true;
		Content = e;
	}
}