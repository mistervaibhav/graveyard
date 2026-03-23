
import java.util.*;
import java.io.*;

class Solution {

    public static void main(String args[]) throws IOException {

        Scanner in = new Scanner(System.in);

        int t = in.nextInt();

        while (t-- != 0) {

            int n = in.nextInt();

            int songs[] = new int[n];

            for (int i = 0; i < n; i++) {
                songs[i] = in.nextInt();
            }

            int k = in.nextInt();

            int uncleJohny = songs[k - 1];

            Arrays.sort(songs);

            int res = search(songs, n, uncleJohny) + 1;

            System.out.println(res);

        }

    }

    // * BINARY SEARCH
    static int search(int arr[], int n, int x) {

        int low = 0;
        int high = n - 1;

        while (low <= high) {

            int mid = (low + high) / 2;

            if (x > arr[mid]) {
                low = mid + 1;
            } else if (x < arr[mid]) {
                high = mid - 1;
            } else if (x == arr[mid]) {
                return mid;
            }

        }

        return -1;
    }

}