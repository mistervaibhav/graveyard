
import java.util.*;
import java.io.*;

public class Team {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int n = in.nextInt();

        int count = 0;

        for (int i = 0; i < n; i++) {

            int views = 0;

            for (int j = 0; j < 3; j++) {

                int temp = in.nextInt();
                if (temp == 1) {
                    views++;
                }
            }

            if (views >= 2) {
                count++;
            }

        }

        System.out.println(count);

        in.close();
    }

}