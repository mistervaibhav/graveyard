import java.util.*;
import java.lang.*;
import java.io.*;

class Solution {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int a = in.nextInt();
        int b = in.nextInt();

        int diff = a - b;

        if (diff % 10 == 9) {
            System.out.println(diff - 1);
        } else {
            System.out.println(diff + 1);
        }

        in.close();
    }

}