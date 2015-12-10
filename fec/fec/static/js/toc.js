'use strict';

/* global require, module */

var $ = require('jquery');
var scrollMonitor = require('scrollmonitor');

/**
 * Table of Contents widget
 *
 * 1. Takes a list of links and finds all sections with IDs matching their hrefs
 * 2. Adds scrollwatchers to highlight the menu item when the section reaches top of viewport
 * 3. Animates the document to scroll to the section when clicking the link
 *
 * @constructor
 * @param {string} selector - Selector for the navigation menu for the TOC
 */

function TOC(selector) {
  this.$menu = $(selector);
  this.sections = this.getSections();
  this.offset = -1 * scrollMonitor.viewportHeight;
  this.addWatchers();
  this.$menu.on('click', 'a', this.scrollTo.bind(this));
}

TOC.prototype.getSections = function() {
  return this.$menu.find('a').map(function(idx, elm) {
    return $(elm).attr('href');
  });
};

TOC.prototype.addWatchers = function() {
  var self = this;

  [].forEach.call(this.sections, function(section) {
    var elm = document.querySelector(section);
    var watcher = scrollMonitor.create(elm, {top: this.offset});
    watcher.$menuItem = this.$menu.find('a[href=' + section + ']');
    watcher.enterViewport(function() {
      self.highlightActiveItem(this);
    });
  }, this);
};

TOC.prototype.highlightActiveItem = function(watcher) {
  var $currentHighlight = this.$menu.find('a.is-active');
  if (watcher.isInViewport) {
    $currentHighlight.removeClass('is-active');
    watcher.$menuItem.addClass('is-active');
  }
};

TOC.prototype.scrollTo = function(e) {
  e.preventDefault();
  var $link = $(e.target);
  var section = $link.attr('href');
  var sectionTop = $(section).offset().top;
  $(document.body).animate({
    scrollTop: sectionTop
  });
};

module.exports = { TOC: TOC };