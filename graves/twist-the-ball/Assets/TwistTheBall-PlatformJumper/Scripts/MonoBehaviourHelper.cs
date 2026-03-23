
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
	/// A script to help us with duplicate code.
	/// </summary>
	public class MonoBehaviorHelper : MonoBehaviour
	{
		private GameManager _gameManager;
		public GameManager gameManager
		{
			get
			{
				if (_gameManager == null)
					_gameManager = FindObjectOfType<GameManager> ();

				return _gameManager;
			}
		}

		private Player _player;
		public Player player
		{
			get
			{
				if (_player == null)
					_player = FindObjectOfType<Player> ();

				return _player;
			}
		}

		private CanvasManager _canvasManager;
		public CanvasManager canvasManager
		{
			get
			{
				if (_canvasManager == null)
					_canvasManager = FindObjectOfType<CanvasManager> ();

				return _canvasManager;
			}
		}

		private SoundManager _soundManager;
		public SoundManager soundManager
		{
			get
			{
				if (_soundManager == null)
					_soundManager = FindObjectOfType<SoundManager> ();

				return _soundManager;
			}
		}
	}
}