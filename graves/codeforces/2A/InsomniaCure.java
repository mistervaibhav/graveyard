import java.util.*;
import java.lang.*;
import java.io.*;

public class InsomniaCure {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int k = in.nextInt();
        int l = in.nextInt();
        int m = in.nextInt();
        int n = in.nextInt();
        int dragons = in.nextInt();

        int damaged = 0;

        for (int i = 1; i <= dragons; i++) {

            if (i % k == 0 || i % l == 0 || i % m == 0 || i % n == 0) {
                damaged++;
            }

        }

        System.out.println(damaged);

        in.close();

    }

}