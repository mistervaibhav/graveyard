using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class CarDriver : MonoBehaviour {

    private const string HORIZONTAL = "Horizontal";
    private const string VERTICAL = "Vertical";

    [SerializeField] float steerSpeed = 100;
    [SerializeField] float moveSpeed = 50;

    // Start is called before the first frame update
    void Start() {

    }

    // Update is called once per frame
    void Update() {

        float moveAmount = Input.GetAxis(VERTICAL) * moveSpeed * Time.deltaTime;
        float steerAmount = Input.GetAxis(HORIZONTAL) * steerSpeed * Time.deltaTime;

        if (moveAmount >= 0) {
            steerAmount = -steerAmount;
        }

        transform.Rotate(0, 0, steerAmount);
        transform.Translate(0, moveAmount, 0);
    }
}
