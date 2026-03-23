
/***********************************************************************************************************
 * Produced by App Advisory - http://app-advisory.com													   *
 * Facebook: https://facebook.com/appadvisory															   *
 * Contact us: https://appadvisory.zendesk.com/hc/en-us/requests/new									   *
 * App Advisory Unity Asset Store catalog: http://u3d.as/9cs											   *
 * Developed by Gilbert Anthony Barouch - https://www.linkedin.com/in/ganbarouch                           *
 ***********************************************************************************************************/






using UnityEngine;
using System.Collections;

namespace AppAdvisory.SwitchTheGravity
{
	/// <summary>
	/// Class attached to the Main Camera to follow the player.
	/// </summary>
	public class CameraFollowPlayer : MonoBehaviour 
	{
		/// <summary>
		/// Reference to the Player.
		/// </summary>
		Player player;
		/// <summary>
		/// Difference of the position on the X axis between the Player and the camera.
		/// </summary>
		float diffX = -20;
		/// <summary>
		/// Start the follow with this method. We don't start it automatically because of the start animation of the player.
		/// </summary>
		public void DOStart()
		{
			player = FindObjectOfType<Player>();
			diffX = transform.position.x - player.transform.position.x;

			StartCoroutine(_Start());
		}
		/// <summary>
		/// Start the follow with this method. We don't start it automatically because of the start animation of the player.
		/// </summary>
		IEnumerator _Start()
		{
			while(true)
			{
				transform.position = new Vector3(player.transform.position.x + diffX, transform.position.y, transform.position.z);
				yield return 0;
			}
		}
	}
}