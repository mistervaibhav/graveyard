"""https://codeforces.com/problemset/problem/266/B"""

import sys


def array_of_chars_input():
    s = sys.stdin.readline()
    return list(s[: len(s) - 1])


def space_separated_integers_input():
    return map(int, sys.stdin.readline().split())


if __name__ == "__main__":
    children, time = space_separated_integers_input()
    positions = array_of_chars_input()

    def transform():
        index = 1
        while index < children:
            if positions[index] == "G" and positions[index - 1] == "B":
                positions[index - 1] = "G"
                positions[index] = "B"
                index += 1

            index += 1

    while time > 0:
        transform()
        time -= 1

    print("".join(positions))
