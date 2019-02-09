import * as React from 'react';

import Panel, { PanelProps } from '../Panel';

export type SlidesPanelProps = PanelProps;

export default function SlidesPanel({ ...otherProps }: SlidesPanelProps) {
    return <Panel {...otherProps}>Slides</Panel>;
}
