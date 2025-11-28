import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
import { TweetVideoData, VideoQuality, GuestToken } from '../types/index.js';
import { extractTweetId, getQualityLabel, sortVideosByQuality } from '../utils/tweetParser.js';

// Twitter Bearer Token (public, used in official Twitter web client)
const TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

class TwitterScraperService {
  private guestToken: GuestToken | null = null;
  private readonly GUEST_TOKEN_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours

  /**
   * Get or refresh guest token
   */
  private async getGuestToken(): Promise<string> {
    // Check if existing token is still valid
    if (this.guestToken && Date.now() < this.guestToken.expiresAt) {
      return this.guestToken.token;
    }

    try {
      const response = await axios.post(
        'https://api.twitter.com/1.1/guest/activate.json',
        {},
        {
          headers: {
            'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        }
      );

      const token = response.data.guest_token;
      this.guestToken = {
        token,
        expiresAt: Date.now() + this.GUEST_TOKEN_EXPIRY
      };

      return token;
    } catch (error) {
      console.error('Failed to get guest token:', error);
      throw new Error('Failed to authenticate with Twitter');
    }
  }

  /**
   * Fetch tweet data using Twitter API v2
   */
  private async fetchTweetData(tweetId: string): Promise<any> {
    const guestToken = await this.getGuestToken();

    const config: AxiosRequestConfig = {
      headers: {
        'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
        'x-guest-token': guestToken,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://twitter.com/',
      }
    };

    try {
      // Use Twitter API v2 endpoint
      const url = `https://twitter.com/i/api/graphql/VaenaVgh5q5ih7kvyVjgtg/TweetResultByRestId`;
      const params = {
        variables: JSON.stringify({
          tweetId,
          withCommunity: false,
          includePromotedContent: false,
          withVoice: false
        }),
        features: JSON.stringify({
          creator_subscriptions_tweet_preview_api_enabled: true,
          tweetypie_unmention_optimization_enabled: true,
          responsive_web_edit_tweet_api_enabled: true,
          graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
          view_counts_everywhere_api_enabled: true,
          longform_notetweets_consumption_enabled: true,
          responsive_web_twitter_article_tweet_consumption_enabled: false,
          tweet_awards_web_tipping_enabled: false,
          freedom_of_speech_not_reach_fetch_enabled: true,
          standardized_nudges_misinfo: true,
          tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
          longform_notetweets_rich_text_read_enabled: true,
          longform_notetweets_inline_media_enabled: true,
          responsive_web_graphql_exclude_directive_enabled: true,
          verified_phone_label_enabled: false,
          responsive_web_media_download_video_enabled: false,
          responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
          responsive_web_graphql_timeline_navigation_enabled: true,
          responsive_web_enhance_cards_enabled: false
        })
      };

      const response = await axios.get(url, { ...config, params });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Tweet not found or is private');
      }
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      }
      throw new Error('Failed to fetch tweet data');
    }
  }

  /**
   * Extract video URLs from tweet data
   */
  private extractVideoData(data: any, tweetId: string): TweetVideoData {
    try {
      const result = data.data?.tweetResult?.result;

      if (!result) {
        throw new Error('Invalid tweet data structure');
      }

      // Handle different tweet types
      const tweet = result.tweet || result;
      const legacy = tweet.legacy;

      if (!legacy) {
        throw new Error('Tweet data not found');
      }

      const username = tweet.core?.user_results?.result?.legacy?.screen_name || 'unknown';
      const text = legacy.full_text || '';

      // Extract video variants
      const media = legacy.extended_entities?.media || [];
      const videoMedia = media.find((m: any) => m.type === 'video' || m.type === 'animated_gif');

      if (!videoMedia || !videoMedia.video_info) {
        throw new Error('No video found in this tweet');
      }

      const thumbnail = videoMedia.media_url_https || '';
      const rawVariants = videoMedia.video_info.variants || [];

      // Filter and format video variants
      const variants: VideoQuality[] = rawVariants
        .filter((v: any) => v.content_type === 'video/mp4')
        .map((v: any) => ({
          quality: getQualityLabel(v.bitrate || 0),
          bitrate: v.bitrate || 0,
          url: v.url
        }));

      if (variants.length === 0) {
        throw new Error('No downloadable video formats found');
      }

      const sortedVariants = sortVideosByQuality(variants);
      const bestQuality = sortedVariants[0];

      return {
        tweetId,
        username,
        text: text.length > 100 ? text.substring(0, 100) + '...' : text,
        thumbnail,
        variants: sortedVariants,
        bestQuality
      };
    } catch (error: any) {
      console.error('Error extracting video data:', error.message);
      throw error;
    }
  }

  /**
   * Main method to download video data from tweet URL
   */
  async getVideoData(url: string): Promise<TweetVideoData> {
    const tweetId = extractTweetId(url);

    if (!tweetId) {
      throw new Error('Invalid Twitter/X URL. Please provide a valid tweet URL.');
    }

    const tweetData = await this.fetchTweetData(tweetId);
    return this.extractVideoData(tweetData, tweetId);
  }
}

export default new TwitterScraperService();
