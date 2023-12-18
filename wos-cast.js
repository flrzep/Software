


(function() {

    
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    var angle = 0;

    let castSrc = [
        "antonia.png",
        "lynn.png",
        "anna.png",
        "christoph.png",
        "dennis.png",
        "jill.png",
        "talisa.png"
    ];

    let cast = [
        new Image(200,200),
        new Image(200,200),
        new Image(200,200),
        new Image(200,200),
        new Image(200,200),
        new Image(200,200),
        new Image(200,200)
    ];


    cast.forEach(function(c, idx) {
        c.src = "Crew/" + castSrc[idx];
    })


    // colors
    let digitColor = "white",
        windowColor = "rgba(0,255,0,1)";

    let bgColors = ["black", "white", "black",  "white"],
        rimColors = ["white", "black", "white",  "black"],
        textColors = ["white",  "black", "white", "black"];

    var intervalID;

    class Board {
        constructor(windowWidth, windowHeight) {
            this.cpx = windowWidth / 2,
            this.cpy = windowHeight * 0.5,
            this.width = windowWidth * 0.5,
            this.height = windowHeight * 0.8,
            this.bgWidth = windowWidth / 4,
            this.bgHeight = windowHeight * 0.5,
            this.gap = (windowWidth - 2 * this.bgWidth) / 10;
        };
        update(windowWidth, windowHeight) {
            this.cpx = windowWidth / 2,
            this.cpy = windowHeight * 0.5,
            this.width = windowWidth * 0.5,
            this.height = windowHeight * 0.8,
            this.bgWidth = windowWidth / 4,
            this.bgHeight = windowHeight * 0.5,
            this.gap = (windowWidth - 2 * this.bgWidth) / 10;
        }
    };

    let board = new Board(window.innerWidth, window.innerHeight);

    const image = new Image(140,140); // Using optional size for image
    //image.onload = drawCtrImage; // Draw when image has loaded
    image.src="swb-logo.svg";

    var canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop,
        score1 = 0,
        score2 = 0;


    // Add event listener for `click` events.
    canvas.addEventListener('click', function(event) {
        var x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop;

        // Collision detection between clicked offset and element.
        console.log("Click");

        let w0 = Math.random() * Math.PI/2 + Math.PI/2;  //rad/s
        w = w0;   
        theta = 0;
        intervalID = setInterval(runAnimation, 100, w0);

    }, false);


    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
            

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;      
        
        board.update(window.innerWidth, window.innerHeight);

    }
    
    resizeCanvas();
            
    var w,
        theta;
    
    function runAnimation() {

        let dt = 1;
     
        //angle += w;
        drawWheel(theta);

        const T = 1; //Nm
        const c = 0.05
        const alpha = - c * w; // angular acceleration in rad/s

        let dw = alpha * dt;
        
        w = w + dw;

        theta = theta + w * dt;

        //var delta = Date.now() - start;
        
        //console.log(w,theta);
        

        if (w<0.005) {
            clearInterval(intervalID);
            getResult(theta);
            theta = 0;
            w = 0;
            
        }
        
    };


    function getResult(theta) {

        let arcSecs = (Math.PI*2)/cast.length,
            angle = theta + Math.PI/2 - arcSecs/2,
            arc = angle%(Math.PI*2),
            idx = Math.ceil(arc/arcSecs);

        console.log(arc, arcSecs, arc/arcSecs);
        console.log(cast[cast.length-idx]);
        cast.splice(cast.length-idx, 1);
        
    };


    
    function drawWheel(rotation) {

        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        ctx.save();

        ctx.fillStyle = windowColor;
        ctx.fillRect(0,0, window.innerWidth, window.innerHeight);

        var td = 140,
            od = 350,
            id = 20;

        ctx.save();

        // Wheel ------------------------------------------

        ctx.lineWidth = 15;
        let fontHeight = 30;
        ctx.font = String(fontHeight) + "px Arial";

        // Text
        ctx.translate(board.cpx, board.cpy);
        ctx.rotate(rotation);
        
        cast.forEach(function(c,i){
            
            let arcSec = 2*(Math.PI)/cast.length

            // Arcs
            ctx.beginPath();
            ctx.arc(0,0, od+20, -arcSec/2, arcSec/2);
            ctx.lineTo(0,0);
            ctx.fillStyle = rimColors[i%4];
            ctx.fill();

            let angleRim = Math.PI/100;
            ctx.beginPath();
            //ctx.moveTo(0,0);
            ctx.arc(0,0, od, -arcSec/2 + angleRim, arcSec/2  - angleRim);
            ctx.lineTo(0,0);
            ctx.fillStyle = bgColors[i%4];
            ctx.fill();

            ctx.rotate(Math.PI/2);
            // Text
            ctx.fillStyle = textColors[i%4];
            //ctx.fillText(strafe, td,0);
            ctx.drawImage(c,  -c.height/2, -(td+ c.height), c.width, c.height);
            ctx.rotate(-Math.PI/2);
            //printAtWordWrap(ctx, strafe, td ,0 , fontHeight, od-td)
            ctx.rotate(arcSec);
        })
        
        //console.log(angle);

        ctx.restore();


        //Inner thing
        ctx.beginPath();
        ctx.arc(board.cpx, board.cpy, 70, 0, Math.PI*2);
        
        //ctx.arc(0,0, id, 0, 0);
        ctx.fillStyle = "white";
        ctx.fill();

        ctx.drawImage(image, board.cpx - image.width/2, board.cpy-image.height/2, image.width, image.height);

        let ht = 80,
            wt = 80;

        const lingrad1 = ctx.createLinearGradient(0, 0,0,ht);
        lingrad1.addColorStop(0.5, "#A00");
        lingrad1.addColorStop(1, "#F00");

        const lingrad2 = ctx.createLinearGradient(0, 0,0,ht);
        lingrad2.addColorStop(0.5, "#F00");
        lingrad2.addColorStop(1, "#A00");


        ctx.lineWidth = 8;
        
        ctx.beginPath();
        ctx.moveTo(board.cpx, board.cpy - od + ht*0.75);
        ctx.lineTo(board.cpx - wt/2, board.cpy - od - ht*0.25);
        ctx.lineTo(board.cpx + wt/2, board.cpy - od - ht*0.25);
        ctx.lineTo(board.cpx, board.cpy - od + ht*0.75);
        ctx.lineTo(board.cpx - wt/2, board.cpy - od - ht*0.25);
        //ctx.lineTo(board.cpx, board.cpy - od - ht*0.25);
        ctx.strokeStyle = lingrad2;
        ctx.stroke();
        ctx.fillStyle = lingrad1;
        ctx.fill();
    }


    function printAtWordWrap( context , text, x, y, lineHeight, fitWidth)
    {
        fitWidth = fitWidth || 0;
        
        if (fitWidth <= 0)
        {
            context.fillText( text, x, y );
            return;
        }
        var words = text.split(' ');
        var currentLine = 0;
        var idx = 1;
        while (words.length > 0 && idx <= words.length)
        {
            var str = words.slice(0,idx).join(' ');
            var w = context.measureText(str).width;
            if ( w > fitWidth )
            {
                if (idx==1)
                {
                    idx=2;
                }
                context.fillText( words.slice(0,idx-1).join(' '), x, y + (lineHeight*currentLine) );
                currentLine++;
                words = words.splice(idx-1);
                idx = 1;
            }
            else
            {idx++;}
        }
        if  (idx > 0)
            context.fillText( words.join(' '), x, y + (lineHeight*currentLine) );
    }

    window.onload = function() {      
        drawWheel(0);
    };
    
})();