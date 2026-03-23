
import java.util.*;
import java.io.*;

class Solution {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int t = in.nextInt();

        while (t-- != 0) {

            int n = in.nextInt(); // columns
            long m = in.nextLong(); // cubes

            long heights[] = new long[n];
            long peak = -1;

            for (int i = 0; i < n; i++) {
                heights[i] = in.nextLong();
                peak = Math.max(peak, heights[i]);
            }

            int diffs[] = new int[n];
            int diffSum = 0;

            for (int i = 0; i < n; i++) {
                diffs[i] = (int) (peak - heights[i]);
                diffSum += diffs[i];
            }

            // ! THE CORRECT OUTPUT
            // System.out.println("diffsum is : " + diffSum + " m is : " + m);
            // if (m < diffSum) {
            // System.out.println("No");
            // } else if ((m > diffSum && (m - diffSum) % n == 0)) {
            // System.out.println("Yes");
            // } else if (diffSum == m) {
            // System.out.println("Yes");
            // } else {
            // System.out.println("No");
            // }

            // ! THE SELECTED OUTPUT
            if (((m - diffSum) % n == 0)) {
                System.out.println("Yes");
            } else {
                System.out.println("No");
            }
            // ! FAILS FOR CASE : N = 6, M = 5, A = [1,12,12,12,12,12]

        }

    }

}