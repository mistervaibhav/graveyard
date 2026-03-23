
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

namespace AppAdvisory.SwitchTheGravity
{
	/// <summary>
	/// Each theme of color is composed by two colors. This class is an object who handle this two colors.
	/// </summary>
	[Serializable]
	public class AAColor 
	{
		// <summary>
		/// The first color.
		/// </summary>
		[SerializeField] public Color colorA;
		// <summary>
		/// The fsecond color.
		/// </summary>
		[SerializeField] public Color colorB;
		/// <summary>
		/// Constructor.
		/// </summary>
		public AAColor(Color colorA, Color colorB)
		{
			this.colorA = colorA;
			this.colorB = colorB;
		}
	}
}
