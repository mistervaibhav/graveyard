
import java.util.*;
import java.io.*;

public class Football {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        String players = in.nextLine();

        if (players.contains("0000000") || players.contains("1111111")) {
            System.out.println("YES");
        } else {
            System.out.println("NO");
        }

        // int teamZero = 0;
        // int teamOne = 0;
        // for (int i = 0; i < players.length(); i++) {
        // if (players.charAt(i) == '0') {
        // if (teamOne == 7 || teamZero == 7) {
        // System.out.println("YES");
        // return;
        // }
        // teamOne = 0;
        // teamZero++;
        // } else if (players.charAt(i) == '1') {
        // if (teamOne == 7 || teamZero == 7) {
        // System.out.println("YES");
        // return;
        // }
        // teamZero = 0;
        // teamOne++;
        // }
        // }
        // System.out.println("NO");

        in.close();
    }

}