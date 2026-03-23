
/***********************************************************************************************************
 * Produced by App Advisory - http://app-advisory.com													   *
 * Facebook: https://facebook.com/appadvisory															   *
 * Contact us: https://appadvisory.zendesk.com/hc/en-us/requests/new									   *
 * App Advisory Unity Asset Store catalog: http://u3d.as/9cs											   *
 * Developed by Gilbert Anthony Barouch - https://www.linkedin.com/in/ganbarouch                           *
 ***********************************************************************************************************/




using UnityEngine;
using System.Collections;
using System;

namespace AppAdvisory.TwistTheBall
{
	/// <summary>
	/// A class in charge to jump the player and to check is the player is in a plateform or not after each jump, and if not to triggered the game over animation
	/// 
	/// This script is attached to the GameObject "Player" ((child of the GameObject "PlayerParent")
	/// </summary>
	public class Player : MonoBehaviorHelper 
	{

		/// <summary>
		/// Speed rotation when the player jump. Change it if you want to increase or descrease this speed
		/// </summary>
		public float speedRotate = 50f;
		/// <summary>
		/// Speed jump when the player jump. Change it if you want to increase or descrease this speed
		/// </summary>
		public float speedJump = 50f;
		/// <summary>
		/// Current rotation in degre of the player parent
		/// </summary>
		float currentDegree = 0;
		/// <summary>
		/// Position from where we will do the raycast to check if the player is grounded or not
		/// </summary>
		public Transform groundCheck;
		/// <summary>
		/// True if the player is jumpig
		/// </summary>
		private bool isJumping;
		/// <summary>
		/// True if the player losde
		/// </summary>
		private bool isGameOver;
		/// <summary>
		/// True if the player start the move
		/// </summary>
		private bool isStarted;

		public Vector3 originalPosition = new Vector3 (0, -3, 4.371f);

		public Transform transformParent;

		public Transform sphere;

		public Transform lastGoodCube;

		public GameObject shadow;

		public MeshRenderer sphereRenderer;

		void Awake()
		{
			groundCheck = transform.Find ("GroundCheck");
			currentDegree = 0;
			isJumping = false;
			isGameOver = false;
			isStarted = false;
		}

		void OnEnable()
		{
			InputTouch.OnTouchLeft += MoveLeft;
			InputTouch.OnTouchRight += MoveRight;
			GameManager.OnGameStarted += OnGameStarted;
			GameManager.OnGameEnded += OnGameEnded;
		}

		void OnDisable()
		{
			InputTouch.OnTouchLeft -= MoveLeft;
			InputTouch.OnTouchRight -= MoveRight;
			GameManager.OnGameStarted -= OnGameStarted;
			GameManager.OnGameEnded -= OnGameEnded;
		}

		void OnGameStarted()
		{
			isStarted = true;
		}

		public void OnGameEnded()
		{
			isJumping = false;

			isGameOver = true;

			StopAllCoroutines ();
		}

		public void RestartPlayerFromContinue()
		{
			isJumping = false;
			isGameOver = false;
			isStarted = false;

			transform.localPosition = originalPosition;

			var pos = transformParent.position;
			pos.z = lastGoodCube.position.z - 4.69f -0.3f;

			transformParent.position = pos;

			transformParent.rotation = lastGoodCube.rotation;

			transform.localPosition = Vector3.zero;
			transform.localRotation = Quaternion.identity;

			sphere.localPosition = new Vector3 (0, - 0.24f, 0);
		}

		float scrollSpeed = 1.5F;

		void DoDextureOffset()
		{
			if (isGameOver)
				return;

			float offset = Time.time * scrollSpeed;
			sphereRenderer.material.SetTextureOffset("_MainTex", -new Vector2(offset, 0));
		}

		void Update()
		{
			transform.localPosition = originalPosition;

			if (!isStarted)
			{
				return;
			}

			DoDextureOffset ();

			if (!isGrounded () &&  !isJumping && !isGameOver) 
			{

				soundManager.PlaySoundFail();

				isGameOver = true;

				StartCoroutine(DoAnimGamOver());

				return;
			}

		}

		/// <summary>
		/// Return true if the player can jump
		/// </summary>
		bool PlayerCanJump()
		{
			if (!isStarted)
			{
				return false;
			}

			if (!isGrounded () &&  !isJumping && !isGameOver) 
			{
				return false;
			}

			if (isJumping || isGameOver)
			{
				return false;
			}

			return true;
		}

		/// <summary>
		/// Move the player on the left
		/// </summary>
		void MoveLeft()
		{
			if(PlayerCanJump())
				DoMove (-1);
		}
		/// <summary>
		/// Move the player on the right
		/// </summary>
		void MoveRight()
		{
			if(PlayerCanJump())
				DoMove (+1);
		}
		/// <summary>
		/// Do the move. Adding degree to the player smoothly using the coroutine DoJump
		/// </summary>
		void DoMove(int sign)
		{
			soundManager.PlaySoundJump();

			isJumping = true;

			currentDegree += sign*45f;

			StartCoroutine(RotateTo (sign));
			StartCoroutine(DoJump ());
		}

		float animTime = 0.2f;
		/// <summary>
		/// Do the jump of the player parent smoothly
		/// </summary>
		IEnumerator DoJump()
		{
			isJumping = true;

			shadow.SetActive (false);

			float startPosY = -0.24f;

			float finalPosY = -0.24f + 1f;

			float timer = 0;

			float timeJump = animTime / 2f;

			while (timer <= timeJump)
			{
				timer += Time.deltaTime;
				float yPosTemp = 0;

				yPosTemp = Mathf.Lerp (startPosY, finalPosY, timer / timeJump);

				var s = sphere.localPosition;
				s.y = yPosTemp;
				sphere.localPosition = s;

				yield return null;
			}
			timer = 0;
			while (timer <= timeJump)
			{
				timer += Time.deltaTime;
				float yPosTemp = 0;

				yPosTemp = Mathf.Lerp (finalPosY, startPosY, timer / timeJump);

				var s = sphere.localPosition;
				s.y = yPosTemp;
				sphere.localPosition = s;

				yield return null;
			}
		}
		/// <summary>
		/// Do the move. Adding degree to the player smoothly
		/// </summary>
		IEnumerator RotateTo(float direction)
		{
			isJumping = true;

			shadow.SetActive (false);

			float originalRotation = transformParent.eulerAngles.z;

			float finalRotation = originalRotation + direction * 45f;

			float timer = 0;

			while (timer <= animTime)
			{
				timer += Time.deltaTime;
				float rotTemp = Mathf.Lerp (originalRotation, finalRotation, timer / animTime);
				transformParent.eulerAngles = Vector3.forward * rotTemp;
				yield return null;
			}


			if (isGrounded (true)) 
			{
				canvasManager.Add1Point ();
			}

			isJumping = false;

			yield return 0;

			shadow.SetActive (true);
		}
		/// <summary>
		/// Do the move for game over : the payer falls
		/// </summary>
		IEnumerator DoAnimGamOver()
		{
			isJumping = false;

			isGameOver = true;

			float startPosY = -0.24f;

			float finalPosY = -0.24f - 5;

			float timer = 0;

			float timeJump = animTime;

			while (timer <= timeJump)
			{
				timer += Time.deltaTime;
				float yPosTemp = 0;

				yPosTemp = Mathf.Lerp (startPosY, finalPosY, timer / timeJump);

				var s = sphere.localPosition;
				s.y = yPosTemp;
				sphere.localPosition = s;

				yield return null;
			}

			gameManager.OnGameEnd();
		}

		RaycastHit hit;
		/// <summary>
		/// Check if player is grounded
		/// </summary>
		bool isGrounded()
		{
			return isGrounded (true);
		}
		/// <summary>
		/// Check if player is grounded and save the position
		/// </summary>
		bool isGrounded(bool savePos)
		{
			if (isJumping && !savePos)
				return true;

			Vector3 down = transform.TransformDirection(Vector3.down);

			if (Physics.Raycast(groundCheck.position, down, out hit, 10))
			{
				if (savePos)
				{
					if (!isJumping) 
					{
						var t = hit.transform;

						var tt = t.GetComponentInParent<AnimationCube> ();

						if(tt != null)
							lastGoodCube = tt.cube;
					}
				}
				return true;
			}

			return false;
		}
	}
}