
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
	/// Class in charge to animate the cube when they appear on the screen
	/// </summary>
	public class AnimationCube : MonoBehaviour 
	{

		public Transform cube;

		float animTime = 2;

		[SerializeField] private Vector3 position;


		void Awake()
		{
			position = cube.localPosition;

			cube.gameObject.SetActive (false);
		}

		void OnEnable()
		{
			StopAllCoroutines ();

			cube.gameObject.SetActive (false);
		}

		void OnDisable()
		{
			cube.gameObject.SetActive (false);

			StopAllCoroutines ();
		}
		/// <summary>
		/// Launch the animation of the platform when he appears on the screen
		/// </summary>
		public void DoPosition()
		{
			cube.gameObject.SetActive (false);

			StopAllCoroutines ();

			StartCoroutine (_DoPosition ());
		}
		/// <summary>
		/// Coroutine to do the animation smoothly when the platform appears on the screen
		/// </summary>
		IEnumerator _DoPosition()
		{
			Vector3 startPosition = new Vector3 (position.x*50,position.y*50, 0);

			cube.localPosition = startPosition;

			cube.gameObject.SetActive (true);

			Vector3 finalPosition = position;


			float timer = 0;
			while (timer <= animTime)
			{
				timer += Time.deltaTime;
				var posTemp = Vector3.Lerp(startPosition, finalPosition, timer / animTime);
				cube.localPosition = posTemp;
				yield return null;
			}
		}


	}
}