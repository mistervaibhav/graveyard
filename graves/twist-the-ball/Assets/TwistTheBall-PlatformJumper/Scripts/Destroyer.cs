
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
	/// Class in charge to destroy all the platform who entered in
	/// 
	/// This script is attached to the GameObject destroyer (child of the GameObject "PlayerParent")
	/// </summary>
	public class Destroyer : MonoBehaviour 
	{
		/// <summary>
		/// Will desatcivate (= despawn) the platform who is triggered with
		/// </summary>
		void OnTriggerEnter(Collider other) 
		{
			other.transform.parent.gameObject.SetActive(false);
		}
	}
}