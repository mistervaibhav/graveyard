
import java.util.*;
import java.lang.*;
import java.io.*;

public class Dubstep {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        String song = in.nextLine();
        String lyrics[] = song.split("WUB");

        String result = String.join(" ", lyrics);

        System.out.println(result);

        in.close();
    }

}