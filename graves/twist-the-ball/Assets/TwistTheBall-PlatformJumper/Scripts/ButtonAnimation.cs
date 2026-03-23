
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
using UnityEngine.UI;
using UnityEngine.EventSystems;

namespace AppAdvisory.TwistTheBall
{
	/// <summary>
	/// CLass in charge to add some visual effect to buttons in desktop, web and tv 
	/// </summary>
	public class ButtonAnimation : MonoBehaviour
	#if !UNITY_IOS || !UNITY_ANDROID
	,
	IPointerDownHandler, 
	IPointerClickHandler,
	IPointerEnterHandler, 
	IPointerExitHandler,
	ISelectHandler,
	IDeselectHandler,
	ISubmitHandler
	#endif
	{
		#if !UNITY_IOS || !UNITY_ANDROID
		bool _isClicked = false;
		bool isClicked
		{
			set
			{
				_isClicked = value;

				if(_isClicked == true)
					Invoke("TurnIsClickedFalse",1);
			}

			get
			{
				return _isClicked;
			}
		}

		void TurnIsClickedFalse()
		{
			isClicked = false;
		}

		public void OnPointerClick (PointerEventData eventData)
		{
			if(isClicked)
				return;

			isClicked = true;

			DoScale(transform.localScale.x/2f,0.2f, () => {
				DoScale(transform.localScale.x*2f,0.2f, () => {
					//				FindObjectOfType<CanvasManager>().OnClickedButton(gameObject);
				});
			});
		}

		public void OnSelect (BaseEventData eventData)
		{
			DoScale(1.3f,0.2f, () => {

			});
		}

		public void OnDeselect (BaseEventData eventData)
		{
			DoScale(1.0f,0.2f, () => {

			});
		}


		public void OnPointerDown (PointerEventData eventData)
		{
			if(isClicked)
				return;

			isClicked = true;

			DoScale(transform.localScale.x/2f,0.2f, () => {
				DoScale(transform.localScale.x*2f,0.2f, () => {
					//				FindObjectOfType<CanvasManager>().OnClickedButton(gameObject);
				});
			});
		}

		public void OnSubmit (BaseEventData eventData)
		{
			if(isClicked)
				return;

			isClicked = true;

			DoScale(transform.localScale.x/2f,0.2f, () => {
				DoScale(transform.localScale.x*2f,0.2f, () => {
					//				FindObjectOfType<CanvasManager>().OnClickedButton(gameObject);
				});
			});
		}

		public void OnPointerEnter (PointerEventData eventData)
		{
			DoScale(1.3f,0.2f, () => {

			});
		}

		public void OnPointerExit (PointerEventData eventData)
		{
			DoScale(1f,0.2f, () => {

			});
		}


		void DoScale(float toS, float duration, Action OnCompete)
		{
			StopAllCoroutines();
			StartCoroutine(_DoScale(toS, duration, OnCompete));
		}

		IEnumerator _DoScale(float toS, float duration, Action OnCompete)
		{
			float timer = 0;

			float fromS = transform.localScale.x;

			while (timer <= duration)
			{
				timer += Time.deltaTime;
				transform.localScale = Vector2.one * Mathf.Lerp (fromS, toS, timer / duration);
				yield return null;
			}

			transform.localScale = Vector2.one * toS;

			if(OnCompete != null)
				OnCompete();
		}
		#endif
	}
}