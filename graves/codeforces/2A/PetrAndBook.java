
import java.util.*;
import java.io.*;

public class PetrAndBook {

  public static void main(String args[]) throws IOException {

    Scanner in = new Scanner(System.in);

    int pages = in.nextInt();

    int days[] = new int[8];

    for (int i = 1; i <= 7; i++) {
      days[i] = in.nextInt();
      days[i] += days[i - 1];
    }

    pages = (pages - 1) % days[7] + 1;

    for (int i = 1; i <= 7; i++) {
      if (days[i] >= pages) {
        System.out.println(i);
        break;
      }
    }
  }

}