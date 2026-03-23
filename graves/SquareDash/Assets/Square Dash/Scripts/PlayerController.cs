using System;
using UnityEngine;


[RequireComponent(typeof(Rigidbody2D))]
public class PlayerController : MonoBehaviour {

    [Header(" Components ")]
    private Rigidbody2D rigidBody;


    [Header(" Movement ")]
    [SerializeField] private float moveSpeed = 2f;
    [SerializeField] private float jumpSpeed = 5f;


    private bool isJumping = false;

    // Life Cycle Methods

    private void Awake() {
        rigidBody = GetComponent<Rigidbody2D>();
    }



    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start() {

    }


    // Update is called once per frame
    void Update() {

        if (Input.GetMouseButtonDown(0)) {
            Jump();
        }

    }


    private void FixedUpdate() {

        Vector2 velocity = rigidBody.linearVelocity;
        velocity.x = moveSpeed;

        if (isJumping) {
            velocity.y = jumpSpeed;
            isJumping = false;
        }

        rigidBody.linearVelocity = velocity;
    }


    // Custom Methods

    private void Jump() {
        isJumping = true;
    }


}
