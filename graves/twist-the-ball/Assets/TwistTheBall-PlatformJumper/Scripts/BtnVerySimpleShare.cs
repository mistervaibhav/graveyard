
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
	public class BtnVerySimpleShare : MonoBehaviour
	{
		#if !VS_SHARE
		public RectTransform buttonVerySimpleShare;
		public string VerySimpleAdsURL = "http://u3d.as/oWD";
		#endif

		public void OnClickedVerySimpleShare()
		{
			#if !VS_SHARE
			Debug.LogWarning("To take and share screenshots, you need Very Simple Share: " + VerySimpleAdsURL);
			Debug.LogWarning("Very Simple Share: " + VerySimpleAdsURL);
			Debug.LogWarning("Very Simple Share is ready to use in the game template: " + VerySimpleAdsURL);
			//		AnimVerySimpleShare(false);
			#endif
		}
	}
}