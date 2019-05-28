(function () {
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)',
            tabIndex: '-1'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 350,
            borderRadius: 50,
            background: '#C6A62F',
            zIndex: 2
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 0,
            top: 250
        },
        stick2: {
            left: 888,
            top: 250
        },
        score: {
            width: 50,
            height: 50,
            position: 'absolute',
            fontSize: '50px',
            textAlign: 'center',
            lineHeight: '50px',
            zIndex: 1
        },
        score1: {
            left: '22%'
        },
        score2: {
            left: '72%'
        },
        ballCount: {
            left: 850,
            top: 550,
            width: 50,
            height: 50,
            position: 'absolute',
            fontSize: '50px',
            textAlign: 'center',
        }
    };

    var CONSTS = {
        gameSpeed: 40,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0,
        ballCount: 8
    };

    function start() {
        draw();
        document.getElementById('pong-game').focus();
        setEvents();
        roll();
        loop();
    }

    function draw() {
        $('<div/>', { id: 'pong-game' }).css(CSS.arena).appendTo('body');
        $('<div/>', { id: 'pong-line' }).css(CSS.line).appendTo('#pong-game');
        $('<div/>', { id: 'pong-ball' }).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', { id: 'stick-1' }).css($.extend(CSS.stick1, CSS.stick))
            .appendTo('#pong-game');
        $('<div/>', { id: 'stick-2' }).css($.extend(CSS.stick2, CSS.stick))
            .appendTo('#pong-game');
        $('<div/>', { id: 'score-1' }).css($.extend(CSS.score, CSS.score1))
            .appendTo('#pong-game');
        $('<div/>', { id: 'score-2' }).css($.extend(CSS.score, CSS.score2))
            .appendTo('#pong-game');
        $('<div/>', { id: 'ballCount' }).css(CSS.ballCount)
            .appendTo('#pong-game');

        if (localStorage.length >1) {
            getScoreData();
            setScoreData();
        }

    }

    function setEvents() {
        $(document).on('keydown', function (e) {
            switch (e.keyCode) {
                //Stick1 
                case 87: CONSTS.stick1Speed = -10; break;
                case 83: CONSTS.stick1Speed = 10; break;
                //Stick2 
                case 38: CONSTS.stick2Speed = -10; break;
                case 40: CONSTS.stick2Speed = 10; break;
            }

        });

        $(document).on('keyup', function (e) {
            switch (e.keyCode) {
                //Stick1 
                case 87: CONSTS.stick1Speed = 0; break;
                case 83: CONSTS.stick1Speed = 0; break;
                //Stick2 
                case 38: CONSTS.stick2Speed = 0; break;
                case 40: CONSTS.stick2Speed = 0; break;
                //Pause:
                case 80:
                    saveScoreData();
                    clearInterval(window.pongLoop)
                    break;
                case 32:

                    break;

            }
        });
    }

    function loop() {
        window.pongLoop = setInterval(function () {

            CSS.stick1.top += CONSTS.stick1Speed;
            CSS.stick1.top = stickControl(CSS.stick1.top)
            $('#stick-1').css('top', CSS.stick1.top);

            CSS.stick2.top += CONSTS.stick2Speed;
            CSS.stick2.top = stickControl(CSS.stick2.top)
            $('#stick-2').css('top', CSS.stick2.top)



            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed


            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
            }

            $('#pong-ball').css({ top: CSS.ball.top, left: CSS.ball.left });

            if (CSS.ball.left <= CSS.stick.width) {
                if (CSS.ball.top + CSS.ball.width >= CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height) {
                    (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1)
                }
                else {
                    roll()
                    CONSTS.score1++
                    CONSTS.ballCount--;
                    CSS.stick1.top = CSS.stick2.top = 250
                }
            }


            if (CSS.ball.left + CSS.ball.width >= CSS.stick2.left) {
                if (CSS.ball.top + CSS.ball.width >= CSS.stick2.top && CSS.ball.top <= CSS.stick2.top + CSS.stick.height) {
                    CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1
                } else {
                    roll()
                    CONSTS.score2++
                    CONSTS.ballCount--;
                    CSS.stick1.top = CSS.stick2.top = 250
                }
            }
            setScoreData();


            // if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width) {
            //     roll();
            // }

            if ((CONSTS.score1 == 5 || CONSTS.score2 == 5)) {
                clearInterval(window.pongLoop)
                localStorage.clear();
                console.log("Oyun bitti.")
                playNewGame();
            }
            else if (CONSTS.ballCount == 0) {
                console.log("Top bitti")
                localStorage.clear();
                clearInterval(window.pongLoop)
                playNewGame();
            }
        }, CONSTS.gameSpeed);
    }

    function roll() {
      
        CSS.ball.top = 250;
        CSS.ball.left = 447;

        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
    }

    function stickControl(top) {
        if (top < 0)
            top = 0;
        else if (top >= CSS.arena.height - CSS.stick.height)
            top = CSS.arena.height - CSS.stick.height
        return top;
    }

    function saveScoreData() {
        if (CONSTS.score1 < 5 && CONSTS.score2 < 5 && CONSTS.ballCount != 0){
            localStorage.setItem('user1Score', CONSTS.score1);
            localStorage.setItem('user2Score', CONSTS.score2);
            localStorage.setItem('ballCount', CONSTS.ballCount);
        }

    }

    function getScoreData() {
        CONSTS.score1 = localStorage.getItem('user1Score');
        CONSTS.score2 = localStorage.getItem('user2Score');
        CONSTS.ballCount = localStorage.getItem('ballCount')
    }

    function setScoreData() {
        $('#score-1').html(CONSTS.score1);
        $('#score-2').html(CONSTS.score2);
        $('#ballCount').html(CONSTS.ballCount);
    }

    function playNewGame(){
        if(window.confirm("tekrar oynamak ister misin.")){
            CONSTS.score1 = 0;
            CONSTS.score2 = 0;
            CONSTS.ballCount = 8;
            
            roll();
            loop();
        }
    }

    window.window.onbeforeunload = function () {
        saveScoreData();
    }
    start();
})();