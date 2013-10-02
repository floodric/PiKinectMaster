function InitGame() {
    gRotaGame = new GameState, gBoard.Setup(gRotaGame)
}

function GameBoard() {
    function a(a, b) {
        var c, d, e = $("#pos" + a),
            f = $("#pos" + b);
        c = e.clone().prop("id", "clone"), $("#board").append(c), d = e.html(), e.html(""), toPos = f.position(), c.animate({
            left: toPos.left,
            top: toPos.top
        }, {
            duration: 1500,
            complete: function () {
                f.html(d), c.remove()
            }
        })
    }
    this.computerWins = 0, this.playerWins = 0, this.cMoving = !1, this.gameOver = !0, this.__construct = function () {
        this.whosTurn = "c"
    }, this.Setup = function (a) {
        this.RefreshTotals(), this.gameOver = !1, $("#announce1").html("");
        for (var b = 0; b < 9; ++b) $("#pos" + b).html("");
        this.StartGame(a)
    }, this.StartGame = function (a) {
        this.gameOver = !1;
        var b = Math.random();
        this.whosTurn = b < .5 ? "p" : "c";
        if (this.whosTurn === "c") {
            $("#theCurrent").prop("src", "images/piecec.png"), $("#announce").html("I GO FIRST"), $("#announce1").html("THINKING"), this.cMoving = !0;
            var c = Math.floor(Math.random() * 9),
                d = new Array;
            d[0] = -1, d[1] = c, a.MakeMove(d, "c"), this.DisplayMove(a, d), this.SwitchTurn(a)
        } else $("#theCurrent").prop("src", "images/piecep.png"), $("#announce").html("YOU GO FIRST"), $("#announce1").html("PLEASE CHOOSE"), this.DisplayOptions(a, -1)
    }, this.StartTurn = function (a) {
        if (this.whosTurn === "c") {
            $("#theCurrent").prop("src", "images/piecec.png"), $("#announce").html("MY TURN"), $("#announce1").html("THINKING");
            var b = a.MakeAIMove();
            this.DisplayMove(a, b), this.SwitchTurn(a)
        } else {
            $("#theCurrent").prop("src", "images/piecep.png"), $("#announce").html("YOUR TURN"), $("#announce1").html("PLEASE CHOOSE");
            var c = a.GetPieces("p");
            if (c.length < 3) this.DisplayOptions(a, -1);
            else
                for (var d = c.length - 1; d >= 0; d--) $("#pos" + c[d]).find("img").prop("class", "pPiece")
        }
    }, this.DisplayMove = function (b, c) {
        this.board = b.GetBoard(), this.ClearOptions(), c[0] === -1 ? this.DisplayBoard(this.board) : a(c[0], c[1])
    }, this.SwitchTurn = function (a) {
        this.whosTurn = this.whosTurn == "c" ? "p" : "c", this.cMoving = !1, this.FinishTurn(a)
    }, this.FinishTurn = function (a) {
        var b = a.GetScore(0);
        b !== 0 ? this.OnGameOver(b) : this.StartTurn(a)
    }, this.OnGameOver = function (a) {
        a > 0 ? ($("#announce").html("I WIN!"), this.computerWins++) : ($("#announce").html("YOU WIN!"), this.playerWins++), this.gameOver = !0, $("#announce1").html("<span class='btn btn-alert' style=cursor:pointer; onclick=InitGame()>PLAY AGAIN</span>"), this.RefreshTotals()
    }, this.RefreshTotals = function () {
        $("#cWins").text(this.computerWins), $("#pWins").text(this.playerWins)
    }, this.ClearOptions = function () {
        for (var a = 0; a < 9; a++) $("#pos" + a).html().indexOf("opacity") != -1 && $("#pos" + a).html("")
    }, this.ClearBoard = function () {
        for (var a = 0; a < 9; a++) $("#pos" + a).html("")
    }, this.IsGameOver = function () {
        return this.gameOver
    }, this.IsComputerMoving = function () {
        return this.cMoving
    }, this.DisplayOptions = function (a, b) {
        var c = "<img style='filter:alpha(opacity=50);' src='images/option.png' class='option'>";
        moves = a.GetMoves("p"), options = !1, this.ClearOptions();
        for (var d = moves.length - 1; d >= 0; d--) {
            var e = moves[d];
            if (e[0] === b) {
                var f = $("#pos" + e[1]);
                f.html(c), f.find("img").data({
                    parent: b
                }), options = !0
            }
        }
    }, this.DisplayBoard = function (a) {
        this.ClearBoard();
        for (var b = a.length - 1; b >= 0; b--) {
            var c, d;
            a[b] === "c" ? $("#pos" + b).prepend('<img src="images/piecec.png" class="cPiece">') : a[b] === "p" ? $("#pos" + b).prepend('<img src="images/piecep.png" class="pPiece">') : $("#pos" + b).html("")
        }
    }
}

function GameState() {
    this.grid = new Array, this.playerPieces = new Array, this.computerPieces = new Array;
    for (var a = 0; a < 9; a++) this.grid[a] = "-";
    this.GetPieces = function (a) {
        if (a === "c") return this.computerPieces;
        if (a === "p") return this.playerPieces
    }
}

function AlphaBeta(a) {
    var b = $("#difficulty .active").text().toLowerCase(),
        c = b == "easy" ? 2 : 10;
    return MaxValue(a, -gInfinity, gInfinity, 0, c)
}

function MaxValue(a, b, c, d, e) {
    if (a.IsTerminal() || d > e) return a.GetScore(d);
    var f, g = -gInfinity,
        h = a.GetMoves("c"),
        i = h[0];
    for (var j = h.length - 1; j >= 0; j--) {
        var k = h[j];
        f = MinValue(a.GetNext(k, "c"), b, c, d + 1, e), f > g && (g = f, i = k);
        if (g >= c) return d === 0 ? k : g;
        g > b && (b = g)
    }
    return d === 0 ? i : g
}

function MinValue(a, b, c, d, e) {
    if (a.IsTerminal() || d > e) return a.GetScore(d);
    var f, g = gInfinity,
        h = a.GetMoves("p"),
        i = h[0];
    for (var j = h.length - 1; j >= 0; j--) {
        var k = h[j];
        f = MaxValue(a.GetNext(k, "p"), b, c, d + 1, e), f < g && (g = f, i = k);
        if (g <= b) return d === 0 ? k : g;
        g < c && (c = g)
    }
    return d === 0 ? i : g
}

function CopyBoard(a) {
    var b = Array();
    return b = a.slice(0), b
}
var gRotaGame, gBoard = new GameBoard;
$(document).ready(function () {
    InitGame(), $("body").on("click", ".option", function () {
        if (gBoard.IsGameOver()) alert("GAME OVER BUDDY. CLICK 'PLAY AGAIN' TO CONTINUE");
        else if (gBoard.IsComputerMoving()) alert("HEY! WAIT YOUR TURN.");
        else {
            var a = new Array,
                b = $(this).parent().prop("id");
            a[0] = $(this).data().parent, a[1] = parseInt(b.replace("pos", "")), gRotaGame.MakeMove(a, "p"), gBoard.DisplayMove(gRotaGame, a), gBoard.SwitchTurn(gRotaGame)
        }
    }), $("body").on("click", ".pPiece", function () {
        if (gBoard.IsGameOver()) alert("GAME OVER BUDDY. CLICK 'PLAY AGAIN' TO CONTINUE");
        else if (gBoard.IsComputerMoving()) alert("HEY! WAIT YOUR TURN.");
        else {
            var a = gRotaGame.GetPieces("p");
            if (a.length === 3) {
                var b = $(this).parent().prop("id"),
                    c = parseInt(b.replace("pos", ""));
                gBoard.DisplayOptions(gRotaGame, c)
            }
        }
    }), $("body").on("click", ".cPiece", function () {
        gBoard.IsGameOver() ? alert("GAME OVER BUDDY. CLICK 'PLAY AGAIN' TO CONTINUE") : alert("THAT'S NOT YOUR PIECE. PLEASE CHOOSE YOUR MOVE")
    })
}), gMoveOptions = new Array, gMoveOptions[0] = [1, 2, 3, 4, 5, 6, 7, 8], gMoveOptions[1] = [0, 2, 8], gMoveOptions[2] = [0, 1, 3], gMoveOptions[3] = [0, 2, 4], gMoveOptions[4] = [0, 3, 5], gMoveOptions[5] = [0, 4, 6], gMoveOptions[6] = [0, 5, 7], gMoveOptions[7] = [0, 6, 8], gMoveOptions[8] = [0, 1, 7], gWin = new Array, gWin[0] = [0, 1, 5], gWin[1] = [0, 2, 6], gWin[2] = [0, 3, 7], gWin[3] = [0, 4, 8], gWin[4] = [1, 2, 3], gWin[5] = [2, 3, 4], gWin[6] = [3, 4, 5], gWin[7] = [4, 5, 6], gWin[8] = [5, 6, 7], gWin[9] = [6, 7, 8], gWin[10] = [1, 7, 8], gWin[11] = [1, 2, 8], gInfinity = 99, GameState.prototype.GetBoard = function () {
    return this.grid
}, GameState.prototype.MakeAIMove = function () {
    var a = AlphaBeta(this);
    return this.MakeMove(a, "c"), a
}, GameState.prototype.GetMoves = function (a) {
    var b, c, d = new Array,
        e = a === "c" ? this.computerPieces : this.playerPieces;
    if (e.length < 3)
        for (var f = this.grid.length - 1; f >= 0; f--) this.grid[f] === "-" && d.push([-1, f]);
    else
        for (var g = e.length - 1; g >= 0; g--) {
            b = e[g];
            for (f = gMoveOptions[b].length - 1; f >= 0; f--) c = gMoveOptions[b][f], this.grid[c] === "-" && d.push([b, c])
        }
    return d
}, GameState.prototype.IsTerminal = function () {
    return this.GetScore(0) != 0
}, GameState.prototype.GetScore = function (a) {
    var b = this.computerPieces,
        c = this.playerPieces;
    return this.CheckWin(b) ? gInfinity - a : this.CheckWin(c) ? -gInfinity + a : 0
}, GameState.prototype.CheckWin = function (a) {
    a.sort();
    for (var b = gWin.length - 1; b >= 0; b--)
        if (gWin[b][0] == a[0] && gWin[b][1] == a[1] && gWin[b][2] == a[2]) return !0;
    return !1
}, GameState.prototype.GetNext = function (a, b) {
    var c = new GameState;
    return c.grid = CopyBoard(this.grid), c.MakeMove(a, b), c
}, GameState.prototype.MakeMove = function (a, b) {
    a[0] !== -1 && (this.grid[a[0]] = "-"), this.grid[a[1]] = b, this.UpdatePieces()
}, GameState.prototype.UpdatePieces = function () {
    this.computerPieces.length = 0, this.playerPieces.length = 0;
    for (var a = 0; a < 9; a++) this.grid[a] === "p" ? this.playerPieces.push(a) : this.grid[a] === "c" && this.computerPieces.push(a)
}
