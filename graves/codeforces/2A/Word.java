import java.util.*;
import java.lang.*;
import java.io.*;

public class Word {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        String word = in.nextLine();

        int capCount = 0;
        int smallCount = 0;

        for (int i = 0; i < word.length(); i++) {

            if (word.charAt(i) >= 'a') {
                smallCount++;
            } else {
                capCount++;
            }

        }

        if (smallCount > capCount || smallCount == capCount) {
            System.out.println(word.toLowerCase());
        } else {
            System.out.println(word.toUpperCase());
        }

        in.close();
    }

}