import java.util.*;
import java.io.*;

class Solution {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int t = in.nextInt();

        while (t-- != 0) {

            // Code Here

            int chef = in.nextInt();
            int rick = in.nextInt();

            int chefQ = chef / 9;
            int chefR = chef % 9;
            int rickQ = rick / 9;
            int rickR = rick % 9;

            if (chefR >= 0) {
                chefQ++;
            }
            if (rickR >= 0) {
                rickQ++;
            }

            if (chefQ < rickQ) {
                System.out.println(0 + " " + chefQ);
            } else {
                System.out.println(1 + " " + rickQ);
            }

        }

        in.close();
    }

}