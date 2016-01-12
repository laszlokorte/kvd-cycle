import I from 'immutable';
import {
  svg, div, textarea, h2, ul, li,
  table, tr, th, td,
} from '@cycle/dom';

import './index.styl';

const expressionTree = (expression, x, y, width, acc) => {
  if (expression === null) {
    return acc;
  }

  switch (expression.node) {
  case 'binary':
    return expressionTree(
      expression.rhs, x + width / 4, y + 100, width / 2,
      acc.push(
        svg('circle', {
          cx: x,
          cy: y,
          r: 5,
        })
      )
      .push(
        svg('line', {
          x1: x,
          y1: y,
          x2: x + width / 4,
          y2: y + 100,
          'stroke-width': 2,
          stroke: 'lightgray',
        })
      )
      .push(
        svg('text', {
          x: x,
          y: y - 15,
          'text-anchor': 'middle',
          'alignment-baseline': 'middle',
        }, expression.operator)
      )
    )
    .concat(expressionTree(
      expression.lhs, x - width / 4, y + 100, width / 2,
      acc
      .push(
        svg('line', {
          x1: x,
          y1: y,
          x2: x - width / 4,
          y2: y + 100,
          'stroke-width': 2,
          stroke: 'lightgray',
        })
      )
      .push(
        svg('text', {
          x: x,
          y: y - 15,
          'text-anchor': 'middle',
          'alignment-baseline': 'middle',
        }, expression.operator)
      )
    ));
  case 'unary':
    return expressionTree(expression.operand, x, y + 50, width,
      acc.push(
        svg('circle', {
          cx: x,
          cy: y,
          r: 5,
        })
      )
      .push(
        svg('line', {
          x1: x,
          y1: y,
          x2: x,
          y2: y + 50,
          'stroke-width': 2,
          stroke: 'lightgray',
        })
      )
      .push(
        svg('text', {
          x: x - 15,
          y: y,
          'text-anchor': 'end',
          'alignment-baseline': 'middle',
        }, expression.operator)
      )
    );
  case 'group':
    return expressionTree(expression.content, x, y + 50, width,
      acc.push(
        svg('circle', {
          cx: x,
          cy: y,
          r: 5,
        })
      )
      .push(
        svg('line', {
          x1: x,
          y1: y,
          x2: x,
          y2: y + 50,
          'stroke-width': 2,
          stroke: 'lightgray',
        })
      )
    );
  case 'identifier':
    return acc.push(
      svg('circle', {
        cx: x,
        cy: y,
        r: 5,
      })
    ).push(
      svg('text', {
        x: x,
        y: y + 20,
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
      }, expression.name)
    );
  case 'constant':
    return acc.push(
      svg('circle', {
        cx: x,
        cy: y,
        r: 5,
      })
    ).push(
      svg('text', {
        x: x,
        y: y + 20,
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
      }, expression.value.toString())
    );
  default:
    return acc;
  }
};

const render = (state) =>
  div([
    div('.logic-input', [
      textarea('.logic-input-field', {
        placeholder: 'Enter some logic expression...',
      }),
      div('.logic-input-background'),
    ]),
    state && state.expression && [
      div([
        state.expression.toString(),
        h2('Variables'),
        ul(state.identifiers.map(
          (name) => li([name])
        ).toArray()),
        h2('Tree'),
        svg('svg', {
          attributes: {
            style: 'border: 1px solid black',
            width: 800,
            height: 100 * (1 + state.treeHeight),
            class: 'graphics-root',
            viewBox: '0 0 400 ' + (100 * (1 + state.treeHeight)),
            preserveAspectRatio: 'xMidYMin meet',
          },
        }, [
          expressionTree(state.expression, 200, 50, 700, I.List()).toArray(),
        ]),
        h2('Table'),
        table([
          tr([
            state.identifiers.map(
              (name) => th(name)
            ).toArray(),
            th('Result')
          ]),
          state.table.map(
          (row) => tr([
            state.identifiers.map(
              (name) => td([
                row.identifierValues.get(name).toString()
              ])
            ).toArray(),
            td(row.value.toString()),
          ])).toArray()
        ]),
      ]),
    ],
    state && state.error && [
      h2('Error'),
      div([
        state.error.toString(),
      ]),
    ],
  ])
;

export default (state$) =>
  state$.map(render)
;
