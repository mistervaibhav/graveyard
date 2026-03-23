
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
	/// A class in charge to move forward the player and the camera
	/// 
	/// This script move forward the GameObject "PlayerParent"
	/// 
	/// You can change the speed with the variable "sensitivity" in the inspector
	/// </summary>
	public class MoveForward : MonoBehaviorHelper
	{
		/// <summary>
		/// The speed of the move. Change it if you want to change it
		/// </summary>
		public float sensitivity = 1f;

		bool isStarted = false;

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
			isStarted = true;
		}

		void OnGameEnded()
		{
			isStarted = false;
		}

		void Update()
		{
			if (!isStarted)
				return;

			transform.Translate (Vector3.forward * sensitivity * Time.deltaTime);
		}
	}
}