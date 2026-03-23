
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
	/// Player class with all the logic of the Player. Attached to the Player GameObject.
	/// </summary>
	public class Player : MonoBehaviour 
	{
		/// <summary>
		/// The audioclip played when the player finished a jump.
		/// </summary>
		public AudioClip impactFX;
		/// <summary>
		/// Audiosource for the Plater FXs.
		/// </summary>
		AudioSource audiosource;
		/// <summary>
		/// Reference to the GameManager.
		/// </summary>
		GameManager gameManager;
		/// <summary>
		/// Reference to the particles played during the game.
		/// </summary>
		public GameObject particleInGame;
		/// <summary>
		/// Reference to the particles played at game over only.
		/// </summary>
		public GameObject particleGameOver;
		/// <summary>
		/// To not play the first move sound at the end of the animation of the Player at start.
		/// </summary>
		bool firstSound = true;
		/// <summary>
		/// The particles play in background(the "stars").
		/// </summary>
		public GameObject[] particleBackground;
		/// <summary>
		/// Some initializations.
		/// </summary>
		void Awake()
		{
			gameManager = FindObjectOfType<GameManager>();
			audiosource = gameObject.AddComponent<AudioSource>();
			audiosource.volume = 0.5f;
			particleGameOver.SetActive(false);
			particleInGame.SetActive(true);
			firstSound = true;
			ActivateParticleBackground(false);
		}
		/// <summary>
		/// Some initializations.
		/// </summary>
		void Start()
		{
			transform.position = new Vector3(-Constants.screenWidth,0,0);
		}
		/// <summary>
		/// Do the animation start of the player.
		/// </summary>
		public void DOStart(Action finished)
		{
			#if AADOTWEEN
			transform.DOMove(new Vector3(0,-2.5f,0),1f).OnComplete(() => {

				StartCoroutine(_Start());

				ActivateParticleBackground(true);
			#endif

				if(finished != null)
					finished();
			
			#if AADOTWEEN
			});
			#endif
		}
		/// <summary>
		/// Do the check position/collision (cf Check() method) every frame.
		/// </summary>
		IEnumerator _Start()
		{
			while(true)
			{
				Check();
				yield return 0;
			}
		}
		/// <summary>
		/// Last pos Y od the Player.
		/// </summary>
		float lastPosY = 0;
		/// <summary>
		/// The current pitch of the sound (to have different pitch level FX when the Player hit a cube).
		/// </summary>
		float pitch = 1f;
		/// <summary>
		/// To not play more than one time by jump the jump FX.
		/// </summary>
		bool canPlayFx = true;
		/// <summary>
		/// Call at game over. Desatcivate the current particles and activate the particle game over, desactivate the renderer of the player then call the game over method in the GameManager.
		/// </summary>
		void GameOver()
		{
			gameManager.GameOver();
			StopAllCoroutines();
			particleInGame.SetActive(false);
			particleGameOver.SetActive(true);
			particleGameOver.GetComponent<ParticleSystem>().Emit(50);
			GetComponent<MeshRenderer>().enabled = false;
		}
		/// <summary>
		/// Activate the particle background. There are two particles: one static, the other one moving on the left.
		/// </summary>
		void ActivateParticleBackground(bool setActivate)
		{
			foreach(var p in particleBackground)
			{
				p.SetActive(setActivate);
			}
		}
		/// <summary>
		/// Raycast to top, bottom, and in front of the player.
		/// </summary>
		void Check()
		{
			RaycastHit hit;

			//if there is a platform in front of the player ==> Game Over.
			if(Physics.Raycast(transform.position, Vector3.right, out hit, Constants.PLAYER_raycastForward * Constants.PLAYER_speedHorizontal * Time.deltaTime))
			{
				GameOver();
			}
			else
			{
				transform.Translate(Constants.PLAYER_speedHorizontal * Vector3.right * Time.deltaTime);

				if(gameManager.gravityUp)
				{
					//If there is no platform, do the move. If there is a platform, stop the move.
					if(Physics.Raycast(transform.position, -Vector3.up, out hit, Constants.PLAYER_raycastForward * Constants.PLAYER_speedVertical * Time.deltaTime))
					{
						transform.position = new Vector3(transform.position.x, hit.point.y + 0.5f, 0);
					}
					else
					{
						transform.Translate(-Constants.PLAYER_speedVertical * Vector3.up * Time.deltaTime);
					}
				}
				else
				{
					//If there is no platform, do the move. If there is a platform, stop the move.
					if(Physics.Raycast(transform.position, Vector3.up, out hit, Constants.PLAYER_raycastForward * Constants.PLAYER_speedVertical * Time.deltaTime))
					{

						transform.position = new Vector3(transform.position.x, hit.point.y - 0.5f, 0);
					}
					else
					{
						transform.Translate(Constants.PLAYER_speedVertical * Vector3.up * Time.deltaTime);
					}
				}

				//if the position change and after the position is not changed, play the sound fx because the player just finished a jump.
				if(lastPosY == transform.position.y)
				{
					if(canPlayFx)
					{
						if(!firstSound)
						{
							audiosource.PlayOneShot(impactFX);
						}
						firstSound = false;
						canPlayFx = false;
						audiosource.pitch += 0.2f;
					}
				}
				else
				{
					canPlayFx = true;
				}

				lastPosY = transform.position.y;
			}
		}
		/// <summary>
		/// Reset the player audiosource pitch to default value = 1.
		/// </summary>
		public void ResetPitch()
		{
			audiosource.pitch = 1f;
		}
	}
}
