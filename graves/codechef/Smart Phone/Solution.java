import java.util.*;
import java.io.*;

class Solution {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int customers = in.nextInt();

        int budgets[] = new int[customers];

        for (int i = 0; i < customers; i++) {
            budgets[i] = in.nextInt();
        }

        Arrays.sort(budgets);

        long profit = 0;

        for (int i = 1; i <= customers; i++) {
            profit = Math.max(profit, (long) i * budgets[customers - i]);
        }

        System.out.println(profit);

        in.close();
    }

}