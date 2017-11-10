import Component from '@ember/component';
import layout from '../templates/components/smooth-if';
// import { observer, computed } from '@mber/object';
// import { run } from '@mber/runloop';
import Ember from 'ember';

const { computed, observer, run, A } = Ember;

const SmoothIfComponent = Component.extend({
  layout,
  tagName: '',

  baseClass: 'ember-smooth-if',
  transitionInClass: 'transition-in',
  transitionOutClass: 'transition-out',
  transitionInTime: 200,
  transitionOutTime: 200,

  _displayBlock: false,

  init() {
    this._super(...arguments);
    this.set('classes', A([]));

    if (this.get('condition')) {
      this.manageTransitionClasses();
    }
  },

  fullClassName: computed('classes.[]', 'class', function() {
    return this.get('classes').concat(this.get('class')).join(' ');
  }),

  conditionObserver: observer('condition', function() {
    this.manageTransitionClasses();
  }),

  manageTransitionClasses() {
    const { condition, transitionInTime, transitionOutTime, transitionOutClass, transitionInClass } =
      this.getProperties('condition', 'transitionOutTime', 'transitionInTime', 'transitionOutClass', 'transitionInClass');

    const classes = this.get('classes');

    if (condition) {
      if (!this.get('isDestroyed')) {
        classes.removeObject(transitionOutClass);
        classes.pushObject(transitionInClass);
        this.set('_displayBlock', true);
      }

      run.later(() => {
        classes.removeObject(transitionInClass);
      }, transitionInTime);
    } else {
      classes.removeObject(transitionInClass);
      classes.pushObject(transitionOutClass);

      run.later(() => {
        if (!this.get('isDestroyed')) {
          classes.removeObject(transitionOutClass);
          this.set('_displayBlock', false);
        }
      }, transitionOutTime);
    }
  }
});

SmoothIfComponent.reopenClass({
  positionalParams: ['condition']
});

export default SmoothIfComponent;
