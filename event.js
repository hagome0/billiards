var audio1 = new Audio('hit.mp3');
var audio2 = new Audio('hit2.mp3');
var gauge = 0;
var one = 0.1;
var id;
var power = 0;
var tempX;
var tempY;
var TimerID;
var i = 0;
var isfirst = true;
var guide_x;
var guide_y;

function findOffset(obj) {
    var curX = 0;
    var curY = 0;
    if (obj.offsetParent) {
        do {
            curX += obj.offsetLeft;
            curY += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {x: curX, y: curY};
    }
}

function updateCanvas(e) {
    var pos = findOffset(canvas);

    mouseX = e.pageX - pos.x;   // 마우스의 현재 좌표
    mouseY = e.pageY - pos.y;

    nowdegree = 180 * Math.atan2(mouseX - cue.x, mouseY - cue.y) / Math.PI;

    if (cue.mouse && !cue.drag) {
        canvas.style.cursor = cursor_grab;
    } else if (cue.drag) {
        canvas.style.cursor = cursor_drag;
    } else {
        canvas.style.cursor = 'auto';
    }
    if (cue.drag) {
        cue.degree = -(nowdegree - 90);
    }

    draw_cue();
}

function startDrag() {
    if (cue.mouse == true) {
        cue.drag = true;
        distX = mouseX - cue.x;
        distY = mouseY - cue.y;


    }
}

function stopDrag() {
    one = 0.1;
    if (cue.drag == true) {
        cue.drag = false;
    }
}

function frame() {
    one = one + 0.007;
    gauge += one;
    if (gauge >= 100.0) {
        one = -one;
    }

    if (gauge <= 0) {
        one = 0.1;
        one = Math.abs(one);
    }
    elem.style.width = gauge + '%';
    document.getElementById("label").innerHTML = gauge.toFixed(1) + '%';
}

function startGauge() {
    id = setInterval(frame, 10);
    waitkey = false;
}

function stopGauge() {
    clearInterval(id);
    power = gauge;
    gauge = 0;
    elem.style.width = gauge + '%';
    document.getElementById("label").innerHTML = gauge.toFixed(1) + '%';
    hit.disabled = true;
    cue_execute();
    waitkey = true;
}

function cue_motion() {
    i++;
    cue.x = cue.x + i * Math.cos(degreeToRadian * cue.degree);
    cue.y = cue.y + i * Math.sin(degreeToRadian * cue.degree);

    draw_cue();
    if (i >= 100) {
        clearInterval(TimerID);
        cue.x = tempX - 20 * Math.cos(degreeToRadian * cue.degree);
        cue.y = tempY - 20 * Math.sin(degreeToRadian * cue.degree);
        draw_cue();
        audio1.play();
        i = 0;
        // setTimeout(function () {
        cue.visible = false;
        HitBall();
        draw();
        // }, 500);

    }

    cue.x = tempX;
    cue.y = tempY;
}

function cue_execute() {

    tempX = cue.x;
    tempY = cue.y;

    TimerID = setInterval(cue_motion, 10);
}

function draw_guide_1() {
    var gx = balls[nowPlayer].x + 60;
    var gy = balls[nowPlayer].y + 60;

    var degree = cue.degree * degreeToRadian;

    var point_x = gx - 20 * Math.cos(degree);
    var point_y = gy - 20 * Math.sin(degree);

    //case left wall
    var guide_left_x = 60;
    var guide_left_y = gy - Math.tan(degreeToRadian * cue.degree) * (point_x - 60);

    //case right wall
    var guide_right_x = 1140;
    var guide_right_y = gy - Math.tan(degreeToRadian * cue.degree) * (point_x - 1140);

    //case top wall
    var guide_top_x = gx - Math.tan(degreeToRadian * (90 - cue.degree)) * (point_y - 60);
    var guide_top_y = 60;

    //case bottom wall
    var guide_bottom_x = gx - Math.tan(degreeToRadian * (90 - cue.degree)) * (point_y - 610);
    var guide_bottom_y = 610;


    if (isfirst) {
        guide_x = guide_left_x;
        guide_y = guide_left_y;
    }


    //case left to top
    if (guide_y <= 60 && (guide_x > 60 || guide_x <= 1140)) {
        guide_x = guide_top_x; //가변값
        guide_y = guide_top_y; //610
        isfirst = false;
    }

    //case top to right
    if (guide_x >= 1140 && (guide_y > 60 || guide_y <= 610)) {
        guide_x = guide_right_x; // 1140
        guide_y = guide_right_y; // 가변값
    }

    //case right to bottom
    if (guide_y >= 610 && (guide_x >= 60 || guide_x < 1140)) {
        guide_x = guide_bottom_x; //가변값
        guide_y = guide_bottom_y; //610
    }

    //cace bottom to left
    if (guide_x <= 60 && (guide_y >= 60 || guide_y < 610)) {
        guide_x = guide_left_x; //60
        guide_y = guide_left_y; //가변값
        isfirst = false;
    }


    ctx.setLineDash([5, 10]);
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(point_x, point_y);
    ctx.lineTo(guide_x, guide_y);
    ctx.stroke();
    ctx.closePath();
}

function playerChange() {
    p1 = document.getElementById("p1");
    p2 = document.getElementById("p2");
    nowPlayer++;
    nowPlayer = nowPlayer % 2;

    if (nowPlayer == 0) {
        p2.style.color = "lightgrey";
        p1.style.color = "dodgerblue";
    }
    else {
        p2.style.color = "dodgerblue";
        p1.style.color = "lightgrey";
    }
    p1.innerHTML = "Player1 : " + scoreinfo[0];
    p2.innerHTML = "Player2 : " + scoreinfo[1];

    draw();
}

var waitkey = true;
var waite = true;

function keyEvent1(e) {
    player.disabled = true;
    if (waitkey) {
        if (e.keyCode === 38) { //up arrow
            cue.degree--;
        }
        else if (e.keyCode === 40) { //down arrow
            cue.degree++;
        }

        else if (e.keyCode === 37) { //left arrow
            cue.degree -= 3;
        }


        else if (e.keyCode === 39) { //right arrow
            cue.degree += 3;
        }


        else if (e.keyCode === 67) { //c
            if (nowPlayer == 0) {
                p2.style.color = "lightgrey";
                p1.style.color = "dodgerblue";
            }
            else {
                p2.style.color = "dodgerblue";
                p1.style.color = "lightgrey";
            }
            p1.innerHTML = "Player1 : " + scoreinfo[0];
            p2.innerHTML = "Player2 : " + scoreinfo[1];
            playerChange();
        }

        else if (e.keyCode === 32 && waite) { //w
            startGauge();
            waite = false;
        }
        draw();
    }
}

function keyEvent2(e) {
    if (e.keyCode === 32 && waite) { //w
        stopGauge();
        waite = false;
        waitkey = true;
    }
}

function getscore() {
    var text;
    var turnover = false;
    if (!balls[nowPlayer].loss) //적구를 맞지 않았을때
    {
        if (balls[nowPlayer].red1 && balls[nowPlayer].red2) {
            scoreinfo[nowPlayer]++; //득점
            text = "Nice Shoot!";
        }

        else if (balls[nowPlayer].red1 || balls[nowPlayer].red2) {
            //무실점 무득점
            text = "Let's do better!";
            turnover = true;
        }

        else {
            text = "Oh My God !!"; //실점
            if (scoreinfo[nowPlayer] > 0)
                scoreinfo[nowPlayer]--;
            turnover = true;
        }
    }
    else {
        text = "Oh My God !!"; //실점
        if (scoreinfo[nowPlayer] > 0)
            scoreinfo[nowPlayer]--;
        turnover = true;
    }   //오류나는 이유 나우공이 바뀌기전에 공이 맞은정보가 초기화 되야함
    //또한 메시지도 즉시 출력됨

    balls[nowPlayer].red1 = false;  //공이 맞은 정보 초기화
    balls[nowPlayer].red2 = false;
    balls[nowPlayer].loss = false;

    if (turnover) {
        nowPlayer = ++nowPlayer % 2;// 차례변경
        cue.x = balls[nowPlayer].x + 60;
        cue.y = balls[nowPlayer].y + 60;
    }
    p1 = document.getElementById("p1");
    p2 = document.getElementById("p2");

    if (nowPlayer == 0) {
        p2.style.color = "lightgrey";
        p1.style.color = "dodgerblue";
    }
    else {
        p2.style.color = "dodgerblue";
        p1.style.color = "lightgrey";
    }
    p1.innerHTML = "Player1 : " + scoreinfo[0];
    p2.innerHTML = "Player2 : " + scoreinfo[1];


    ctx.clearRect(0, 0, w, h);
    table.draw();

    setTimeout(function () {
        ctx.font = 'italic 100px calibri';
        ctx.fillText(text, 250, 250);
    }, 500)


}

function help_alert() {
    swal(

        "How to Play",
        "Mouse Control\n"+
        "1. You can adjust the angle by dragging and dropping the cue\n" +
        "2. You can adjust the force by pressing the mouse on the hit button\n\n" +

        "Key Control\n"+
        "1. Left or Right arrow (←, →) : Detailed angle adjustment\n" +
        "2. Up or Down arrow (↑, ↓) : Large angle adjustment\n" +
        "3. Space Bar : same as pressing the hit button\n" +
        "4. Key-C : Player Change",

        "info"
    );
}