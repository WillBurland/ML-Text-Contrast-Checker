let trainingData = [];

function luminance(r, g, b)
{
	let a = [r, g, b].map(function (v)
	{
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055) / 1.055, 2.4 );
	});
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2)
{
	let lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
	let lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);

	let brightest = Math.max(lum1, lum2);
	let darkest = Math.min(lum1, lum2);

	return (brightest + 0.05) / (darkest + 0.05);
}

function randomRGB()
{
	return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
}

function download(strData, strFileName, strMimeType)
{
	let D = document,
		A = arguments,
		a = D.createElement("a"),
		d = A[0],
		n = A[1],
		t = A[2] || "text/plain";

	a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);

	if (window.MSBlobBuilder)
	{
		var bb = new MSBlobBuilder();
		bb.append(strData);
		return navigator.msSaveBlob(bb, strFileName);
	}

	if ('download' in a)
	{
		a.setAttribute("download", n);
		a.innerHTML = "downloading...";
		D.body.appendChild(a);

		setTimeout(function()
		{
			var e = D.createEvent("MouseEvents");
			e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);
			D.body.removeChild(a);
		}, 66);
		return true;
	};
}

function generateTrainingData(count)
{
	for (let i = 0; i < count; i++)
	{
		let dataPoint = {};
		let bg = randomRGB();

		let whiteContrast = contrast(bg, [255, 255, 255]);
		let blackContrast = contrast(bg, [0, 0, 0]);
		
		dataPoint.r = bg[0];
		dataPoint.g = bg[1];
		dataPoint.b = bg[2];

		if (whiteContrast > blackContrast)
		{
			dataPoint.l = "w";
		}
		else
		{
			dataPoint.l = "b";
		}

		trainingData.push(dataPoint);
	}

	download(JSON.stringify(trainingData), "data.txt", "text/plain");
}