
import java.util.*;
import java.lang.*;
import java.io.*;

class Solution {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int n = in.nextInt();
        int q = in.nextInt();

        // int mat[][] = new int[n][n];
        int row[] = new int[n];
        int col[] = new int[n];

        int maxrow = 0;
        int maxcol = 0;

        while (q-- > 0) {

            String query = in.next();
            int pos = in.nextInt();
            int num = in.nextInt();

            if (query.equals("RowAdd")) {

                row[pos - 1] += num;

            } else if (query.equals("ColAdd")) {

                col[pos - 1] += num;

            }

            // ! USING A MATRIX GIVES TLE WTF
            // if (query.equals("RowAdd")) {

            // for (int i = 0; i < n; i++) {
            // mat[pos - 1][i] += num;
            // max = Math.max(max, mat[pos - 1][i]);
            // }

            // } else if (query.equals("ColAdd")) {

            // for (int i = 0; i < n; i++) {
            // mat[i][pos - 1] += num;
            // max = Math.max(max, mat[i][pos - 1]);
            // }

            // }

            // for (int i = 0; i < mat.length; i++) {
            // for (int j = 0; j < mat.length; j++) {
            // System.out.print(mat[i][j] + " ");
            // }
            // System.out.println();
            // }
            // System.out.println("----------");

        }

        for (int i = 0; i < n; i++) {

            if (row[i] > maxrow) {
                maxrow = row[i];
            }

            if (col[i] > maxcol) {
                maxcol = col[i];
            }

        }

        System.out.println(maxrow + maxcol);

        in.close();
    }

}