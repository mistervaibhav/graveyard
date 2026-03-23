
/***********************************************************************************************************
 * Produced by App Advisory - http://app-advisory.com													   *
 * Facebook: https://facebook.com/appadvisory															   *
 * Contact us: https://appadvisory.zendesk.com/hc/en-us/requests/new									   *
 * App Advisory Unity Asset Store catalog: http://u3d.as/9cs											   *
 * Developed by Gilbert Anthony Barouch - https://www.linkedin.com/in/ganbarouch                           *
 ***********************************************************************************************************/




using UnityEngine;
using System.Collections;
using UnityEngine.EventSystems;

namespace AppAdvisory.TwistTheBall
{
	/// <summary>
	/// Class in charge to handle input in the game
	/// </summary>
	public class InputTouch : MonoBehaviour
	{
		public delegate void TouchLeft();
		/// <summary>
		/// Event trigger when touching the screen on the left part
		/// </summary>
		public static event TouchLeft OnTouchLeft;

		public delegate void TouchRight();
		/// <summary>
		/// Event trigger when touching the screen on the right part
		/// </summary>
		public static event TouchRight OnTouchRight;

		public delegate void TouchScreen();
		/// <summary>
		/// Event trigger when touching the screen
		/// </summary>
		public static event TouchScreen OnTouchScreen;


		public bool BLOCK_INPUT = false;

		#if UNITY_TVOS
		private Vector2 startPosition;

		void Awake()
		{
		OnGameStart();
		}

		bool gameStarted = true;

		void OnGameStart()
		{
		UnityEngine.Apple.TV.Remote.touchesEnabled = true;
		UnityEngine.Apple.TV.Remote.allowExitToHome = false;

		gameStarted = true;

		FindObjectOfType<StandaloneInputModule>().forceModuleActive = false;
		}

		public void OnGameOver()
		{
		print("do game over");
		UnityEngine.Apple.TV.Remote.touchesEnabled = false;
		UnityEngine.Apple.TV.Remote.allowExitToHome = true;

		FindObjectOfType<StandaloneInputModule>().forceModuleActive = true;

		var es = FindObjectOfType<EventSystem>();

		es.firstSelectedGameObject = es.currentSelectedGameObject;

		es.SetSelectedGameObject(es.currentSelectedGameObject);


		gameStarted = false;
		}

		void Start()
		{
		UnityEngine.Apple.TV.Remote.reportAbsoluteDpadValues = true;
		}


		#endif

		void Awake()
		{
			BLOCK_INPUT = false;
		}

		void OnEnable()
		{
			GameManager.OnGameStarted += OnGameStarted;
			GameManager.OnGameEnded += OnGameEnded;
		}

		void OnDisable()
		{
			GameManager.OnGameStarted -= OnGameStarted;
			GameManager.OnGameEnded -= OnGameEnded;
		}

		void OnGameStarted()
		{
			BLOCK_INPUT = false;
		}

		void OnGameEnded()
		{
			BLOCK_INPUT = true;
		}

		void Update () 
		{

			if(	BLOCK_INPUT )
				return;

			#if UNITY_TVOS && !UNITY_EDITOR

			if(!gameStarted)
			{
			return;
			}

			float h = Input.GetAxis("Horizontal");

			if(h < 0)
			{
			_OnTouchLeft();
			}
			else if(h > 0)
			{
			_OnTouchRight();
			}



			#endif

			#if (UNITY_ANDROID || UNITY_IOS || UNITY_TVOS) && !UNITY_EDITOR
			int nbTouches = Input.touchCount;

			if(nbTouches > 0)
			{

			Touch touch = Input.GetTouch(0);

			TouchPhase phase = touch.phase;

			if (phase == TouchPhase.Began)
			{
			print("on touch");


			if (touch.position.x < Screen.width / 2f)
			{
			_OnTouchLeft();
			}
			else
			{
			_OnTouchRight();
			}


			}



			}

			#endif

			#if (!UNITY_ANDROID && !UNITY_IOS && !UNITY_TVOS) || UNITY_EDITOR
			//		}
			//		else
			//		{

			if (Input.GetKeyDown (KeyCode.LeftArrow))
			{
				_OnTouchLeft();
			}
			if (Input.GetKeyDown (KeyCode.RightArrow))
			{
				_OnTouchRight();
			}
			//		}
			#endif
		}

		void _OnTouchLeft()
		{
			if(OnTouchScreen != null)
				OnTouchScreen();

			if(OnTouchLeft != null)
				OnTouchLeft();
		}

		void _OnTouchRight()
		{
			if(OnTouchScreen != null)
				OnTouchScreen();

			if(OnTouchRight != null)
				OnTouchRight();
		}
	}
}