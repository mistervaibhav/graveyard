
/***********************************************************************************************************
 * Produced by App Advisory - http://app-advisory.com													   *
 * Facebook: https://facebook.com/appadvisory															   *
 * Contact us: https://appadvisory.zendesk.com/hc/en-us/requests/new									   *
 * App Advisory Unity Asset Store catalog: http://u3d.as/9cs											   *
 * Developed by Gilbert Anthony Barouch - https://www.linkedin.com/in/ganbarouch                           *
 ***********************************************************************************************************/






using UnityEngine;
using System.Collections;

#if AADOTWEEN
using DG.Tweening;
#endif

namespace AppAdvisory.SwitchTheGravity
{
	/// <summary>
	/// Some constants.
	/// </summary>
	public static class Constants
	{
		/// <summary>
		/// Maximum Y position of the top platforms.
		/// </summary>
		public const int upMaxY = 32;
		/// <summary>
		/// Minimum Y position of the top platforms.
		/// </summary>
		public const int upMinY = 28;
		/// <summary>
		/// Maximum Y position of the bottom platforms.
		/// </summary>
		public const int downMaxY = -upMinY;
		/// <summary>
		/// Minimum Y position of the bottom platforms.
		/// </summary>
		public const int downMinY = -upMaxY;
		/// <summary>
		/// Middle position of the platforms (= position where the top and bottom platforms touch eachother). 
		/// </summary>
		public const int middlePosY = 25;
		/// <summary>
		/// Number of platforms we want to spawn in the game (then we recycle them).
		/// </summary>
		public const int numberOfPlatform = (int)(1 + 2 * Constants.screenWidth);
		/// <summary>
		/// The screen width we want in all devices (to have the same gameplay everywhere).
		/// </summary>
		public const float screenWidth = 22;
		/// <summary>
		/// The name of the screenshots.
		/// </summary>
		public const string ScreenShotName = "Screenshot";
		/// <summary>
		/// The distance in front of the player to start the Platform animation open.
		/// </summary>
		public const float distFront = 20f;
		/// <summary>
		/// The distance behind of the player to start the Platform animation close.
		/// </summary>
		public const float distBehind = 1f;
		#if AADOTWEEN
		/// <summary>
		/// The ease type of the tweener use for the animation in of the Platform.
		/// </summary>
		public const Ease easeIn = Ease.OutBack;
		/// <summary>
		/// The ease type of the tweener use for the animation out of the Platform.
		/// </summary>
		public const Ease easeOut = Ease.InBack;
		#endif
		/// <summary>
		/// The duration of the animation in and out of the Platform.
		/// </summary>
		public const float animInOutTime = 0.7f;
		/// <summary>
		/// The speed on the horizontal axis of the Player.
		/// </summary>
		public const float PLAYER_speedHorizontal = 15f;
		/// <summary>
		/// The speed on the vertical axis of the Player.
		/// </summary>
		public const float PLAYER_speedVertical = 60f;
		/// <summary>
		/// We raycast before of the move to avoid Player goes throught thing.
		/// </summary>
		public const float PLAYER_raycastForward = 1.5f;
	}
}

