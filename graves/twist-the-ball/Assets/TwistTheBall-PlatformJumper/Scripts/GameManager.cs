
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
#if UNITY_5_3_OR_NEWER
using UnityEngine.SceneManagement;
#endif
#if APPADVISORY_ADS
using AppAdvisory.Ads;
#endif
#if VS_SHARE
using AppAdvisory.SharingSystem;
#endif
#if APPADVISORY_LEADERBOARD
using AppAdvisory.social;
#endif

namespace AppAdvisory.TwistTheBall
{
	/// <summary>
	/// Class in charge of the pooling system (to spawn obstacle prefabs), create new platform each time a platform is despawned and to change the platform colors
	/// 
	/// This script is attached to the GameObject "GameManager", and is in charge to spawn the platforms during the game, and to change the color of all the platforms
	/// 
	/// You can change the colors by changing the array "colors" in the inspector
	/// </summary>
	public class GameManager : MonoBehaviorHelper
	{
		public int numberOfPlayToShowInterstitial = 5;

		public string VerySimpleAdsURL = "http://u3d.as/oWD";

		public delegate void GameStart();
		public static event GameStart OnGameStarted;

		public delegate void GameEnd();
		public static event GameEnd OnGameEnded;

		/// <summary>
		/// Array of colors used to change the platform color
		/// </summary>
		[SerializeField] private Color[] colors;

		/// <summary>
		/// Material use by all platform. Usefull to change the color
		/// </summary>
		[SerializeField] private Material platformMaterial;

		/// <summary>
		/// The current platform color
		/// </summary>
		[SerializeField] private Color currentPlatformColor;

		/// <summary>
		/// The platform prefab
		/// </summary>
		[SerializeField] private GameObject platformPrefab;

		/// <summary>
		/// List of platformPrefab we will ue during the game
		/// </summary>
		List<GameObject> listPlatform = new List<GameObject>();

		/// <summary>
		/// The position of the last spawned platform
		/// </summary>
		int positionCube = 0;

		/// <summary>
		/// A counter to count the number of spawned platform
		/// </summary>
		int spawnCount = 1;

		System.Random rand = new System.Random();

		/// <summary>
		/// Get the current player lifes
		/// </summary>
		public int GetPlayerLife()
		{
			int l = PlayerPrefs.GetInt ("LIFE", 3);
			return l;
		}

		/// <summary>
		/// Set the player lifes
		/// </summary>
		public void SetPlayerLife(int l)
		{
			PlayerPrefs.SetInt ("LIFE", l);
			PlayerPrefs.Save ();
		}

		/// <summary>
		/// Use one life to continue and decrease by 1 the number of lifes
		/// </summary>
		public void UseOneLife()
		{
			int l = GetPlayerLife ();
			l--;
			SetPlayerLife (l);
		}

		public void OnGameStart()
		{
			if(OnGameStarted != null)
				OnGameStarted();
		}

		public void OnGameEnd()
		{
			if(OnGameEnded != null)
				OnGameEnded();
		}

		void Awake()
		{
			int count = 0;

			while(true)
			{
				GameObject o = Instantiate (platformPrefab) as GameObject;

				Transform t = o.transform;
				t.SetParent (transform, true);

				o.SetActive(false);

				listPlatform.Add(o);

				count ++;

				if(count > 30)
					break;
			}

		}

		IEnumerator Start()
		{
			platformMaterial.color = colors [0];

			Application.targetFrameRate = 60;
			GC.Collect ();

			yield return 0;

			StartCoroutine (CoroutSpawnCube ());
			StartCoroutine (ChangeMaterialColor ());
		}

		/// <summary>
		/// Spawned a platform from listPlatform
		/// </summary>
		public Transform SpawnPlatform(int pos)
		{
			Transform t = GetPooledPlatform();

			t.SetParent (transform, true);

			t.position = new Vector3 (0, 0, 2 * spawnCount);

			positionCube = pos;

			spawnCount++;

			t.name = spawnCount.ToString ();

			t.GetComponent<AnimationCube> ().DoPosition ();

			return t;
		}


		/// <summary>
		/// Get a platform GameObject from listPlatform. If there is no platform available (so inactive) we create a new one 
		/// </summary>
		Transform GetPooledPlatform()
		{
			var p = listPlatform.Find(o => o.activeInHierarchy == false);

			if(p == null)
			{
				GameObject o = Instantiate (platformPrefab) as GameObject;

				Transform t = o.transform;
				t.SetParent (transform, true);

				o.SetActive(false);

				listPlatform.Add(o);

				p = o;
			}

			p.SetActive(true);

			return p.transform;
		}

		/// <summary>
		/// Coroutine to spawn the cube. 5 at start at position 0. Then Randomly according to the player position (+1 / -1)
		/// </summary>
		IEnumerator CoroutSpawnCube()
		{
			while (true) 
			{
				if (spawnCount < 5) 
				{
					SpawnPlatform (0);
				} 
				else 
				{

					yield return new WaitForSeconds (0.2f);

					if (GetRandom () == 0)
						positionCube--;
					else
						positionCube++;

					var t = SpawnPlatform (positionCube);

					t.eulerAngles = new Vector3(0,0,positionCube*45);



				}

				while (listPlatform.FindAll(o => o.activeInHierarchy == true).Count > 20) 
				{
					yield return 0;
				}
			}

		}


		int GetRandom()
		{

			return rand.Next(0,2);
		}

		/// <summary>
		/// Change the color of all platforms
		/// </summary>
		IEnumerator ChangeMaterialColor()
		{
			yield return new WaitForSeconds (5f);

			while (true) 
			{
				Color colorTemp = colors [UnityEngine.Random.Range (0, colors.Length)];

				StartCoroutine(DoLerp(platformMaterial.color, colorTemp, 3f));

				yield return new WaitForSeconds (10f);
			}


		}

		/// <summary>
		/// Change smoothly the platform color
		/// </summary>
		IEnumerator DoLerp(Color from, Color to, float time)
		{
			float timer = 0;
			while (timer <= time)
			{
				timer += Time.deltaTime;
				platformMaterial.color = Color.Lerp(from, to, timer / time);
				yield return null;
			}
			platformMaterial.color = to;
		}

		void OnDisable()
		{
			platformMaterial.color = colors [0];
		}

		void OnApplicationQuit()
		{
			platformMaterial.color = colors [0];
		}

		public void DOTakeScreenshotWithVerySimpleShare()
		{
			#if VS_SHARE
			VSSHARE.DOTakeScreenShot();
			#endif
		}

		public void HideVerySimpleShare()
		{
			#if VS_SHARE
			VSSHARE.DOHideScreenshotIcon();
			#endif
		}
		/// <summary>
		/// If using Very Simple Ads by App Advisory, show an interstitial if number of play > numberOfPlayToShowInterstitial: http://u3d.as/oWD
		/// </summary>
		public void ShowAds()
		{
			int count = PlayerPrefs.GetInt("GAMEOVER_COUNT",0);
			count++;

			#if APPADVISORY_ADS
			if(count > numberOfPlayToShowInterstitial)
			{

			if(AdsManager.instance.IsReadyInterstitial())
			{
			PlayerPrefs.SetInt("GAMEOVER_COUNT",0);
			AdsManager.instance.ShowInterstitial();
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