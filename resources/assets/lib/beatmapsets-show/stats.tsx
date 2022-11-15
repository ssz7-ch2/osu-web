// Copyright (c) ppy Pty Ltd <contact@ppy.sh>. Licensed under the GNU Affero General Public License v3.0.
// See the LICENCE file in the repository root for full licence text.

import BeatmapBasicStats from 'components/beatmap-basic-stats';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { formatNumber } from 'utils/html';
import { trans } from 'utils/string';
import Controller from './controller';

interface Props {
  controller: Controller;
}

@observer
export default class Stats extends React.Component<Props> {
  // the one in beatmapset has invalid rating 0 data in it
  @computed
  private get ratings() {
    return this.props.controller.beatmapset.ratings.slice(1);
  }

  private get statKeys() {
    switch (this.props.controller.currentBeatmap.mode) {
      case 'mania':
        return ['cs', 'drain', 'accuracy', 'difficulty_rating'] as const;
      case 'taiko':
        return ['drain', 'accuracy', 'difficulty_rating'] as const;
      default:
        return ['cs', 'drain', 'accuracy', 'ar', 'difficulty_rating'] as const;
    }
  }

  constructor(props: Props) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <div className='beatmapset-stats'>
        <button
          className='beatmapset-stats__row beatmapset-stats__row--preview js-audio--play js-audio--player'
          data-audio-url={this.props.controller.beatmapset.preview_url}
          type='button'
        >
          <span className='play-button' />
          <div className='beatmapset-stats__elapsed-bar' />
        </button>

        <div className='beatmapset-stats__row beatmapset-stats__row--basic'>
          <BeatmapBasicStats
            beatmap={this.props.controller.currentBeatmap}
            beatmapset={this.props.controller.beatmapset}
          />
        </div>

        <div className='beatmapset-stats__row beatmapset-stats__row--advanced'>
          <table className='beatmap-stats-table'>
            <tbody>
              {this.statKeys.map(this.renderStat)}
            </tbody>
          </table>
        </div>

        {this.props.controller.beatmapset.is_scoreable &&
          <div className='beatmapset-stats__row beatmapset-stats__row--rating'>
            <div className='beatmapset-stats__rating-header'>{trans('beatmapsets.show.stats.user-rating')}</div>

            {this.renderRatingBar()}

            <div className='beatmapset-stats__rating-header'>{trans('beatmapsets.show.stats.rating-spread')}</div>

            <div className='beatmapset-stats__rating-chart'>
              {this.renderRatingChart()}
            </div>
          </div>
        }
      </div>
    );
  }

  private renderRatingBar() {
    const summary = {
      negative: 0,
      positive: 0,
    };

    this.ratings.forEach((count, i) => {
      const key = i < 5 ? 'negative' : 'positive';
      summary[key] += count;
    });

    const total = Math.max(1, summary.positive + summary.negative);

    return (
      <>
        <div className='bar--beatmap-rating'>
          <div
            className='bar__fill'
            style={{
              width: `${(summary.negative / total) * 100}%`,
            }}
          />
        </div>

        <div className='beatmapset-stats__rating-values'>
          <span>{formatNumber(summary.negative)}</span>
          <span>{formatNumber(summary.positive)}</span>
        </div>
      </>
    );
  }

  private renderRatingChart() {
    if (!this.props.controller.beatmapset.is_scoreable) return;

    const ratings = this.ratings;
    const maxValue = Math.max(1, Math.max(...ratings));

    return (
      <div className='stacked-bar-chart stacked-bar-chart--beatmap-fail-rate'>
        {ratings.map((count, i) => (
          <div key={i} className='stacked-bar-chart__col'>
            <div
              className='stacked-bar-chart__entry'
              style={{
                height: `${100 * count / maxValue}%`,
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  private readonly renderStat = (key: typeof this.statKeys[number]) => {
    const rawValue = this.props.controller.currentBeatmap[key];
    let label: string = key;
    let value: string;

    switch (key) {
      case 'difficulty_rating':
        label = 'stars';
        value = formatNumber(rawValue, 2);
        break;
      case 'cs':
        if (this.props.controller.currentBeatmap.mode === 'mania') {
          label += '-mania';
        }
        break;
    }

    value ??= formatNumber(rawValue);

    return (
      <tr key={key}>
        <th className='beatmap-stats-table__label'>{trans(`beatmapsets.show.stats.${label}`)}</th>

        <td className='beatmap-stats-table__bar'>
          <div className={`bar bar--beatmap-stats bar--beatmap-stats-${label}`}>
            <div
              className='bar__fill'
              style={{
                width: `${10 * Math.min(10, rawValue)}%`,
              }}
            />
          </div>
        </td>

        <td className='beatmap-stats-table__value'>{value}</td>
      </tr>
    );
  };
}
