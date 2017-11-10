import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import RSVP from 'rsvp';
import Ember from 'ember';
import { find } from 'ember-native-dom-helpers';

moduleForComponent('smooth-if', 'Integration | Component | smooth if', {
  integration: true
});

const { run } = Ember;

function wait(time) {
  return new RSVP.Promise(resolve => {
    run.later(resolve, time);
  });
}

test('test transitionIn', async function(assert) {
  const props = {
    displayContent: false,
    transitionInTime: 100,
    transitionInClass: 'transition-in',
    class: 'some-class-name'
  };
  this.setProperties(props);
  this.render(hbs`
    {{#smooth-if displayContent class=class transitionInTime=transitionInTime transitionInClass=transitionInClass}}
      THE CONTENT
    {{/smooth-if}}
  `);

  const selector = `.${props.class}`;
  assert.notOk(find(selector), 'There is no content yet, displayContent is false');

  run(() => {
    this.set('displayContent', true);
  });

  assert.equal(find(selector).textContent.trim(), 'THE CONTENT', 'The content is available right away if displayContent is true');
  assert.dom(selector).hasClass(props.transitionInClass);

  await wait(props.transitionInTime / 2);

  assert.dom(selector).hasClass(props.transitionInClass, 'The element still has transition-in class');

  await wait(props.transitionInTime);

  assert.dom(selector).doesNotHaveClass(props.transitionInClass, 'The element does not have transition-in class after the specified time');
});

test('test transitionOut', async function(assert) {
  const props = {
    displayContent: true,
    transitionOutTime: 100,
    transitionOutClass: 'transition-out',
    class: 'some-class-name'
  };
  this.setProperties(props);
  this.render(hbs`
    {{#smooth-if displayContent class=class transitionOutTime=transitionOutTime transitionOut=transitionOut}}
      THE CONTENT
    {{/smooth-if}}
  `);

  const selector = `.${props.class}`;
  assert.equal(find(selector).textContent.trim(), 'THE CONTENT', 'There is content right away, if displayContent is true');

  run(() => {
    this.set('displayContent', false);
  });

  assert.equal(find(selector).textContent.trim(), 'THE CONTENT', 'The content is still available after setting displayContent to false');
  assert.dom(selector).hasClass(props.transitionOutClass);

  await wait(props.transitionOutTime / 2);

  assert.dom(selector).hasClass(props.transitionOutClass, 'The element still has transition-out class');

  await wait(props.transitionOutTime);

  assert.notOk(find(selector), 'The element is not in the DOM after the specified time');
});
