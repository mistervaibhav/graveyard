import java.util.*;
import java.io.*;

public class SystemOfEquations {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int n = in.nextInt();
        int m = in.nextInt();

        int pairs = 0;

        for (int i = 0; i <= n; i++) {
            for (int j = 0; j <= m; j++) {

                if (((i * i) + j == n) && (i + (j * j) == m)) {
                    pairs++;
                }

            }
        }

        System.out.println(pairs);

    }

}