import java.util.*;
import java.io.*;

class Solution {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int t = in.nextInt();

        while (t-- != 0) {

            int elephants = in.nextInt();
            int candies = in.nextInt();

            int demands[] = new int[elephants];

            int totalDemand = 0;

            for (int i = 0; i < elephants; i++) {
                demands[i] = in.nextInt();
                totalDemand += demands[i];
            }

            if (totalDemand > candies) {
                System.out.println("No");
            } else {
                System.out.println("Yes");
            }

        }

        in.close();
    }

}