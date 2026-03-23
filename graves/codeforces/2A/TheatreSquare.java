
import java.util.*;
import java.io.*;

public class TheatreSquare {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        Long n = in.nextLong();
        Long m = in.nextLong();
        Long a = in.nextLong();

        System.out.println(((m + a - 1) / a) * ((n + a - 1) / a));

        in.close();

    }

}