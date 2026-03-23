import java.util.*;
import java.lang.*;
import java.io.*;

public class LittleElephantAndRozdil {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int cities = in.nextInt();

        int times[] = new int[cities];

        int nearest = Integer.MAX_VALUE;

        int count = 0;
        int index = -1;

        for (int i = 0; i < times.length; i++) {

            times[i] = in.nextInt();

            if (times[i] < nearest) {

                nearest = times[i];
                index = i;
                count = 0;

            } else if (times[i] == nearest) {

                count++;

            }

        }

        if (count == 0) {
            System.out.println(index + 1);
        } else {
            System.out.println("Still Rozdil\n");
        }

        in.close();

    }

}