


(function() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    const image = document.getElementById("swb");

    let teamA = "Team A",
        teamB = "Team B";

    // colors
    let textColor = "black",
        bgColor = "black",
        digitColor = "white",
        windowColor = "rgba(0,255,0,1)";

    class Board {
        constructor(windowWidth, windowHeight) {
            this.cpx = windowWidth / 2,
            this.cpy = windowHeight * 0.6,
            this.width = windowWidth * 0.5,
            this.height = windowHeight * 0.8,
            this.bgWidth = windowWidth / 4,
            this.bgHeight = windowHeight * 0.5,
            this.gap = (windowWidth - 2 * this.bgWidth) / 10;
        };
        update(windowWidth, windowHeight) {
            this.cpx = windowWidth / 2,
            this.cpy = windowHeight * 0.6,
            this.width = windowWidth * 0.5,
            this.height = windowHeight * 0.8,
            this.bgWidth = windowWidth / 4,
            this.bgHeight = windowHeight * 0.5,
            this.gap = (windowWidth - 2 * this.bgWidth) / 10;
        }
    };

    let board = new Board(window.innerWidth, window.innerHeight);

    /*var cpx = window.innerWidth/2,
        cpy = window.innerHeight*0.6,
        bgWidth = window.innerWidth/4,
        gap = (window.innerWidth - 2*bgWidth)/10,
        bgHeight = window.innerHeight*0.5;*/

    var canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop,
        scores = [],
        score1 = 0,
        score2 = 0;

    // Add event listener for `click` events.
    canvas.addEventListener('click', function(event) {
        var x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop;

        // Collision detection between clicked offset and element.
        scores.forEach(function(score) {
            if (y > score.top && y < score.top + score.height 
                && x > score.left && x < score.left + score.width) {

                score.value++;
                drawStuff();
            
            }
        });

    }, false);

    // Add element.
    scores.push({
        value: 0,
        colour: '#05EFFF',
        width: board.bgWidth,
        height: board.bgHeight,
        top: board.cpy - board.bgHeight/2,
        left: board.cpx - board.bgWidth - board.gap 
    });

    scores.push({
        value: 0,
        colour: '#05EFFF',
        width: board.bgWidth,
        height: board.bgHeight,
        top: board.cpy - board.bgHeight/2,
        left: board.cpx + board.gap 
    });

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
            
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;      
        
        board.update(window.innerWidth, window.innerHeight);

        scores.forEach(function(score) {
            score.width = board.bgWidth;
            score.height = board.bgHeight;
            score.top = board.cpy - board.bgHeight/2;
        })

        scores[0].left = board.cpx - board.bgWidth - board.gap;
        scores[1].left = board.cpx + board.gap;

        drawStuff(); 
    }
    
    resizeCanvas();
            
    function drawStuff() {
      
        var cornerRadius = 40;

        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");

        
        
        const image = new Image(board.bgHeight*0.18,board.bgHeight*0.18); // Using optional size for image
        //image.onload = drawCtrImage; // Draw when image has loaded

        // Load an image of intrinsic size 300x227 in CSS pixels
        image.src = "swb-logo.svg";
        image.onload = function() {

            var font = Math.round(board.bgHeight * 1);
            ctx.font = String(font) + "px Arial";

            let score1Metrics = ctx.measureText(String(scores[0].value))
            let score2Metrics = ctx.measureText(String(scores[1].value))

            if (score1Metrics.width > score2Metrics.width) {
                board.bgWidth = score1Metrics.width * 1.2;
                
            } else {
                board.bgWidth = score2Metrics.width * 1.2;
            };
            board.width = board.bgWidth * 3;
            board.gap = board.width * 0.05;

            
            ctx.fillStyle = windowColor;
            ctx.fillRect(0,0,window.innerWidth, window.innerHeight);
            
            //image ring part
            let minx = board.cpx - board.width/2-image.width/2,
                maxx = board.cpx + board.width/2 - image.width/2,
                miny = board.cpy - board.height*0.65,
                maxy = board.cpy + board.height*0.35 ;

            let u = (maxx-minx + maxy-miny) *2,
                s = image.width,
                n = u/s;

            let x,y;

            let c1 = maxx-minx,
                c2 = maxx-minx + maxy-miny,
                c3 = 2*(maxx-minx) + maxy-miny;

            ctx.fillStyle = "gold";
            ctx.fillRect(minx+image.width/2, miny+ image.height/2, maxx-minx, maxy-miny); 
        
            
            //Left Score
            ctx.fillStyle = bgColor;
            ctx.beginPath();
            ctx.roundRect(board.cpx - board.gap - board.bgWidth, board.cpy - board.bgHeight/2, board.bgWidth, board.bgHeight, cornerRadius); //x start, y start, width, height
            ctx.fill();

            ctx.fillStyle = digitColor;
            ctx.fillText(String(scores[0].value), board.cpx - board.gap - board.bgWidth/2 - score1Metrics.width/2, board.cpy + font * 0.4);


            //Right Score
            ctx.fillStyle = bgColor;
            ctx.beginPath();
            ctx.roundRect(board.cpx + board.gap , board.cpy - board.bgHeight/2, board.bgWidth, board.bgHeight, cornerRadius); //x start, y start, x end, y end
            ctx.fill();

            ctx.fillStyle = digitColor;
            ctx.fillText(String(scores[1].value), board.cpx + board.gap + board.bgWidth/2 - score2Metrics.width/2, board.cpy + font*0.4);

            console.log(scores[0].value);
            console.log(scores[1].value);

            for (let i = 0; i<n; i++) {
                let d = s*i;
                if (d < c1) {
                    y = miny;
                    x = minx + d;
                } else if (d < c2) {
                    x = maxx;
                    y = miny + d - c1;
                } else if (d < c3) {
                    y = maxy;
                    x = maxx - d + c2;
                } else {
                    x = minx;
                    y = maxy - d + c3;
                }
                ctx.drawImage(this, x, y, this.width, this.height)};
        

            //TEams
            ctx.fillStyle = textColor;
            ctx.font = String(font*0.2) + "px Arial";
            ctx.fillText(teamA, board.cpx - board.gap - (ctx.measureText(teamA)).width/2 - board.bgWidth/2, board.cpy + font*0.4 - board.bgHeight);
            ctx.fillText(teamB, board.cpx + board.gap - (ctx.measureText(teamB)).width/2 + board.bgWidth/2, board.cpy + font*0.4 - board.bgHeight);

            };

            
    }
})();