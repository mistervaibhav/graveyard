def get_input():
    with open("input.txt", "r") as file:
        lines = [line for line in file.readlines()]

    return lines


def get_calibration_value_for_part_one(line: str):
    digits = []

    for character in line:
        if character.isdigit():
            digits.append(int(character))

    if len(digits) == 1:
        return int(f"{digits[0]}{digits[0]}")

    return int(f"{digits[0]}{digits[-1]}")


def part_one(lines):
    sum = 0

    for line in lines:
        calibration_value = get_calibration_value_for_part_one(line)

        sum += calibration_value

    return sum


numbers = {
    "oneight": "18",
    "twone": "21",
    "threeight": "38",
    "fiveight": "58",
    "sevenine": "79",
    "eightwo": "82",
    "eighthree": "83",
    "nineight": "98",
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
}


def get_calibration_value_for_part_two(line: str):
    digits = []

    for number in numbers:
        line = line.replace(number, str(numbers[number]))

    for character in line:
        if character.isdigit():
            digits.append(int(character))

    if len(digits) == 1:
        return int(f"{digits[0]}{digits[0]}")

    return int(f"{digits[0]}{digits[-1]}")


def part_two(lines):
    sum = 0

    for line in lines:
        sum += get_calibration_value_for_part_two(line)

    return sum


if __name__ == "__main__":
    """https://adventofcode.com/2023/day/1"""

    lines = get_input()

    # print(part_one(lines))
    print(part_two(lines))
