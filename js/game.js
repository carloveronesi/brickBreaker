/*
		Impostazioni
*/

	//Canvas
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	//Setting Palla
	var ballRadius = 10;
	var ballColor = "#0095DD"
	//Setting velocità
	var speed = 10;
	//Setto la posizione al centro del canvas
	var x = canvas.width/2;
	var y = canvas.height-30;

	//Setto la velocità palla
	var dx = 2;																				//Spostamento x
	var dy = -2;																			//Spostamento y
	//Setto la velocità Paddle
	var ps_x = 7;																			//Spostamento x

	//Setto paddle
	var paddleHeight = 10;																	//Altezza Paddle
	var paddleWidth = 75;																	//Larghezza Paddle
	var paddleX = (canvas.width-paddleWidth)/2;												//Posizione Paddle

	//Pressione tasti
	var rightPressed = false;																//Pressione tasto DX
	var leftPressed = false;																//Pressione tasto SX

	//Mattoni
	var brickRowCount = 3;																	//Numero Righe
	var brickColumnCount = 5;																//Numero Colonne
	var brickWidth = 75;																	//Larghezza mattone
	var brickHeight = 20;																	//Altezza mattone
	var brickPadding = 10;																	//Padding mattoni
	var brickOffsetTop = 30;																//Margine Top
	var brickOffsetLeft = 30;																//Margine Left
	var brickColor = "#0095DD";																//Colore 

	//Array Mattoni
	var bricks = [];										
	for(c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for(r=0; r<brickRowCount; r++) {													//Inizializzo ogni mattone con x = 0, y = 0, status= 1
			bricks[c][r] = { x: 0, y: 0, status: 1 };
		}
	}

	//Listener tasti
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

/*
		Funzioni
*/

	//Funzione che genera casualmente un colore in HEX
	function getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	//Disegno la Palla
	function drawBall() {
		ctx.beginPath();																	//Creo forma
		ctx.arc(x, y, ballRadius, 0, Math.PI*2);											//Cerchio di raggio 10, altri dati
		ctx.fillStyle = ballColor;															//Setto colore
		ctx.fill();																			//Coloro
		ctx.closePath();																	//Chiudo forma
	}

	//Disegno il Paddle
	function drawPaddle() {
		ctx.beginPath();
		ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}

	//Disegno i Mattoni
	function drawBricks() {
		for(c = 0; c < brickColumnCount; c++) {
			for(r = 0; r < brickRowCount; r++) {
				if(bricks[c][r].status == 1) {												//Calcolo posizione in base alle dimensioni
					var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
					var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
					bricks[c][r].x = brickX;												//Assegno la posizione
					bricks[c][r].y = brickY;

					//Disegno
					ctx.beginPath();
					ctx.rect(brickX, brickY, brickWidth, brickHeight);
					ctx.fillStyle = brickColor;
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}

	//Ascolto Tasti
	function keyDownHandler(e) {
		if(e.keyCode == 39) {
			rightPressed = true;
		}
		else if(e.keyCode == 37) {
			leftPressed = true;
		}
	}

	function keyUpHandler(e) {
		if(e.keyCode == 39) {
			rightPressed = false;
		}
		else if(e.keyCode == 37) {
			leftPressed = false;
		}
	}

	//Individuazione collisioni
	function collisionDetection() {
		for(c=0; c<brickColumnCount; c++) {
			for(r=0; r<brickRowCount; r++) {
				var b = bricks[c][r];
				if(b.status == 1) {																	//Controllo che il mattone esista
					if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {			//Controllo se la palla è "entrata" nell'area del mattone
						dy = -dy;																	//Rimbalzo
						b.status = 0;																//Cancello il mattone
					}
				}
			}
		}
	}

	//Disegno l'intera pagina
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);						//Pulisce dai rettangoli
		
		//Disegno le forme
		drawBricks();
		drawBall();	
		drawPaddle();	
		//Attivo individuazione collisioni
		collisionDetection();
		
		//Modifico variabili globali posizione
		x += dx;	
		y += dy;

		//Rimbalzo
		if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {			//Rim
			dx = -dx;
			ballColor = getRandomColor();
		}
		if(y + dy < ballRadius) {
			dy = -dy;
		} else if(y + dy > canvas.height-ballRadius) {
			if(x > paddleX && x < paddleX + paddleWidth) {			//Rimbalzo sul muro superiore o il Paddle
				dy = -dy;
			}
			else {													//Game Over
				alert("GAME OVER");
				document.location.reload();
			}
		}

		//Rimbalzo Paddle
		if(rightPressed && paddleX < canvas.width-paddleWidth) {
			paddleX += ps_x;
		}
		else if(leftPressed && paddleX > 0) {
			paddleX -= ps_x;
		}

		//Game Over
		if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
			dx = -dx;
		}

		if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
			dy = -dy;
		}
	}	
	
	//Loop di draw() 
	setInterval(draw, speed);