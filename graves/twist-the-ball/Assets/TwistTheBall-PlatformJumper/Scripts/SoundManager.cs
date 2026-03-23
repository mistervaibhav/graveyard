
/***********************************************************************************************************
 * Produced by App Advisory - http://app-advisory.com													   *
 * Facebook: https://facebook.com/appadvisory															   *
 * Contact us: https://appadvisory.zendesk.com/hc/en-us/requests/new									   *
 * App Advisory Unity Asset Store catalog: http://u3d.as/9cs											   *
 * Developed by Gilbert Anthony Barouch - https://www.linkedin.com/in/ganbarouch                           *
 ***********************************************************************************************************/




using UnityEngine;
using System.Collections;

namespace AppAdvisory.TwistTheBall
{
	/// <summary>
	/// Class in charge to play sound in the game
	/// </summary>
	public class SoundManager : MonoBehaviour 
	{
		/// <summary>
		/// Reference to the jump sound
		/// </summary>
		public AudioClip soundJump;
		/// <summary>
		/// Reference to the fail sound
		/// </summary>
		public AudioClip soundFail;
		/// <summary>
		/// Reference to the audiosource who will play the sounds
		/// </summary>
		AudioSource audioSource;

		void Awake()
		{
			audioSource = GetComponent<AudioSource> ();
		}
		/// <summary>
		/// Method to play the sound fail
		/// </summary>
		public void PlaySoundFail()
		{
			audioSource.PlayOneShot (soundFail);
		}
		/// <summary>
		/// Method to play the sound jump
		/// </summary>
		public void PlaySoundJump()
		{
			audioSource.PlayOneShot (soundJump);
		}
	}
}