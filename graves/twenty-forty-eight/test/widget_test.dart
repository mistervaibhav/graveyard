// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:twenty_forty_eight/main.dart';

void main() {
  testWidgets('Renders 2048 board scaffold', (WidgetTester tester) async {
    await tester.pumpWidget(const TwentyFortyEightApp());

    expect(find.text('2048'), findsOneWidget);
    expect(find.text('New Game'), findsOneWidget);
    expect(find.byType(Focus), findsWidgets);
  });
}
