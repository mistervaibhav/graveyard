
import java.util.*;

import java.io.*;

class Solution {
    public static void main(String[] args) throws java.lang.Exception {
        Scanner s = new Scanner(System.in);
        long tc = s.nextLong();
        while (tc-- > 0) {
            long n = s.nextLong();
            long a = 0, b = 0;
            for (long j = 0; j < n; j++) {
                long x = s.nextLong();
                if (x != 0 && x != 1)
                    a++;
                if (x == 2)
                    b++;
            }
            System.out.println((a * (a - 1) / 2) - (b * (b - 1) / 2));
        }

    }
}
