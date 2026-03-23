"""https://codeforces.com/problemset/problem/32/B"""

import sys


def array_of_chars_input():
    s = sys.stdin.readline()
    return list(s[: len(s) - 1])


if __name__ == "__main__":
    borze_code = array_of_chars_input()

    translations = {
        ".": "0",
        "-.": "1",
        "--": "2",
    }

    alphabet = ""
    output = ""

    for letter in borze_code:
        alphabet += letter

        if alphabet in translations:
            output += translations[alphabet]
            alphabet = ""

    print(output)
