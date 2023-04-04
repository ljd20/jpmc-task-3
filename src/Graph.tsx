import React, {Component} from 'react';
import {Table, TableData} from '@finos/perspective';
import {ServerRespond} from './DataStreamer';
import {DataManipulator} from './DataManipulator';
import './Graph.css';

interface IProps {
    data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
    load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
    table: Table | undefined;

    render() {
        return React.createElement('perspective-viewer');
    }

    componentDidMount() {
        // Get element from the DOM.
        const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

        const schema = {
            abcPrice: 'float',
            defPrice: 'float',
            ratio: 'float',
            timestamp: 'date',
            lower_bound: 'float',
            upper_bound: 'float',
            trigger: 'float'
        };

        if (window.perspective && window.perspective.worker()) {
            this.table = window.perspective.worker().table(schema);
        }
        if (this.table) {
            // Load the `table` in the `<perspective-viewer>` DOM reference.
            elem.load(this.table);
            elem.setAttribute('view', 'y_line');
            elem.setAttribute('row-pivots', '["timestamp"]');
            elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger"]');
            elem.setAttribute('aggregates', JSON.stringify({
                abcPrice: 'avg',
                defPrice: 'avg',
                ratio: 'avg',
                timestamp: 'distinct count',
                lower_bound: 'avg',
                upper_bound: 'avg',
                trigger: 'avg'
            }));
        }
    }

    componentDidUpdate() {
        if (this.table) {
            this.table.update([
                DataManipulator.generateRow(this.props.data),
            ] as unknown as TableData);
        }
    }
}

export default Graph;