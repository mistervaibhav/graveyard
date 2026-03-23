import java.util.*;
import java.io.*;

public class Elephant {

  public static void main(String args[]) throws IOException {

    Scanner in = new Scanner(System.in);

    int distance = in.nextInt();

    System.out.println((distance + 4) / 5);

    in.close();
  }

}