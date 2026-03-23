
import java.util.*;
import java.io.*;

class Solution {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int t = in.nextInt();

        while (t-- != 0) {

            int plates = in.nextInt();
            long k = in.nextLong();

            long meatballs[] = new long[plates];

            for (int i = 0; i < plates; i++) {
                meatballs[i] = in.nextLong();
            }

            System.out.println(countPlates(meatballs, k));

        }

    }

    static long countPlates(long arr[], long target) {

        Arrays.sort(arr);
        long sum = 0;
        long count = 0;

        for (int i = arr.length - 1; i >= 0; i--) {

            sum += arr[i];
            count++;

            if (sum >= target) {
                return count;
            }

        }

        return -1;

    }

}