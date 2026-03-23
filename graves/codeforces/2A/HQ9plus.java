
import java.util.*;
import java.io.*;

public class HQ9plus {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        String instruction = in.nextLine();

        if (instruction.contains("H") || instruction.contains("Q") || instruction.contains("9")) {
            System.out.println("YES");
        } else {
            System.out.println("NO");
        }

        in.close();
    }

}