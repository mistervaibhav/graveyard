
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
	/// The PlatformPosition object. Encapsulate the position of the TOP/MIDDLE/BOTTOM Platform with some logic when you cretae a new one.
	/// </summary>
	[Serializable]
	public class PlatformPositions
	{
		/// <summary>
		/// The position Y of the TOP Platform.
		/// </summary>
		[SerializeField] public float positionTopY;
		/// <summary>
		/// The position Y of the BOTTOM Platform.
		/// </summary>
		[SerializeField] public float positionBottomY;
		/// <summary>
		/// Activate middle cube?
		/// </summary>
		[SerializeField] public bool activateMiddlePlatform;
		/// <summary>
		/// The position Y of the MIDDLE Platform.
		/// </summary>
		[SerializeField] public float positionMiddle;
		/// <summary>
		/// Constructor.
		/// </summary>
		public PlatformPositions(float positionTopY, float positionBottomY)
		{
			activateMiddlePlatform = false;

			SetPosition(positionTopY, positionBottomY);

			positionMiddle = positionBottomY + (this.positionTopY - positionBottomY) / 2f;
		}
		/// <summary>
		/// Constructor.
		/// </summary>
		public PlatformPositions(PlatformPositions other)
		{
			int decalTopY = -1;
			if(Util.GetRandomNumber(0,100) < 20)
			{
				if(Util.GetRandomNumber(0,100) < 50)
				{
					decalTopY = +1;
				}
			}
			else
			{
				decalTopY = 0;
			}


			if(Util.GetRandomNumber(0,100) < 50)
			{
				float rand = Util.GetRandomNumber(0,100);
				if(rand < 50)
				{
					decalTopY *= 2;
				}
				else if(rand < 90)
				{
					decalTopY *= 3;
				}
				else
				{
					decalTopY *= 4;
				}
			}


			int decalBottomY = -1;
			if(Util.GetRandomNumber(0,100) < 20)
			{
				if(Util.GetRandomNumber(0,100) < 50)
				{
					decalBottomY = +1;
				}
			}
			else
			{
				decalBottomY = 0;
			}

			if(Util.GetRandomNumber(0,100) < 50)
			{
				float rand = Util.GetRandomNumber(0,100);
				if(rand < 50)
				{
					decalBottomY *= 2;
				}
				else if(rand < 90)
				{
					decalBottomY *= 3;
				}
				else
				{
					decalBottomY *= 4;
				}
			}

			SetPosition(other.positionTopY + decalTopY, other.positionBottomY + decalBottomY);

			if(other.activateMiddlePlatform == false)
			{
				if(Util.GetRandomNumber(0,100) < 10)
				{
					this.activateMiddlePlatform = true;
				}
			}
			else
			{
				if(Util.GetRandomNumber(0,100) < 90)
				{
					this.activateMiddlePlatform = true;
				}
			}

			if(this.activateMiddlePlatform)
			{

				positionMiddle = other.positionMiddle;

				int sign = +1;

				if(Util.GetRandomNumber(0,100) < 50)
					sign = -1;

				if(Util.GetRandomNumber(0,100) < 10)
				{

					float rand = Util.GetRandomNumber(0,100);


					if(rand < 50)
					{
						positionMiddle = other.positionMiddle + 1 * sign;
					}
					else if(rand < 90)
					{
						positionMiddle = other.positionMiddle + 2 * sign;
					}
					else
					{
						positionMiddle = other.positionMiddle + 3 * sign;
					}
				}

				if(positionMiddle >= positionTopY - 5 || positionMiddle <= positionBottomY + 5)
				{
					positionMiddle = other.positionMiddle;
				}
			}
		}
		/// <summary>
		/// Set the positions.
		/// </summary>
		void SetPosition(float positionTopY, float positionBottomY)
		{
			float _positionTopY = positionTopY;

			float _positionBottomY = positionBottomY;


			if(_positionTopY > Constants.upMaxY)
				_positionTopY = Constants.upMaxY;

			if(_positionTopY < Constants.upMinY)
				_positionTopY = Constants.upMinY;


			if(_positionBottomY > Constants.downMaxY)
				_positionBottomY = Constants.downMaxY;

			if(_positionBottomY < Constants.downMinY)
				_positionBottomY = Constants.downMinY;


			this.positionTopY = _positionTopY;
			this.positionBottomY = _positionBottomY;
		}
	}
}
	