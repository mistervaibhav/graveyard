import java.util.*;
import java.lang.*;
import java.io.*;

public class Magnets {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int n = in.nextInt();

        int magnets[] = new int[n];

        for (int i = 0; i < n; i++) {
            magnets[i] = in.nextInt();
        }

        int groups = 1;

        for (int i = 0; i < n - 1; i++) {

            if (magnets[i] != magnets[i + 1]) {
                groups++;
            }

        }

        System.out.println(groups);
        in.close();

    }

}