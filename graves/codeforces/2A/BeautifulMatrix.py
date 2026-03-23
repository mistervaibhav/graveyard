import sys


def array_of_integers_input():
    return list(map(int, sys.stdin.readline().split()))


if __name__ == "__main__":
    matrix = [array_of_integers_input() for i in range(5)]

    for i in range(5):
        for j in range(5):
            if matrix[i][j] == 1:
                print(abs(i - 2) + abs(j - 2))
