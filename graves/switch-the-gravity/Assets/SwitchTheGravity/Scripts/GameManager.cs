
/***********************************************************************************************************
 * Produced by App Advisory - http://app-advisory.com													   *
 * Facebook: https://facebook.com/appadvisory															   *
 * Contact us: https://appadvisory.zendesk.com/hc/en-us/requests/new									   *
 * App Advisory Unity Asset Store catalog: http://u3d.as/9cs											   *
 * Developed by Gilbert Anthony Barouch - https://www.linkedin.com/in/ganbarouch                           *
 ***********************************************************************************************************/







using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

#if AADOTWEEN
using DG.Tweening;
#endif

using System.Linq;
#if APPADVISORY_LEADERBOARD
using AppAdvisory.social;
#endif
#if APPADVISORY_ADS
using AppAdvisory.Ads;
#endif
#if VS_SHARE
using AppAdvisory.SharingSystem;
#endif

namespace AppAdvisory.SwitchTheGravity
{
	/// <summary>
	/// Attached to the button rate 
	/// </summary>
	public class GameManager : MonoBehaviour 
	{
		/// <summary>
		/// If using Very Simple Ads by App Advisory, show an interstitial if number of play > numberOfPlayToShowInterstitial: http://u3d.as/oWD
		/// </summary>
		public int numberOfPlayToShowInterstitial = 5;
		/// <summary>
		/// If using Very Simple Ads by App Advisory, show an interstitial if number of play > numberOfPlayToShowInterstitial: http://u3d.as/oWD
		/// </summary>
		public string VerySimpleAdsURL = "http://u3d.as/oWD";
		/// <summary>
		/// The list of spawned Platform (useful to recycle them).
		/// </summary>
		public List<Platform> platforms = new List<Platform>();
		/// <summary>
		/// List of AAColor.
		/// </summary>
		public List<AAColor> colors = new List<AAColor>();
		/// <summary>
		/// If you want to show the AAColor for the platforms in the order you enter them in the editor, set it to false. If true, it's randomize;
		/// </summary>
		public bool randomizeColors = true;
		/// <summary>
		/// Each X points we will change the AAColor for the platforms.
		/// </summary>
		public int changeColorEachXPoints = 5;
		/// <summary>
		/// Get the current AAColor for the platforms.
		/// </summary>
		AAColor GetColor()
		{
			int i = point / changeColorEachXPoints;
			while(i > colors.Count)
			{
				i -= colors.Count;
			}

			return colors[i];
		}
		/// <summary>
		/// Shuffle the color array if randomizeColors == true.
		/// </summary>
		void Awake ()
		{
			if(randomizeColors)
			{
				colors.Shuffle();
			}
		}
		/// <summary>
		/// Get the current AAColor for the platforms.
		/// </summary>
		public bool GameIsStarted()
		{
			return gameStarted;
		}
		/// <summary>
		/// True if game is started.
		/// </summary>
		bool gameStarted = false;
		/// <summary>
		/// Reference to the platform prefab we will spawn during the game.
		/// </summary>
		public GameObject platformPrefab;
		/// <summary>
		/// Save the last platform created.
		/// </summary>
		Platform lastPlatform;
		/// <summary>
		/// Reference to the player.
		/// </summary>
		public Player player;
		/// <summary>
		/// Reference to the camera who follow the player.
		/// </summary>
		public CameraFollowPlayer cameraFollowPlayer;
		/// <summary>
		/// Reference to the audioclip for the music. Change it if you want to add your own music.
		/// </summary>
		public AudioClip music;
		/// <summary>
		/// Reference to the audioclip for explision FX at game over. Change it if you want to add your own music.
		/// </summary>
		public AudioClip ExplosionGameOver;
		/// <summary>
		/// If false, the gravity is normal (like on earth). If true, the inverse. Each time the player tap or click, we switch the gravity.
		/// </summary>
		[NonSerialized] public bool gravityUp = false;
		/// <summary>
		/// A counter of spawned platform.
		/// </summary>
		int count = 0;
		/// <summary>
		/// The audiosource to play explosion and music.
		/// </summary>
		AudioSource audioSource;
		/// <summary>
		/// Current point for the player.
		/// </summary>
		int point = 0;
		/// <summary>
		/// Add 1 point every timeToAddPoint seconds.
		/// </summary>
		public float timeToAddPoint = 1f;
		/// <summary>
		/// Add 1 point.
		/// </summary>
		public void Add1Point()
		{
			point++;
			AppAdvisory.UI.UIController.SetScore(point);
		}
			
		/// <summary>
		/// Start the game with some initialization.
		/// </summary>
		void Start()
		{
			FindObjectOfType<AppAdvisory.UI.UIController>().OnUIAnimOutStart.RemoveListener(OnClickedStart);
			FindObjectOfType<AppAdvisory.UI.UIController>().OnUIAnimOutStart.AddListener(OnClickedStart);

			AppAdvisory.UI.UIController.SetScore(0);

			AppAdvisory.UI.UIController.SetUIBestScore(Util.GetBestScore());
			AppAdvisory.UI.UIController.SetUILastScore(Util.GetLastScore());

			Camera cam = Camera.main;

			cam.orthographicSize = Constants.screenWidth / (2f * cam.aspect);


			transform.position = Vector3.zero;

			Util.CleanMemory();

			var musicGO = GameObject.Find("MUSIC");

			if(musicGO == null)
			{
				musicGO = new GameObject();
				musicGO.name = "MUSIC";
				audioSource = musicGO.AddComponent<AudioSource>();
				audioSource.clip = music;
				audioSource.loop = true;
				audioSource.Play();
				DontDestroyOnLoad(musicGO);
			}
			else
			{
				audioSource = GameObject.Find("MUSIC").GetComponent<AudioSource>();
			}

//			#if VS_SHARE
//			#else
//			FindObjectOfType<AppAdvisory.UI.UIController>().anim();
//			#endif
		}

		public void OnUIAnimOutStarted()
		{
			#if VS_SHARE
			VSSHARE.DOHideScreenshotIcon();
			#else
			FindObjectOfType<AppAdvisory.UI.UIController>().HideVerySimpleShare();
			#endif
		}
		/// <summary>
		/// Call by the AppAdvisory.UI.UIController when the animation start is finished. We turn the bool gameStarted to true and we will call the coroutine SpawnPlatformStart to spawn the first platforms smoothly.
		/// </summary>
		public void OnClickedStart()
		{
			gameStarted = false;

			#if VS_SHARE
			VSSHARE.DOHideScreenshotIcon();
			#endif

			StartCoroutine(SpawnPlatformStart());
		}
		/// <summary>
		/// Spawn the first platforms with a corsoutine to do it smoothly.
		/// </summary>
		IEnumerator SpawnPlatformStart()
		{
			for(int i = 0; i < Constants.numberOfPlatform; i++)
			{
				var p = SpawnPlatform(i, false);
				yield return 0;
			}
		}
		/// <summary>
		/// When the first platforms are spawned, the last platform spawned will call this method to start the player move and start the game for the player.
		/// </summary>
		public void StartTheGame()
		{
			if(gameStarted)
				return;


			gameStarted = true;

			foreach(var p in FindObjectsOfType<Platform>())
			{
				p.StartCorout();
			}

			player.DOStart(() => {
				cameraFollowPlayer.DOStart();
			});

			InvokeRepeating("Add1Point", timeToAddPoint, timeToAddPoint);
		}
		/// <summary>
		/// Listen the inputs.
		/// </summary>
		void Update()
		{
			if(Input.GetMouseButtonDown(0))
			{
				gravityUp = !gravityUp;
				player.ResetPitch();
			}
		}
		/// <summary>
		/// Called when the game is over = collision. We will release some resources, animate out the present platforms, save the score, and restart the scene.
		/// </summary>
		public void GameOver()
		{
			#if VS_SHARE
			VSSHARE.DOTakeScreenShot();
			#endif

			ShowAds();
			ReportScoreToLeaderboard(point);

			var allPlatforms = FindObjectsOfType<Platform>();

			allPlatforms = platforms.OrderBy(platform => -platform.transform.position.x).ToArray();


			#if AADOTWEEN
			DOTween.KillAll();
			#endif

			Util.SetLastScore(point);

			audioSource.PlayOneShot(ExplosionGameOver);

			CancelInvoke();

			int numMax = 0;

			for(int i = 0; i < allPlatforms.Length; i++)
			{
				if(allPlatforms[i].num > numMax)
				{
					numMax = allPlatforms[i].num;
				}
			}

			AppAdvisory.UI.UIController.DOAnimOutScore();

			for(int i = 0; i < allPlatforms.Length; i++)
			{
				allPlatforms[i].AnimOut((allPlatforms.Length - i) * 0.02f, (int numP) => {
					if(numP == numMax)
					{
						CanvasBlur.DOAnimGameOver();

						#if AADOTWEEN
						DOVirtual.DelayedCall(0.5f, () => {
							Util.ReloadLevel();
						});
						#endif

					}
				});
			}
		}
		/// <summary>
		/// Spawn new Platform.
		/// </summary>
		public void SpawnPlatform()
		{
			SpawnPlatform(count, true);
		}
		/// <summary>
		/// Spawn new Platform. If a inactivate Platform is available (if a Platform with gameObject.activeInHierarchy == false), we will recycle it. If not, we will instantiate a new one (for memory optimization, Instantiate / Destroy cost a lot of CPU).
		/// </summary>
		Platform SpawnPlatform(int i, bool withCorout)
		{
			AAColor aaC = GetColor();

			Color c = aaC.colorA;

			if(i % 2 == 0)
				c = aaC.colorB;

			var pos = GetRandomPosition(i);

			Platform goP = null;

			if(platforms != null && platforms.Count > 0)
				goP = platforms.Find(p => p.gameObject.activeInHierarchy == false);

			if(goP == null)
			{
				var go = Instantiate(platformPrefab) as GameObject;

				go.transform.parent = transform;

				lastPlatform = go.GetComponent<Platform>();

				platforms.Add(lastPlatform);
			}
			else
			{
				lastPlatform = goP;
			}

			lastPlatform.gameObject.SetActive(true);

			if(withCorout)
				lastPlatform.Init(i - 15, c, pos);
			else
				lastPlatform.InitWithoutCorout(i - 15, c, pos);

			count++;

			return lastPlatform;
		}
		/// <summary>
		/// Get random position.
		/// </summary>
		public PlatformPositions GetRandomPosition(int num)
		{
			if(lastPlatform == null || num < 50)
			{
				return new PlatformPositions(0,0);
			}

			return new PlatformPositions(lastPlatform.platformPosition);
		}
		/// <summary>
		/// If using Very Simple Leaderboard by App Advisory, report the score : http://u3d.as/qxf
		/// </summary>
		void ReportScoreToLeaderboard(int p)
		{
			#if APPADVISORY_LEADERBOARD
			LeaderboardManager.ReportScore(p);
			#else
			print("Get very simple leaderboard to use it : http://u3d.as/qxf");
			#endif
		}

		/// <summary>
		/// If using Very Simple Ads by App Advisory, show an interstitial if number of play > numberOfPlayToShowInterstitial: http://u3d.as/oWD
		/// </summary>
		public void ShowAds()
		{
			int count = PlayerPrefs.GetInt("GAMEOVER_COUNT",0);
			count++;
			PlayerPrefs.SetInt("GAMEOVER_COUNT",count);
			PlayerPrefs.Save();

			#if APPADVISORY_ADS
			if(count > numberOfPlayToShowInterstitial)
			{
			#if UNITY_EDITOR
				print("count = " + count + " > numberOfPlayToShowINterstitial = " + numberOfPlayToShowInterstitial);
			#endif
				if(AdsManager.instance.IsReadyInterstitial())
				{
			#if UNITY_EDITOR
					print("AdsManager.instance.IsReadyInterstitial() == true ----> SO ====> set count = 0 AND show interstial");
			#endif
					PlayerPrefs.SetInt("GAMEOVER_COUNT",0);
					AdsManager.instance.ShowInterstitial();
				}
				else
				{
			#if UNITY_EDITOR
					print("AdsManager.instance.IsReadyInterstitial() == false");
			#endif
				}

			}
			else
			{
				PlayerPrefs.SetInt("GAMEOVER_COUNT", count);
			}
			PlayerPrefs.Save();
			#else
			if(count >= numberOfPlayToShowInterstitial)
			{
			Debug.LogWarning("To show ads, please have a look to Very Simple Ad on the Asset Store, or go to this link: " + VerySimpleAdsURL);
			Debug.LogWarning("Very Simple Ad is already implemented in this asset");
			Debug.LogWarning("Just import the package and you are ready to use it and monetize your game!");
			Debug.LogWarning("Very Simple Ad : " + VerySimpleAdsURL);
			PlayerPrefs.SetInt("GAMEOVER_COUNT",0);
			}
			else
			{
			PlayerPrefs.SetInt("GAMEOVER_COUNT", count);
			}
			PlayerPrefs.Save();
			#endif
		}
	}
}
