import java.util.*;
import java.io.*;

public class BusinessTrip {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int k = in.nextInt();

        int calender[] = new int[12];

        int water = 0;
        int sum = 0;
        int res = -1;

        for (int i = 0; i < 12; i++) {
            calender[i] = in.nextInt();
        }

        Arrays.sort(calender);

        for (int i = 11; i >= 0; i--) {

            sum += calender[i];
            water++;

            if (sum >= k) {
                res = water;
                break;
            }
        }

        if (k == 0) {
            res = 0;
        }

        System.out.println(res);

        in.close();
    }

}
