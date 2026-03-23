
import java.util.*;
import java.io.*;

class Solution {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int t = in.nextInt();

        while (t-- != 0) {

            int n = in.nextInt();

            int horses[] = new int[n];

            for (int i = 0; i < n; i++) {
                horses[i] = in.nextInt();
            }

            Arrays.sort(horses);

            int minDiff = Integer.MAX_VALUE;
            int diff = 0;

            for (int i = 1; i < n; i++) {
                diff = horses[i] - horses[i - 1];
                minDiff = Math.min(minDiff, diff);

            }
            System.out.println(minDiff);
        }

    }

}