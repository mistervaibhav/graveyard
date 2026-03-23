
/***********************************************************************************************************
 * Produced by App Advisory - http://app-advisory.com													   *
 * Facebook: https://facebook.com/appadvisory															   *
 * Contact us: https://appadvisory.zendesk.com/hc/en-us/requests/new									   *
 * App Advisory Unity Asset Store catalog: http://u3d.as/9cs											   *
 * Developed by Gilbert Anthony Barouch - https://www.linkedin.com/in/ganbarouch                           *
 ***********************************************************************************************************/







using UnityEngine;
using UnityEngine.UI;
using System.Collections;

#if AADOTWEEN
using DG.Tweening;
#endif

namespace AppAdvisory.SwitchTheGravity
{
	/// <summary>
	/// Represent the blur black image at the top and the botom of the screen.
	/// </summary>
	public class CanvasBlur : MonoBehaviour
	{
		/// <summary>
		/// Singleton.
		/// </summary>
		static private CanvasBlur self;
		/// <summary>
		/// Reference to the top image in the top of the screen.
		/// </summary>
		public Image imageTop;
		/// <summary>
		/// Reference to the bottom image in the top of the screen.
		/// </summary>
		public Image imageBottom;
		/// <summary>
		/// Scale to 50 the images to prepare the animation at start (from black to visible screen game).
		/// </summary>
		void Awake ()
		{
			self = this;

			imageTop.transform.localScale = Vector3.one * 50;
			imageBottom.transform.localScale = Vector3.one * -50;
		}
		/// <summary>
		/// Launch the anim start .. at start. The anim start is from black to blur on the top and bottom only.
		/// </summary>
		void Start()
		{
			_DOAnimStart();
		}
		/// <summary>
		/// Launch the anim game over .. at game over. The anim game over is from blur on the top and bottom only to black.
		/// </summary>
		static public void DOAnimGameOver()
		{
			self._DOAnimGameOver();
		}
		/// <summary>
		/// Launch the anim game over .. at game over. The anim game over is from blur on the top and bottom only to black.
		/// </summary>
		void _DOAnimGameOver()
		{
			#if AADOTWEEN

			imageTop.transform.DOScale(Vector3.one * 50f, 0.5f);
			imageBottom.transform.DOScale(Vector3.one * -50f, 0.5f);

			#endif

		}
		/// <summary>
		/// Launch the anim start .. at start. The anim start is from black to blur on the top and bottom only.
		/// </summary>
		static public void DOAnimStart()
		{
			self._DOAnimStart();
		}
		/// <summary>
		/// Launch the anim start .. at start. The anim start is from black to blur on the top and bottom only.
		/// </summary>
		void _DOAnimStart()
		{
			#if AADOTWEEN

			imageTop.transform.DOScale(Vector3.one * 1.01f, 0.5f);
			imageBottom.transform.DOScale(Vector3.one * -1.01f, 0.5f);

			#endif
		}
	}
}