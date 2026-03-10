import type { SwimStyleData } from '../types';
import { freestyleCrawlStyle } from './freestyleCrawl';

export const SWIM_STYLES: Record<string, SwimStyleData> = {
  [freestyleCrawlStyle.id]: freestyleCrawlStyle
};

