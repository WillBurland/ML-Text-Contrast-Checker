let modelBW;
let state = "collection";
let r, g, b, guessResults;

function setup()
{
	createCanvas(100, 200);
	background(127);
	noStroke();

	let options = 
	{
		inputs: ["r", "g", "b"],
		outputs: ["label"],
		task: "classification",
		debug: true
	};

	modelBW = ml5.neuralNetwork(options);

	//TRAINING NEW MODEL

	// for (let i = 0; i < trainingData.length; i++)
	// {
	// 	let inputs = 
	// 	{
	// 		r: trainingData[i].r,
	// 		g: trainingData[i].g,
	// 		b: trainingData[i].b
	// 	};
	
	// 	let target = 
	// 	{
	// 		label: trainingData[i].l
	// 	};
		
	// 	model.addData(inputs, target);
	// }


	//LOAD EXISTING MODEL
	const modelInfo =
	{
		model: 'model/modelBW.json',
		metadata: 'model/model_metaBW.json',
		weights: 'model/model.weightsBW.bin'
	};
	
	modelBW.load(modelInfo, modelLoaded);
}

function modelLoaded()
{
	console.log('model loaded');
	state = 'prediction';
}

function keyPressed()
{
	if (key == "t")
	{
		state = "training";
		modelBW.normalizeData();

		let options = 
		{
			epochs: 500,
			learningRate: 0.25
		};

		modelBW.train(options, whileTraining, finishedTraining);
	}
}

function whileTraining(epoch, loss)
{
	console.log(epoch, floor(loss.val_acc * 1e9)/1e7);
}

function finishedTraining()
{
	console.log("Finished training");
	state = "prediction";
}

function guess(red, green, blue)
{
	modelBW.classify({r: red, g: green, b: blue}, gotResults);
}

function gotResults(error, results)
{
	if (error)
	{
		console.error(error);
		return;
	}

	guessResults = results;
	drawBars();
}

function updateColour()
{
	r = parseInt(document.getElementById("sliderR").value);
	g = parseInt(document.getElementById("sliderG").value);
	b = parseInt(document.getElementById("sliderB").value);

	document.getElementsByClassName("sliderText")[0].innerText = r;
	document.getElementsByClassName("sliderText")[1].innerText = g;
	document.getElementsByClassName("sliderText")[2].innerText = b;
	
	document.body.style.background = "rgb(" + r + "," + g + "," + b + ")";

	guess(r, g, b);
}

function drawBars()
{
	background(127);
	//background(r,g,b);

	let barWidth = 40;
	let barSpacing = 10;

	if (guessResults[0].label == "b")
	{
		fill(0,0,0);
		rect(10, height, barWidth, -height * guessResults[0].confidence);
		fill(255,255,255);
		rect(50, height, barWidth, -height * guessResults[1].confidence);
		document.getElementById("guess").style.color = "#000000";
	}
	else
	{
		fill(0,0,0);
		rect(10, height, barWidth, -height * guessResults[1].confidence);
		fill(255,255,255);
		rect(50, height, barWidth, -height * guessResults[0].confidence);
		document.getElementById("guess").style.color = "#ffffff";
	}
}