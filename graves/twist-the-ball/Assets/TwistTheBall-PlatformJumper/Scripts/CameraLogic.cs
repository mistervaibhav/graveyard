
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
	/// Class in charge to rotate the Camera with the player when the player jumps
	/// This script is attached to the Main Camera (child of the GameObject "PlayerParent")
	/// </summary>
	public class CameraLogic : MonoBehaviour 
	{
		public Transform player;

		void Start()
		{
			var p = FindObjectOfType<Player> ();
			player = p.transform;
		}

		void Update()
		{
			transform.rotation = player.rotation;	
		}
	}
}