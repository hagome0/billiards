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

    nowdegree = 180 * Math.atan2(mouseX - que.x, mouseY - que.y) / Math.PI;

    if (que.mouse && !que.drag) {
        canvas.style.cursor = cursor_grab;
    } else if (que.drag) {
        canvas.style.cursor = cursor_drag;
    } else {
        canvas.style.cursor = 'auto';
    }
    if (que.drag) {
        que.degree = -(nowdegree - 90);
    }

    draw_que();
}

function startDrag() {
    if (que.mouse == true) {
        que.drag = true;
        distX = mouseX - que.x;
        distY = mouseY - que.y;


    }
}

function stopDrag() {
    one = 0.1;
    if (que.drag == true) {
        que.drag = false;
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
    que_execute();
    waitkey = true;
}

function que_motion() {
    i++;
    que.x = que.x + i * Math.cos(degreeToRadian * que.degree);
    que.y = que.y + i * Math.sin(degreeToRadian * que.degree);

    draw_que();
    if (i >= 100) {
        clearInterval(TimerID);
        que.x = tempX - 20 * Math.cos(degreeToRadian * que.degree);
        que.y = tempY - 20 * Math.sin(degreeToRadian * que.degree);
        draw_que();
        audio1.play();
        i = 0;
        // setTimeout(function () {
        que.visible = false;
        HitBall();
        draw();
        // }, 500);

    }

    que.x = tempX;
    que.y = tempY;
}

function que_execute() {

    tempX = que.x;
    tempY = que.y;

    TimerID = setInterval(que_motion, 10);
}

function draw_guide_1() {
    var gx = balls[nowPlayer].x + 60;
    var gy = balls[nowPlayer].y + 60;

    var degree = que.degree * degreeToRadian;

    var point_x = gx - 20 * Math.cos(degree);
    var point_y = gy - 20 * Math.sin(degree);

    //case left wall
    var guide_left_x = 60;
    var guide_left_y = gy - Math.tan(degreeToRadian * que.degree) * (point_x - 60);

    //case right wall
    var guide_right_x = 1140;
    var guide_right_y = gy - Math.tan(degreeToRadian * que.degree) * (point_x - 1140);

    //case top wall
    var guide_top_x = gx - Math.tan(degreeToRadian * (90 - que.degree)) * (point_y - 60);
    var guide_top_y = 60;

    //case bottom wall
    var guide_bottom_x = gx - Math.tan(degreeToRadian * (90 - que.degree)) * (point_y - 610);
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
        nowPlayer++;
        nowPlayer = nowPlayer % 2;

        draw();
}

var waitkey = true;
var waite = true;

function keyEvent1(e) {
    player.disabled = true;
    if (waitkey) {
        if (e.keyCode === 65) { //a
            que.degree--;
        }
        else if (e.keyCode === 68) { //d
            que.degree++;
        }

        else if (e.keyCode === 87) { //w
            que.degree -= 3;
        }


        else if (e.keyCode === 83) { //s
            que.degree += 3;
        }


        else if (e.keyCode === 81) { //d
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

        else if (e.keyCode === 69 && waite) { //w
            startGauge();
            waite = false;
        }
        draw();
    }
}

function keyEvent2(e) {
    if (e.keyCode === 69 && waite) { //w
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

    if(turnover){
        nowPlayer = ++nowPlayer % 2;// 차례변경
        que.x = balls[nowPlayer].x + 60;
        que.y = balls[nowPlayer].y + 60;
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