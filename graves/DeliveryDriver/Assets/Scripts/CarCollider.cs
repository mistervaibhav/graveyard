using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CarCollider : MonoBehaviour {



    void OnCollisionEnter2D(Collision2D other) {

        Debug.Log("Hit Something");

        // if (other.gameObject.CompareTag("obstacle")) {
        //     Debug.Log("Hit Obstacle");
        // }
    }

    void OnTriggerEnter2D(Collider2D other) {
        Debug.Log("Triggered");


    }

}
