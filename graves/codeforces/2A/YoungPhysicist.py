import sys


############ ---- Input Functions ---- ############
def single_integer_input():
    return int(sys.stdin.readline())


def array_of_integers_input():
    return list(map(int, sys.stdin.readline().split()))


def array_of_chars_input():
    s = sys.stdin.readline()
    return list(s[: len(s) - 1])


def space_separated_integers_input():
    return map(int, sys.stdin.readline().split())


if __name__ == "__main__":
    n = single_integer_input()
    
    sum_x = 0
    sum_y = 0
    sum_z = 0

    for i in range(n):
        vector = list(space_separated_integers_input())
        
        sum_x += vector[0]
        sum_y += vector[1]
        sum_z += vector[2]

    if sum_x == 0 and sum_y == 0 and sum_z == 0:
        print("YES")
    else:
        print("NO")
        
        