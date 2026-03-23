
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
	public static class Score
	{
		public static bool SaveLastScore(int score)
		{
			PlayerPrefs.SetInt("LAST_SCORE",score);

			int best = LoadBestScore();

			if(score > best)
			{
				PlayerPrefs.SetInt("BEST_SCORE",score);
				PlayerPrefsX.SetBool("LastScoreWasBestScore",true);
			}
			else
			{
				PlayerPrefsX.SetBool("LastScoreWasBestScore",false);
			}

			PlayerPrefs.Save();

			return LastScoreWasBestScore();
		}
		public static int LoadLastScore()
		{
			return PlayerPrefs.GetInt("LAST_SCORE",0);
		}
		public static bool LastScoreWasBestScore()
		{
			return PlayerPrefsX.GetBool("LastScoreWasBestScore",false);
		}
		public static int LoadBestScore()
		{
			return PlayerPrefs.GetInt("BEST_SCORE",0);
		}
	}
}