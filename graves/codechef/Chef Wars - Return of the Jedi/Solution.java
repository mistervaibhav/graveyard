import java.util.*;

import java.io.*;

class Solution {

  public static void main(String args[]) throws IOException {

    Scanner in = new Scanner(System.in);

    int t = in.nextInt();

    while (t-- != 0) {

      int health = in.nextInt();
      int power = in.nextInt();

      while (true) {

        health = health - power;
        power = power / 2;

        if (health <= 0) {
          System.out.println(1);
          break;
        } else if (power == 0 && health > 0) {
          System.out.println(0);
          break;
        }
      }

    }

    in.close();
  }

}