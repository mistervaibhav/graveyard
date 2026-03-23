
import java.util.*;
import java.io.*;

public class Watermelon {

    public static void main(String args[]) throws IOException {

        // System.setIn( new FileInputStream( new File("input.txt") ) ) ;
        // System.setOut( new PrintStream( new File("output.txt") ) ) ;

        Scanner in = new Scanner(System.in);

        int watermelon = in.nextInt();

        if (watermelon % 2 == 0 && watermelon > 2) {
            System.out.println("YES");
        } else {
            System.out.println("NO");
        }

    }

}