
/***********************************************************************************************************
 * Produced by App Advisory - http://app-advisory.com													   *
 * Facebook: https://facebook.com/appadvisory															   *
 * Contact us: https://appadvisory.zendesk.com/hc/en-us/requests/new									   *
 * App Advisory Unity Asset Store catalog: http://u3d.as/9cs											   *
 * Developed by Gilbert Anthony Barouch - https://www.linkedin.com/in/ganbarouch                           *
 ***********************************************************************************************************/





using UnityEngine;
using System;
using System.Collections;

#if AADOTWEEN
using DG.Tweening;
#endif

namespace AppAdvisory.SwitchTheGravity
{
	/// <summary>
	/// Each Platform is composed with 3 elements: a top platform, a center platform, and a bottom platform.
	/// </summary>
	public class Platform : MonoBehaviour 
	{
		/// <summary>
		/// The number of the platform.
		/// </summary>
		[NonSerialized] public int num;
		/// <summary>
		/// The renderer of the top Platform.
		/// </summary>
		public MeshRenderer platformTopRenderer;
		/// <summary>
		/// The renderer of the center Platform.
		/// </summary>
		public MeshRenderer platformCenterRenderer;
		/// <summary>
		/// The renderer of the bottom Platform.
		/// </summary>
		public MeshRenderer platformBottomRenderer;
		/// <summary>
		/// The tranform of the parent of the top Platform.
		/// </summary>
		public Transform platformTopParent;
		/// <summary>
		/// The tranform of the parent of the center Platform.
		/// </summary>
		public Transform platformCenterParent;
		/// <summary>
		/// The tranform of the parent of the bottom Platform.
		/// </summary>
		public Transform platformBottomParent;
		/// <summary>
		/// The PlatformPositions of this Platform.
		/// </summary>
		[NonSerialized] public PlatformPositions platformPosition = new PlatformPositions(0,0);
		/// <summary>
		/// Reference to the GameManager.
		/// </summary>
		GameManager gameManager;
		/// <summary>
		/// Reference to the Player.
		/// </summary>
		Player player;
		/// <summary>
		/// Return the distance on the X axis between the player and this Platform (in absolute value).
		/// </summary>
		float distance
		{
			get
			{
				float d = player.transform.position.x - transform.position.x;

				if(d < 0)
					d *= -1f;

				return d;
			}
		}
		void Awake()
		{
			gameManager = FindObjectOfType<GameManager>();
			player = gameManager.player;

			ResetPos();
		}
		/// <summary>
		/// Reset position when become active = recycle Platform.
		/// </summary>
		void OnEnable()
		{
			ResetPos();
		}
		/// <summary>
		/// Reset cube positions.
		/// </summary>
		void ResetPos()
		{
			platformPosition = new PlatformPositions(0,0);

			platformTopParent.transform.localPosition = new Vector3(0, Constants.middlePosY, 0);
			platformCenterParent.transform.localPosition = new Vector3(0, 0, 0);
			platformBottomParent.transform.localPosition = new Vector3(0, -Constants.middlePosY, 0);
		}
		/// <summary>
		/// Initialize the Platform and start checking position / animation coroutines.
		/// </summary>
		public void Init(int num, Color c, PlatformPositions platformPosition)
		{
			InitWithoutCorout(num, c, platformPosition);

			StartCorout();
		}
		/// <summary>
		/// Initialize the Platform without checking position / animation coroutines.
		/// </summary>
		public void InitWithoutCorout(int num, Color c, PlatformPositions platformPosition)
		{
			this.num = num;

			name = "platform" + num;

			transform.position = new Vector3(num,0,0);

			platformTopRenderer.material.color = c;
			platformCenterRenderer.material.color = c;
			platformBottomRenderer.material.color = c;

			this.platformPosition = platformPosition;

			platformCenterParent.gameObject.SetActive(platformPosition.activateMiddlePlatform);

			platformCenterParent.localPosition = new Vector3(0, this.platformPosition.positionMiddle, 0);

			if(gameManager.GameIsStarted())
			{
				StartCorout();
			}
			else
			{
				var pTOP = platformTopParent.transform.localPosition;
				pTOP.y = 2 * Constants.upMaxY;
				platformTopParent.transform.localPosition = pTOP;

				#if AADOTWEEN
				platformTopParent.DOLocalMoveY(Constants.middlePosY, Constants.animInOutTime).SetEase(Constants.easeIn);
				#endif

				var pBottom = platformBottomParent.transform.localPosition;
				pBottom.y = 2 * Constants.downMinY;
				platformBottomParent.transform.localPosition = pBottom;

				#if AADOTWEEN
				platformBottomParent.DOLocalMoveY(-Constants.middlePosY, Constants.animInOutTime).SetEase(Constants.easeIn)
					.OnComplete(() => {
						if(distance > Constants.screenWidth)
						{
							gameManager.StartTheGame();
						}
					});
				#endif
			}
		}
		/// <summary>
		/// Start the Coroutine for the animation "open" of this Platform when this Platform appear on the screen, and start the animation "close" when this Platform is going to be out os the screen.
		/// And start the Coroutine for the logic before despawn the Platform.
		/// </summary>
		public void StartCorout()
		{
			StartCoroutine(_Start());
			StartCoroutine(_DespawnCheck());
		}
		/// <summary>
		/// Start the animation "open" of this Platform when this Platform appear on the screen, and start the animation "close" when this Platform is going to be out os the screen.
		/// </summary>
		IEnumerator _Start()
		{
			while(!gameManager.GameIsStarted())
			{
				yield return 0;
			}

			while(distance > Constants.distFront)
			{
				yield return 0;
			}

			AnimOpen();

			yield return 0;

			while(player.transform.position.x < transform.position.x)
			{
				yield return 0;
			}

			while(distance < Constants.distBehind)
			{
				yield return 0;
			}

			AnimClose();
		}
		/// <summary>
		/// Open the platform when the player comes.
		/// </summary>
		public void AnimOpen()
		{
			#if AADOTWEEN
			platformTopParent.transform.DOLocalMoveY(platformPosition.positionTopY, Constants.animInOutTime).SetEase(Constants.easeIn);
			platformBottomParent.transform.DOLocalMoveY(platformPosition.positionBottomY, Constants.animInOutTime).SetEase(Constants.easeIn);
			#endif
		}
		/// <summary>
		/// Close the platform when the player go away.
		/// </summary>
		public void AnimClose()
		{
			#if AADOTWEEN
			platformTopParent.transform.DOLocalMoveY(Constants.middlePosY, Constants.animInOutTime).SetEase(Constants.easeOut);
			platformBottomParent.transform.DOLocalMoveY(-Constants.middlePosY, Constants.animInOutTime).SetEase(Constants.easeOut);
			#endif
		}
		/// <summary>
		/// Anim out the platforms when the player lose.
		/// </summary>
		public void AnimOut(float delay, Action<int> isFinished)
		{
			#if AADOTWEEN
			platformTopParent.transform.DOKill();
			platformBottomParent.transform.DOKill();
			#endif

			StopAllCoroutines();

			#if AADOTWEEN
			platformCenterParent.transform.DOScale(Vector3.zero, Constants.animInOutTime).SetEase(Constants.easeOut).SetDelay(delay);

			platformTopParent.transform.DOLocalMoveY(2 * Constants.upMaxY, Constants.animInOutTime).SetEase(Constants.easeOut).SetDelay(delay);
			platformBottomParent.transform.DOLocalMoveY(2 * Constants.downMinY, Constants.animInOutTime).SetEase(Constants.easeOut).SetDelay(delay)
				.OnComplete(() =>{
			#endif
					if(isFinished!=null)
						isFinished(this.num);
			
			#if AADOTWEEN
					gameObject.SetActive(false);
				});
			#endif

		}
		/// <summary>
		/// Some logic before despawn the Platform.
		/// </summary>
		IEnumerator _DespawnCheck()
		{
			// wait for game starting (for the Platform spawn before the player comes in the screen)
			while(!gameManager.GameIsStarted())
			{
				yield return 0;
			}

			yield return new WaitForSeconds(0.5f);

			if(player != null)
			{
				// Wait for the Player exceed the Platform position .
				while(player.transform.position.x < transform.position.x)
				{
					yield return 0;
				}

				yield return 0;

				// Wait for the Platform is out of the screen view and desactivate it, and spawn a new one.
				while(true)
				{
					if(Vector3.Distance(player.transform.position, transform.position) > Constants.screenWidth / 1.5f)
					{
						gameManager.SpawnPlatform();
						gameObject.SetActive(false);
					}

					yield return 0;
				}
			}
		}
	}
}
