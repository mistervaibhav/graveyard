
import java.util.*;
import java.io.*;

class Solution {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        // testcases
        int t = in.nextInt();

        // System.out.println(t);

        while (t-- != 0) {

            int rounds = in.nextInt();

            int a[] = new int[rounds];
            int b[] = new int[rounds];

            int chef = 0;
            int morty = 0;

            for (int i = 0; i < rounds; i++) {
                a[i] = in.nextInt();
                b[i] = in.nextInt();
            }

            for (int i = 0; i < rounds; i++) {

                if (power(a[i]) > power(b[i])) {
                    chef++;
                } else if (power(a[i]) < power(b[i])) {
                    morty++;
                } else if (power(a[i]) == power(b[i])) {
                    chef++;
                    morty++;
                }

            }

            if (chef > morty) {
                System.out.println(0 + " " + chef);
            } else if (chef < morty) {
                System.out.println(1 + " " + morty);
            } else if (chef == morty) {
                System.out.println(2 + " " + chef);
            }

            // System.out.println(rounds);
            // for (int num : a) {
            // System.out.println(num);
            // }
            // for (int num : b) {
            // System.out.println(num);
            // }

        }

    }

    static int power(int num) {

        int sum = 0;

        while (num != 0) {
            sum = sum + num % 10;
            num = num / 10;
        }

        return sum;

    }

}