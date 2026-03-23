import java.util.*;
import java.io.*;

public class TwoAndSix {

  public static void main(String args[]) throws IOException {

    Scanner in = new Scanner(System.in);

    int t = in.nextInt();

    while (t-- != 0) {

      int num = in.nextInt();

      int twos = 0;
      int threes = 0;

      while (num % 2 == 0) {
        num /= 2;
        twos++;
      }

      while (num % 3 == 0) {
        num /= 3;
        threes++;
      }

      if (num == 1 && twos <= threes) {
        System.out.println(2 * threes - twos);
      } else {
        System.out.println(-1);
      }

    }

    in.close();
  }

}