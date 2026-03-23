import java.util.*;
import java.io.*;

public class EvenOdds {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        long n = in.nextLong();
        long k = in.nextLong();

        if (k <= (n + 1) / 2) {
            System.out.println((2 * k) - 1);
        } else {
            System.out.println(2 * (k - (n + 1) / 2));
        }

        in.close();

    }

}