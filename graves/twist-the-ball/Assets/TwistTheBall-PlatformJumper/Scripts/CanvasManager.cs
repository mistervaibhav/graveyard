
/***********************************************************************************************************
 * Produced by App Advisory - http://app-advisory.com													   *
 * Facebook: https://facebook.com/appadvisory															   *
 * Contact us: https://appadvisory.zendesk.com/hc/en-us/requests/new									   *
 * App Advisory Unity Asset Store catalog: http://u3d.as/9cs											   *
 * Developed by Gilbert Anthony Barouch - https://www.linkedin.com/in/ganbarouch                           *
 ***********************************************************************************************************/




using UnityEngine;
using UnityEngine.UI;
#if !UNITY_5_0 && !UNITY_5_1 && !UNITY_5_2 
using UnityEngine.SceneManagement;
#endif
using System.Collections;

#if APPADVISORY_ADS
using AppAdvisory.Ads;
#endif

namespace AppAdvisory.TwistTheBall
{
	/// <summary>
	/// Class in charged to display UI elements
	/// This script is attached to the GameObject "Canvas"
	/// 
	/// The two main methods are : 
	/// 
	/// The Start() methods to display the start menu
	/// 
	/// The ShowMenuGameOver() method to display the game over menu.
	/// 
	/// </summary>
	public class CanvasManager : MonoBehaviorHelper 
	{

		/// <summary>
		/// Current player score
		/// </summary>
		[SerializeField] private int m_point;
		/// <summary>
		/// Text to display the current player score
		/// </summary>
		[SerializeField] private Text score;
		/// <summary>
		/// Text to display the last score at game over
		/// </summary>
		[SerializeField] private Text lastScoreGameOver;
		/// <summary>
		/// Text to display the best score at game over
		/// </summary>
		[SerializeField] private Text bestScoreGameOver;
		/// <summary>
		/// Text to show at start
		/// </summary>
		[SerializeField] private Text textStart;
		/// <summary>
		/// Button to restart the game
		/// </summary>
		[SerializeField] private Button buttonRestart;
		/// <summary>
		/// Button to get free life. Please  have a look to AdsManager and his documentation : _Ads_Integration_Documentation
		/// </summary>
		[SerializeField] private Button buttonFreeLife;
		/// <summary>
		/// Button to continue at the same position after player lose. Use 1 life
		/// </summary>
		[SerializeField] private Button buttonContinueYES;
		/// <summary>
		/// Button to NOT continue after player lose
		/// </summary>
		[SerializeField] private Button buttonContinueNO;
		/// <summary>
		/// Parent of all UI elements to display at game over
		/// </summary>
		[SerializeField] private GameObject scoreGameOverParent;
		/// <summary>
		/// CanvasGroup (usefull to fade a group of UI elements) of all UI elements to display at start
		/// </summary>
		[SerializeField] private CanvasGroup menuCanvasGroup;
		/// <summary>
		/// CanvasGroup (usefull to fade a group of UI elements) of all UI elements to display at continue (when the player lose : continue - yes or no)
		/// </summary>
		[SerializeField] private CanvasGroup continueCanvasGroup;
		/// <summary>
		/// Continue text
		/// </summary>
		[SerializeField] private Text continueText;


		void Awake()
		{
			m_point = 0;

			score.text = m_point.ToString ();

			if(menuCanvasGroup == null)
				menuCanvasGroup = transform.Find ("Menu").GetComponent<CanvasGroup>();

			if(score == null)
				score = transform.Find ("Score").GetComponent<Text>();

			if(buttonRestart == null)
				buttonRestart = transform.Find ("Menu").Find ("ButtonRestart").GetComponent<Button>();

			if (scoreGameOverParent == null)
				scoreGameOverParent = transform.Find ("Menu").Find ("scoreGameOverParent").gameObject;

			if(lastScoreGameOver == null)
				lastScoreGameOver = transform.Find ("ScoreGameOverParent").Find("LastScore").GetComponent<Text>();

			if(bestScoreGameOver == null)
				bestScoreGameOver = transform.Find ("ScoreGameOverParent").Find("BestScore").GetComponent<Text>();

			if(textStart == null)
				textStart = transform.Find ("Menu").Find ("TextStart").GetComponent<Text>();
		}
		/// <summary>
		/// Add listener
		/// </summary>
		void OnEnable()
		{
			InputTouch.OnTouchLeft += OnTouch;
			InputTouch.OnTouchRight += OnTouch;
			GameManager.OnGameEnded += OnGameEnded;
		}
		/// <summary>
		/// Remove listener
		/// </summary>
		void OnDisable()
		{
			InputTouch.OnTouchLeft -= OnTouch;
			InputTouch.OnTouchRight -= OnTouch;
			GameManager.OnGameEnded -= OnGameEnded;
		}
		/// <summary>
		/// React to touch event
		/// </summary>
		void OnTouch()
		{
			if (menuCanvasGroup.alpha != 1f)
				return;

			if (Input.anyKeyDown || Input.GetMouseButton(0)) 
			{
				score.gameObject.SetActive (true);
				StartCoroutine(DoFadeOut());
			}
		}
		/// <summary>
		/// React to game end event
		/// </summary>
		void OnGameEnded()
		{
			ShowMenuGameOver ();
			#if UNITY_TVOS
			FindObjectOfType<InputTouch>().OnGameOver();
			#endif
		}

		IEnumerator Start()
		{
			textStart.gameObject.SetActive (true);
			score.gameObject.SetActive (false);
			lastScoreGameOver.gameObject.SetActive (false);
			bestScoreGameOver.gameObject.SetActive (false);
			buttonRestart.gameObject.SetActive (false);
			buttonFreeLife.gameObject.SetActive (false);
			scoreGameOverParent.SetActive (false);
			continueCanvasGroup.gameObject.SetActive (false);

			float alpha = 0f;

			menuCanvasGroup.alpha = alpha;

			if(Application.isMobilePlatform)
				textStart.text = "Tap to begin";
			else
				textStart.text = "Tap any key to begin";


			yield return new WaitForSeconds (2);

			while (true)
			{
				alpha += 0.03f;

				menuCanvasGroup.alpha = alpha;

				if (alpha >= 1)
					break;

				yield return null;
			}

			menuCanvasGroup.alpha = 1f;

			buttonRestart.onClick.AddListener (() => {
				gameManager.ShowAds();
				gameManager.DOTakeScreenshotWithVerySimpleShare();

				buttonRestart.onClick.RemoveAllListeners();

				System.GC.Collect();
				Resources.UnloadUnusedAssets();

				#if UNITY_5_3
				SceneManager.LoadSceneAsync(0,LoadSceneMode.Single);
				#else
				Application.LoadLevelAsync (Application.loadedLevel);
				#endif
			});

			buttonFreeLife.onClick.AddListener (() => {

				player.OnGameEnded();
				#if APPADVISORY_ADS
				if(AdsManager.instance.IsReadyRewardedVideo())
				{
				AdsManager.instance.ShowRewardedVideo((bool success) => {

				print("rewarded video success ? " + success);

				if(success)
				{
				int l = gameManager.GetPlayerLife();
				l += 3;
				gameManager.SetPlayerLife(l);
				}

				ShowMenuGameOver ();

				player.OnGameEnded();
				});
				}
				#endif
			});
		}

		/// <summary>
		/// Fade out the menuCanvasGroup
		/// </summary>
		IEnumerator DoFadeOut()
		{
			float alpha = 1f;

			menuCanvasGroup.alpha = alpha;

			while (true)
			{
				alpha -= 0.03f;

				menuCanvasGroup.alpha = alpha;

				if (alpha <= 0)
					break;

				yield return null;
			}

			menuCanvasGroup.alpha = 0f;

			gameManager.OnGameStart();
		}

		/// <summary>
		/// Fade in the menuCanvasGroup
		/// </summary>
		IEnumerator DoFadeIn()
		{
			float alpha = 0f;

			menuCanvasGroup.alpha = alpha;

			while (true)
			{
				alpha += 0.03f;

				menuCanvasGroup.alpha = alpha;

				if (alpha >= 1)
					break;

				yield return null;
			}

			menuCanvasGroup.alpha = 1f;

			#if UNITY_TVOS
			FindObjectOfType<InputTouch>().OnGameOver();
			#endif

		}

		/// <summary>
		/// Fade in the continueCanvasGroup
		/// </summary>
		IEnumerator DoFadeInContinue()
		{
			float alpha = 0f;

			continueCanvasGroup.alpha = alpha;

			while (true)
			{
				alpha += 0.03f;

				continueCanvasGroup.alpha = alpha;

				if (alpha >= 1)
					break;

				yield return null;
			}

			continueCanvasGroup.alpha = 1f;
		}

		/// <summary>
		/// Fade out the continueCanvasGroup
		/// </summary>
		IEnumerator DoFadeOutContinue()
		{
			float alpha = 1f;

			continueCanvasGroup.alpha = alpha;

			while (true)
			{
				alpha -= 0.03f;

				continueCanvasGroup.alpha = alpha;

				if (alpha <= 0)
					break;

				yield return null;
			}

			continueCanvasGroup.alpha = 0f;
		}

		/// <summary>
		/// Method called when the player chose "YES" to continue
		/// </summary>
		void OnCLickedContinueYES()
		{
			buttonContinueYES.onClick.RemoveAllListeners ();
			buttonContinueNO.onClick.RemoveAllListeners ();

			StartCoroutine (DoFadeOutContinue ());

			textStart.gameObject.SetActive (true);
			score.gameObject.SetActive (false);
			lastScoreGameOver.gameObject.SetActive (false);
			bestScoreGameOver.gameObject.SetActive (false);
			buttonRestart.gameObject.SetActive (false);
			buttonFreeLife.gameObject.SetActive (false);
			scoreGameOverParent.SetActive (false);

			StartCoroutine (DoFadeIn ());

			gameManager.UseOneLife ();

			player.RestartPlayerFromContinue ();

			FindObjectOfType<InputTouch>().BLOCK_INPUT = false;
		}

		/// <summary>
		/// Method called when the player chose "NO" to continue
		/// </summary>
		void OnCLickedContinueNO()
		{
			buttonContinueYES.onClick.RemoveAllListeners ();
			buttonContinueNO.onClick.RemoveAllListeners ();

			StartCoroutine (DoFadeOutContinue ());

			textStart.gameObject.SetActive (true);
			score.gameObject.SetActive (false);
			lastScoreGameOver.gameObject.SetActive (false);
			bestScoreGameOver.gameObject.SetActive (false);
			buttonRestart.gameObject.SetActive (false);
			buttonFreeLife.gameObject.SetActive (false);
			scoreGameOverParent.SetActive (false);

			_ShowMenuGameOver ();
		}

		/// <summary>
		/// Method called when we need to show the menu Game Over (no life or say "NO" to continue). Will call the method _ShowMenuGameOver
		/// </summary>
		private void ShowMenuGameOver()
		{
			#if UNITY_IOS || UNITY_ANDROID || UNITY_EDITOR
			if (m_point > 2 && gameManager.GetPlayerLife () > 0) 
			{
				player.OnGameEnded();

				continueText.text = "YOU HAVE " + gameManager.GetPlayerLife ().ToString () + " LIFE" + " \n\nCONTINUE?";
				textStart.gameObject.SetActive (false);
				score.gameObject.SetActive (false);
				lastScoreGameOver.gameObject.SetActive (false);
				bestScoreGameOver.gameObject.SetActive (false);
				buttonRestart.gameObject.SetActive (false);
				buttonFreeLife.gameObject.SetActive (false);
				scoreGameOverParent.SetActive (false);

				continueCanvasGroup.gameObject.SetActive (true);

				StartCoroutine (DoFadeInContinue ());

				buttonContinueYES.onClick.RemoveAllListeners ();
				buttonContinueNO.onClick.RemoveAllListeners ();

				buttonContinueYES.onClick.AddListener (OnCLickedContinueYES);
				buttonContinueNO.onClick.AddListener (OnCLickedContinueNO);

				player.OnGameEnded();

				return;
			}
			#endif
			_ShowMenuGameOver ();
		}

		/// <summary>
		/// Method called after ShowMenuGameOver to display what we need at game over
		/// </summary>
		void _ShowMenuGameOver()
		{
			Score.SaveLastScore(m_point);
			int bestScore = Score.LoadBestScore();

			lastScoreGameOver.text = m_point.ToString ();

			bestScoreGameOver.text = bestScore.ToString ();

			continueCanvasGroup.gameObject.SetActive (false);
			textStart.gameObject.SetActive (false);
			score.gameObject.SetActive (false);
			lastScoreGameOver.gameObject.SetActive (true);
			bestScoreGameOver.gameObject.SetActive (true);
			buttonRestart.gameObject.SetActive (true);


			bool haveAds = false;

			#if APPADVISORY_ADS
			haveAds = AdsManager.instance.IsReadyRewardedVideo();
			#endif

			buttonFreeLife.gameObject.SetActive (haveAds);
			scoreGameOverParent.SetActive (true);

			#if UNITY_TVOS
			FindObjectOfType<InputTouch>().OnGameOver();
			#endif

			StartCoroutine (DoFadeIn ());
		}


		/// <summary>
		/// Each jump we add 1 point. We called this method for that
		/// </summary>
		public void Add1Point()
		{
			m_point++;
			score.text = m_point.ToString ();
		}
	}
}