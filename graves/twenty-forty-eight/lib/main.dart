import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const TwentyFortyEightApp());
}

class TwentyFortyEightApp extends StatelessWidget {
  const TwentyFortyEightApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '2048',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xfffaf8ef),
        useMaterial3: false,
      ),
      home: const GamePage(),
    );
  }
}

class GamePage extends StatefulWidget {
  const GamePage({super.key});

  @override
  State<GamePage> createState() => _GamePageState();
}

class _GamePageState extends State<GamePage> {
  late final GameStorage _storage;
  late final GameManager _game;
  bool _loading = true;
  int _scoreDelta = 0;
  Timer? _scoreDeltaTimer;
  Offset? _dragStart;
  Offset? _dragUpdate;
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _storage = GameStorage();
    _game = GameManager(size: 4, storage: _storage);
    _bootstrap();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _focusNode.requestFocus();
      }
    });
  }

  Future<void> _bootstrap() async {
    await _game.initialize();
    if (mounted) {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  void dispose() {
    _scoreDeltaTimer?.cancel();
    _focusNode.dispose();
    super.dispose();
  }

  void _handleMove(Direction direction) {
    if (_loading) return;
    final previousScore = _game.score;
    final moved = _game.move(direction);
    if (moved) {
      final delta = _game.score - previousScore;
      if (delta > 0) {
        _showScoreDelta(delta);
      }
      setState(() {});
    }
  }

  void _showScoreDelta(int delta) {
    _scoreDeltaTimer?.cancel();
    setState(() => _scoreDelta = delta);
    _scoreDeltaTimer = Timer(const Duration(milliseconds: 700), () {
      if (mounted) {
        setState(() => _scoreDelta = 0);
      }
    });
  }

  void _handleRestart() {
    setState(() {
      _scoreDelta = 0;
      _game.restart();
    });
  }

  void _handleKeepPlaying() {
    setState(() => _game.continueAfterWin());
  }

  KeyEventResult _onKeyEvent(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final direction = _directionForKey(event.logicalKey);
    if (direction != null) {
      _handleMove(direction);
      return KeyEventResult.handled;
    }
    if (event.logicalKey == LogicalKeyboardKey.keyR) {
      _handleRestart();
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  Direction? _directionForKey(LogicalKeyboardKey key) {
    if (key == LogicalKeyboardKey.arrowUp ||
        key == LogicalKeyboardKey.keyW ||
        key == LogicalKeyboardKey.keyK) {
      return Direction.up;
    }
    if (key == LogicalKeyboardKey.arrowRight ||
        key == LogicalKeyboardKey.keyD ||
        key == LogicalKeyboardKey.keyL) {
      return Direction.right;
    }
    if (key == LogicalKeyboardKey.arrowDown ||
        key == LogicalKeyboardKey.keyS ||
        key == LogicalKeyboardKey.keyJ) {
      return Direction.down;
    }
    if (key == LogicalKeyboardKey.arrowLeft ||
        key == LogicalKeyboardKey.keyA ||
        key == LogicalKeyboardKey.keyH) {
      return Direction.left;
    }
    return null;
  }

  void _onPanStart(DragStartDetails details) {
    _dragStart = details.localPosition;
    _dragUpdate = details.localPosition;
  }

  void _onPanUpdate(DragUpdateDetails details) {
    _dragUpdate = details.localPosition;
  }

  void _onPanEnd(DragEndDetails details) {
    if (_dragStart == null || _dragUpdate == null) return;
    final delta = _dragUpdate! - _dragStart!;
    final direction = _directionFromDelta(delta);
    _dragStart = null;
    _dragUpdate = null;
    if (direction != null) {
      _handleMove(direction);
    }
  }

  void _onPanCancel() {
    _dragStart = null;
    _dragUpdate = null;
  }

  Direction? _directionFromDelta(Offset delta) {
    const threshold = 10;
    final absDx = delta.dx.abs();
    final absDy = delta.dy.abs();
    if (max(absDx, absDy) < threshold) return null;
    if (absDx > absDy) {
      return delta.dx > 0 ? Direction.right : Direction.left;
    }
    return delta.dy > 0 ? Direction.down : Direction.up;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Focus(
          focusNode: _focusNode,
          autofocus: true,
          onKeyEvent: _onKeyEvent,
          child: LayoutBuilder(
            builder: (context, constraints) {
              if (_loading) {
                return const Center(
                  child: CircularProgressIndicator(color: Color(0xff8f7a66)),
                );
              }

              final contentWidth = min(constraints.maxWidth - 24, 520.0);
              final boardLayout = BoardLayout.fromMaxWidth(contentWidth);
              final isCompact = boardLayout.compact;

              return Center(
                child: SingleChildScrollView(
                  padding: EdgeInsets.symmetric(
                    vertical: isCompact ? 20 : 60,
                    horizontal: 12,
                  ),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(maxWidth: contentWidth),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildHeader(isCompact),
                        const SizedBox(height: 12),
                        _buildIntro(isCompact),
                        const SizedBox(height: 12),
                        _buildBoard(boardLayout),
                        const SizedBox(height: 20),
                        _buildHowToPlay(isCompact),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(bool compact) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '2048',
          style: TextStyle(
            fontSize: compact ? 48 : 80,
            fontWeight: FontWeight.bold,
            color: const Color(0xff776e65),
          ),
        ),
        const Spacer(),
        ScoreBox(
          label: 'Score',
          value: _game.score,
          delta: _scoreDelta,
        ),
        const SizedBox(width: 8),
        ScoreBox(
          label: 'Best',
          value: _game.bestScore,
        ),
      ],
    );
  }

  Widget _buildIntro(bool compact) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Text(
            'Join the numbers and get to the 2048 tile!',
            style: TextStyle(
              fontSize: compact ? 15 : 18,
              color: const Color(0xff776e65),
            ),
          ),
        ),
        const SizedBox(width: 12),
        SizedBox(
          height: 40,
          width: compact ? 120 : 140,
          child: TextButton(
            style: TextButton.styleFrom(
              backgroundColor: const Color(0xff8f7a66),
              foregroundColor: const Color(0xfff9f6f2),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(3),
              ),
            ),
            onPressed: _handleRestart,
            child: const Text('New Game'),
          ),
        ),
      ],
    );
  }

  Widget _buildBoard(BoardLayout layout) {
    final tiles = _game.tiles;
    final showMessage = _game.over || (_game.won && !_game.keepPlayingFlag);
    final message = _game.over ? 'Game over!' : 'You win!';
    final overlayColor = _game.over
        ? const Color.fromRGBO(238, 228, 218, 0.5)
        : const Color.fromRGBO(237, 194, 46, 0.5);

    return GestureDetector(
      onPanStart: _onPanStart,
      onPanUpdate: _onPanUpdate,
      onPanEnd: _onPanEnd,
      onPanCancel: _onPanCancel,
      onTap: () => _focusNode.requestFocus(),
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: layout.size,
        height: layout.size,
        decoration: BoxDecoration(
          color: const Color(0xffbbada0),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Stack(
          children: [
            ..._buildBackgroundCells(layout),
            ...tiles.map((tile) => _buildTile(tile, layout)),
            if (showMessage)
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    color: overlayColor,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        message,
                        style: TextStyle(
                          fontSize: layout.compact ? 36 : 60,
                          fontWeight: FontWeight.bold,
                          color: _game.over
                              ? const Color(0xff776e65)
                              : const Color(0xfff9f6f2),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Wrap(
                        spacing: 12,
                        children: [
                          if (_game.won)
                            _OverlayButton(
                              label: 'Keep going',
                              onPressed: _handleKeepPlaying,
                            ),
                          _OverlayButton(
                            label: 'Try again',
                            onPressed: _handleRestart,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildBackgroundCells(BoardLayout layout) {
    final cells = <Widget>[];
    final radius = BorderRadius.circular(3);
    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        final left = layout.padding + x * (layout.cellSize + layout.spacing);
        final top = layout.padding + y * (layout.cellSize + layout.spacing);
        cells.add(
          Positioned(
            left: left,
            top: top,
            child: Container(
              width: layout.cellSize,
              height: layout.cellSize,
              decoration: BoxDecoration(
                color: const Color.fromRGBO(238, 228, 218, 0.35),
                borderRadius: radius,
              ),
            ),
          ),
        );
      }
    }
    return cells;
  }

  Widget _buildTile(Tile tile, BoardLayout layout) {
    final left = layout.padding + tile.x * (layout.cellSize + layout.spacing);
    final top = layout.padding + tile.y * (layout.cellSize + layout.spacing);
    final radius = BorderRadius.circular(3);
    final background = tileColors[tile.value] ?? const Color(0xff3c3a32);
    final textColor =
        tile.value <= 4 ? const Color(0xff776e65) : const Color(0xfff9f6f2);
    final fontSize = _tileFontSize(tile.value, layout.cellSize);

    return AnimatedPositioned(
      key: ValueKey(tile.id),
      duration: const Duration(milliseconds: 100),
      curve: Curves.easeInOut,
      left: left,
      top: top,
      child: TweenAnimationBuilder<double>(
        tween: Tween<double>(
          begin: (tile.isNew || tile.wasMerged) ? 0.0 : 1.0,
          end: 1.0,
        ),
        duration: const Duration(milliseconds: 150),
        curve: Curves.easeOut,
        builder: (context, scale, child) {
          return Transform.scale(scale: scale, child: child);
        },
        child: Container(
          width: layout.cellSize,
          height: layout.cellSize,
          decoration: BoxDecoration(
            color: background,
            borderRadius: radius,
            boxShadow: tile.value >= 128
                ? [
                    BoxShadow(
                      color: const Color.fromRGBO(243, 215, 116, 0.25),
                      blurRadius: 20,
                      spreadRadius: 4,
                    ),
                  ]
                : null,
          ),
          alignment: Alignment.center,
          child: Text(
            '${tile.value}',
            style: TextStyle(
              color: textColor,
              fontWeight: FontWeight.w800,
              fontSize: fontSize,
            ),
          ),
        ),
      ),
    );
  }

  double _tileFontSize(int value, double cellSize) {
    if (value < 128) return cellSize * 0.52;
    if (value < 1024) return cellSize * 0.44;
    if (value < 2048) return cellSize * 0.38;
    return cellSize * 0.34;
  }

  Widget _buildHowToPlay(bool compact) {
    return Text.rich(
      TextSpan(
        children: [
          const TextSpan(
            text: 'How to play: ',
            style: TextStyle(fontWeight: FontWeight.w700),
          ),
          const TextSpan(text: 'Use your '),
          const TextSpan(
            text: 'arrow keys',
            style: TextStyle(fontWeight: FontWeight.w700),
          ),
          const TextSpan(text: ' to move the tiles. When two tiles with the '),
          const TextSpan(
            text: 'same number',
            style: TextStyle(fontWeight: FontWeight.w700),
          ),
          const TextSpan(text: ' touch, they '),
          const TextSpan(
            text: 'merge into one!',
            style: TextStyle(fontWeight: FontWeight.w700),
          ),
        ],
        style: TextStyle(
          fontSize: compact ? 14 : 16,
          color: const Color(0xff776e65),
          height: 1.5,
        ),
      ),
    );
  }
}

class ScoreBox extends StatelessWidget {
  const ScoreBox({
    super.key,
    required this.label,
    required this.value,
    this.delta = 0,
  });

  final String label;
  final int value;
  final int delta;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
      decoration: BoxDecoration(
        color: const Color(0xffbbada0),
        borderRadius: BorderRadius.circular(3),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '$value',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                label.toUpperCase(),
                style: const TextStyle(
                  color: Color(0xffeee4da),
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1,
                ),
              ),
            ],
          ),
          if (delta > 0)
            Positioned(
              right: -2,
              top: -8,
              child: AnimatedOpacity(
                opacity: 1,
                duration: const Duration(milliseconds: 400),
                child: Text(
                  '+$delta',
                  style: const TextStyle(
                    color: Color.fromRGBO(119, 110, 101, 0.9),
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _OverlayButton extends StatelessWidget {
  const _OverlayButton({required this.label, required this.onPressed});

  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 40,
      child: TextButton(
        style: TextButton.styleFrom(
          backgroundColor: const Color(0xff8f7a66),
          foregroundColor: const Color(0xfff9f6f2),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(3),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 18),
        ),
        onPressed: onPressed,
        child: Text(label),
      ),
    );
  }
}

class BoardLayout {
  BoardLayout({
    required this.size,
    required this.padding,
    required this.spacing,
    required this.cellSize,
    required this.compact,
  });

  factory BoardLayout.fromMaxWidth(double maxWidth) {
    final size = max(280.0, min(500.0, maxWidth));
    final compact = size < 400;
    final padding = compact ? 10.0 : 15.0;
    final spacing = compact ? 10.0 : 15.0;
    final cellSize = (size - padding * 2 - spacing * 3) / 4;

    return BoardLayout(
      size: size,
      padding: padding,
      spacing: spacing,
      cellSize: cellSize,
      compact: compact,
    );
  }

  final double size;
  final double padding;
  final double spacing;
  final double cellSize;
  final bool compact;
}

enum Direction { up, right, down, left }

class Position {
  const Position(this.x, this.y);

  final int x;
  final int y;
}

class Tile {
  Tile(this.position, this.value) : id = _nextId++;

  static int _nextId = 0;

  final int id;
  int value;
  int get x => position.x;
  int get y => position.y;
  Position position;
  bool isNew = false;
  bool wasMerged = false;
  bool mergedThisTurn = false;

  void updatePosition(Position position) {
    this.position = position;
  }

  Map<String, dynamic> serialize() {
    return {
      'position': {'x': x, 'y': y},
      'value': value,
    };
  }
}

class Grid {
  Grid(this.size)
      : cells =
            List.generate(size, (_) => List<Tile?>.filled(size, null, growable: false));

  Grid.fromValues(this.size, List<List<int?>> values)
      : cells =
            List.generate(size, (_) => List<Tile?>.filled(size, null, growable: false)) {
    for (var x = 0; x < size; x++) {
      for (var y = 0; y < size; y++) {
        final value = values[x][y];
        if (value != null) {
          final tile = Tile(Position(x, y), value);
          insertTile(tile);
        }
      }
    }
  }

  final int size;
  final List<List<Tile?>> cells;

  List<Position> availableCells() {
    final list = <Position>[];
    eachCell((x, y, tile) {
      if (tile == null) list.add(Position(x, y));
    });
    return list;
  }

  bool cellsAvailable() => availableCells().isNotEmpty;

  Position? randomAvailableCell(Random random) {
    final available = availableCells();
    if (available.isEmpty) return null;
    return available[random.nextInt(available.length)];
  }

  void insertTile(Tile tile) {
    cells[tile.x][tile.y] = tile;
  }

  void removeTile(Tile tile) {
    if (withinBounds(tile.position)) {
      cells[tile.x][tile.y] = null;
    }
  }

  Tile? cellContent(Position position) {
    if (withinBounds(position)) {
      return cells[position.x][position.y];
    }
    return null;
  }

  bool cellAvailable(Position position) => !cellOccupied(position);

  bool cellOccupied(Position position) => cellContent(position) != null;

  bool withinBounds(Position position) {
    return position.x >= 0 &&
        position.x < size &&
        position.y >= 0 &&
        position.y < size;
  }

  void eachCell(void Function(int x, int y, Tile? tile) action) {
    for (var x = 0; x < size; x++) {
      for (var y = 0; y < size; y++) {
        action(x, y, cells[x][y]);
      }
    }
  }

  List<List<int?>> serialize() {
    final serialized = <List<int?>>[];
    for (var x = 0; x < size; x++) {
      final row = <int?>[];
      for (var y = 0; y < size; y++) {
        row.add(cells[x][y]?.value);
      }
      serialized.add(row);
    }
    return serialized;
  }

  List<Tile> allTiles() {
    final result = <Tile>[];
    for (final column in cells) {
      for (final tile in column) {
        if (tile != null) result.add(tile);
      }
    }
    return result;
  }
}

class GameManager {
  GameManager({required this.size, required this.storage}) : random = Random();

  final int size;
  final GameStorage storage;
  late Grid grid;
  final Random random;
  int score = 0;
  int bestScore = 0;
  bool over = false;
  bool won = false;
  bool keepPlayingFlag = false;
  final int startTiles = 2;

  List<Tile> get tiles => grid.allTiles();

  bool get terminated => over || (won && !keepPlayingFlag);

  Future<void> initialize() async {
    await storage.init();
    bestScore = storage.bestScore;
    final saved = storage.loadGame();
    if (saved != null && saved.grid.length == size) {
      grid = Grid.fromValues(size, saved.grid);
      score = saved.score;
      over = saved.over;
      won = saved.won;
      keepPlayingFlag = saved.keepPlaying;
    } else {
      _freshGrid();
    }

    // If the saved state ended up empty, seed the grid.
    if (tiles.isEmpty) {
      addStartTiles();
    }
    _actuate();
  }

  void _freshGrid() {
    grid = Grid(size);
    score = 0;
    over = false;
    won = false;
    keepPlayingFlag = false;
    addStartTiles();
  }

  void restart() {
    _freshGrid();
    storage.clearGameState();
    _actuate();
  }

  void continueAfterWin() {
    keepPlayingFlag = true;
    _actuate();
  }

  void addStartTiles() {
    for (var i = 0; i < startTiles; i++) {
      addRandomTile();
    }
  }

  void addRandomTile() {
    if (!grid.cellsAvailable()) return;
    final value = random.nextDouble() < 0.9 ? 2 : 4;
    final position = grid.randomAvailableCell(random)!;
    final tile = Tile(position, value)..isNew = true;
    grid.insertTile(tile);
  }

  void prepareTiles() {
    grid.eachCell((x, y, tile) {
      if (tile != null) {
        tile.mergedThisTurn = false;
        tile.wasMerged = false;
        tile.isNew = false;
      }
    });
  }

  bool move(Direction direction) {
    if (terminated) return false;
    final vector = _getVector(direction);
    final traversals = _buildTraversals(vector);
    var moved = false;

    prepareTiles();

    for (final x in traversals.x) {
      for (final y in traversals.y) {
        final position = Position(x, y);
        final tile = grid.cellContent(position);

        if (tile != null) {
          final positions = _findFarthestPosition(position, vector);
          final next = grid.cellContent(positions.next);

          if (next != null &&
              next.value == tile.value &&
              !next.mergedThisTurn) {
            grid.removeTile(tile);
            grid.removeTile(next);
            final merged = Tile(positions.next, tile.value * 2)
              ..mergedThisTurn = true
              ..wasMerged = true;

            grid.insertTile(merged);
            score += merged.value;
            if (merged.value == 2048) {
              won = true;
            }
            moved = true;
          } else {
            _moveTile(tile, positions.farthest);
            if (!positionsEqual(position, tile.position)) {
              moved = true;
            }
          }
        }
      }
    }

    if (moved) {
      addRandomTile();
      if (!movesAvailable()) {
        over = true;
      }
      _actuate();
    }

    return moved;
  }

  void _moveTile(Tile tile, Position cell) {
    grid.cells[tile.x][tile.y] = null;
    tile.updatePosition(cell);
    grid.cells[cell.x][cell.y] = tile;
  }

  Position _getVector(Direction direction) {
    switch (direction) {
      case Direction.up:
        return const Position(0, -1);
      case Direction.right:
        return const Position(1, 0);
      case Direction.down:
        return const Position(0, 1);
      case Direction.left:
        return const Position(-1, 0);
    }
  }

  Traversals _buildTraversals(Position vector) {
    final traversals = Traversals(
      x: List<int>.generate(size, (i) => i),
      y: List<int>.generate(size, (i) => i),
    );

    if (vector.x == 1) {
      traversals.x = traversals.x.reversed.toList();
    }
    if (vector.y == 1) {
      traversals.y = traversals.y.reversed.toList();
    }
    return traversals;
  }

  TraversalResult _findFarthestPosition(Position cell, Position vector) {
    var previous = cell;
    var next = Position(previous.x + vector.x, previous.y + vector.y);

    while (grid.withinBounds(next) && grid.cellAvailable(next)) {
      previous = next;
      next = Position(previous.x + vector.x, previous.y + vector.y);
    }

    return TraversalResult(farthest: previous, next: next);
  }

  bool movesAvailable() => grid.cellsAvailable() || tileMatchesAvailable();

  bool tileMatchesAvailable() {
    for (var x = 0; x < size; x++) {
      for (var y = 0; y < size; y++) {
        final tile = grid.cellContent(Position(x, y));
        if (tile != null) {
          for (final direction in Direction.values) {
            final vector = _getVector(direction);
            final cell = Position(x + vector.x, y + vector.y);
            final other = grid.cellContent(cell);
            if (other != null && other.value == tile.value) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  bool positionsEqual(Position first, Position second) {
    return first.x == second.x && first.y == second.y;
  }

  void _actuate() {
    if (score > bestScore) {
      bestScore = score;
      unawaited(storage.saveBestScore(bestScore));
    }

    if (over) {
      unawaited(storage.clearGameState());
    } else {
      final data = GameData(
        grid: grid.serialize(),
        score: score,
        over: over,
        won: won,
        keepPlaying: keepPlayingFlag,
      );
      unawaited(storage.saveGameState(data));
    }
  }
}

class Traversals {
  Traversals({required this.x, required this.y});

  List<int> x;
  List<int> y;
}

class TraversalResult {
  TraversalResult({required this.farthest, required this.next});

  final Position farthest;
  final Position next;
}

class GameData {
  GameData({
    required this.grid,
    required this.score,
    required this.over,
    required this.won,
    required this.keepPlaying,
  });

  final List<List<int?>> grid;
  final int score;
  final bool over;
  final bool won;
  final bool keepPlaying;

  Map<String, dynamic> toJson() {
    return {
      'grid': grid,
      'score': score,
      'over': over,
      'won': won,
      'keepPlaying': keepPlaying,
    };
  }

  factory GameData.fromJson(Map<String, dynamic> json) {
    final grid = (json['grid'] as List)
        .map(
          (col) => (col as List).map((value) => value as int?).toList(),
        )
        .toList();
    return GameData(
      grid: grid,
      score: json['score'] as int,
      over: json['over'] as bool,
      won: json['won'] as bool,
      keepPlaying: json['keepPlaying'] as bool,
    );
  }
}

class GameStorage {
  static const _bestScoreKey = 'bestScore';
  static const _gameStateKey = 'gameState';

  SharedPreferences? _prefs;

  Future<void> init() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  int get bestScore => _prefs?.getInt(_bestScoreKey) ?? 0;

  Future<void> saveBestScore(int value) async {
    final prefs = _prefs;
    if (prefs == null) return;
    await prefs.setInt(_bestScoreKey, value);
  }

  GameData? loadGame() {
    final prefs = _prefs;
    if (prefs == null) return null;
    final raw = prefs.getString(_gameStateKey);
    if (raw == null) return null;
    try {
      final decoded = jsonDecode(raw) as Map<String, dynamic>;
      return GameData.fromJson(decoded);
    } catch (_) {
      return null;
    }
  }

  Future<void> saveGameState(GameData data) async {
    final prefs = _prefs;
    if (prefs == null) return;
    await prefs.setString(_gameStateKey, jsonEncode(data.toJson()));
  }

  Future<void> clearGameState() async {
    final prefs = _prefs;
    if (prefs == null) return;
    await prefs.remove(_gameStateKey);
  }
}

const Map<int, Color> tileColors = {
  2: Color(0xffeee4da),
  4: Color(0xffede0c8),
  8: Color(0xfff2b179),
  16: Color(0xfff59563),
  32: Color(0xfff67c5f),
  64: Color(0xfff65e3b),
  128: Color(0xffedcf72),
  256: Color(0xffedcc61),
  512: Color(0xffedc850),
  1024: Color(0xffedc53f),
  2048: Color(0xffedc22e),
};
