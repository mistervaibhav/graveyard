import java.util.*;
import java.io.*;

class Solution {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int t = in.nextInt();

        while (t-- != 0) {

            int n = in.nextInt();

            int maxProfit = Integer.MIN_VALUE;

            while (n-- > 0) {

                int s = in.nextInt();
                int p = in.nextInt();
                int v = in.nextInt();

                int currentProfit = v * (int) Math.floor(p / (s + 1));

                maxProfit = Math.max(maxProfit, currentProfit);

            }

            System.out.println(maxProfit);
        }

    }

}