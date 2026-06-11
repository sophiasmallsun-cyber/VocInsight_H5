/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FilterState {
  timeRange: [string, string];
  period: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Period Summary';
  dataSource: string;
  category: string;
  ecommerceSource: string;
  brand: string;
  productCountry: string;
  productSeries: string;
  productName: string;
  size: string;
  isVerticalReview: string;
  starRating: string;
  showDuplicateReview: string;
  keywordQuery: string;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  changeValue: string;
  changeType: 'up' | 'down' | 'flat';
  realValue: number;
}

export interface IssueData {
  no: number;
  issueType: string;
  description: string;
  percentage: number; // e.g. 9.2
  sampleCount: number; // e.g. 258
  momChange: string; // e.g. "116.7%"
  isUp: boolean;
}

export interface ConcernData {
  name: string;
  positive: number; // percentage (e.g. 48)
  negative: number; // percentage (e.g. 42)
  total: number;    // percentage (e.g. 90)
}

export interface ScenarioData {
  name: string;
  percentage: number;
}

export interface CommentDetail {
  id: string;
  user: string;
  rating: number;
  source: string;
  date: string;
  commentText: string;
  category: string;
  sentiment: 'positive' | 'negative';
}
