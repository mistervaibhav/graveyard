import java.util.*;
import java.lang.*;
import java.io.*;

class Solution {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int t = in.nextInt();

        while (t-- != 0) {

            int count = in.nextInt();

            int friends[] = new int[count];

            int present = 0;

            for (int i = 0; i < friends.length; i++) {
                friends[i] = in.nextInt();
            }

            Arrays.sort(friends);

            for (int i = 0; i < friends.length; i++) {

                if (friends[i] <= present) {
                    present++;
                }

            }

            System.out.println(present);

        }

        in.close();
    }

}