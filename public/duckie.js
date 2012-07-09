/*---------------------------------------------------------------------------*\
 |   duckie.js                                                               |
 |                                                                           |
 |   Copyright (c) 2012, Rajiv Bakulesh Shah, original author.               |
 |                                                                           |
 |       This file is free software; you can redistribute it and/or modify   |
 |       it under the terms of the GNU General Public License as published   |
 |       by the Free Software Foundation, either version 3 of the License,   |
 |       or (at your option) any later version.                              |
 |                                                                           |
 |       This file is distributed in the hope that it will be useful, but    |
 |       WITHOUT ANY WARRANTY; without even the implied warranty of          |
 |       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU   |
 |       General Public License for more details.                            |
 |                                                                           |
 |       You should have received a copy of the GNU General Public License   |
 |       along with this file.  If not, see:                                 |
 |           <http://www.gnu.org/licenses/>.                                 |
\*---------------------------------------------------------------------------*/


Duckie = {
  _EXAMPLES: [
    ['plate', 'dinner plate decorated with a drawing of garfield with huge boobs'],
    ['scissors', 'naked chick on the left, and a shadow of scissors on the right, illustrating symmetry'],
    ['tweezers', 'topless chick in a bandana, pulling down her pants and tweezing her pubes'],
    ['heart', 'chick making a heart shape with her fingers over her left tit'],
    ['sand', 'naked chick with sand handprints on her tits and pussy'],
    ['popsicle', 'fat chick in panties, licking a popsicle'],
    ['painful', 'chick getting her tongue severed'],
    ['sandal', 'dude with a sandal hanging off his erection'],
    ['glove', 'dude jacking off with a gloved hand'],
    ['puppy', 'dude in bondage gear role playing as a puppy'],
    ['office', 'dude wearing pantyhose in his office'],
  ],

  _TIMEOUT: 10000,

  _template: null,
  _timer: null,
  _jqXHR: null,


  init: function() {
    this._showExample();
    $('#loading').hide();

    // Get the photo result template.
    this._template = $('#result').remove().html();
    $('#templates').remove()

    // Wire up the event handlers.
    $('#example-query').click(this._tryExample);
    $('#search').submit(this._search);
    $(document).keydown(this._keyDown);
    $(document).keypress(this._keyPress);
    $(document).scroll(this._scroll);

    var query = location.hash.slice(1);
    if (query) {
      query = decodeURIComponent(query);
      this._doSearch(query);
    }
  },


  _showExample: function() {
    var index = Math.floor(Math.random() * this._EXAMPLES.length);
    var example = this._EXAMPLES[index];
    var query = example[0];
    var result = example[1];
    $('#example-query').html(query);
    $('#example-result').html(result);
  },


  _tryExample: function() {
    var query = $('#example-query').html();
    Duckie._doSearch(query);
    return false;
  },


  _doSearch: function(query) {
    $("[name='query']").val(query);
    Duckie._search();
  },


  _search: function() {
    var query = $("[name='query']").val();
    query = query.toLowerCase().trim().replace(/ +/g, ' ');
    if (!query) {
      return false;
    }

    Duckie._abortSearch();
    Duckie._preSearch(query);
    Duckie._timer = window.setTimeout(Duckie._brokenSearch, Duckie._TIMEOUT);
    Duckie._jqXHR = $.getJSON('/search', {query: query}, function(data) {
      Duckie._abortSearch();
      Duckie._postSearch(data);
    });

    return false;
  },


  _abortSearch: function() {
    if (this._timer) {
      window.clearTimeout(this._timer);
      this._timer = null;
    }

    if (this._jqXHR) {
      this._jqXHR.abort();
      this._jqXHR = null;
    }
  },


  _preSearch: function(query) {
    location.replace('#' + encodeURIComponent(query));
    document.title = 'rubber duckie - ' + query;
    $('.query').html(query);
    $("[name='query']").val('');

    $('#loading').show();
    $('#wtf').hide();
    $('#results').empty();
    $('#no-results').hide();
    $('#broken').hide();
  },


  _brokenSearch: function() {
    Duckie._abortSearch();
    $('#loading').hide();
    $('#broken').show();
  },


  _postSearch: function(results) {
    if (results.length) {
      $("[name='query']").blur();
    }

    $('#loading').hide();
    $.each(results, this._showResult);
    $('.lazy').lazyload();
    if (!results.length) {
      $('#no-results').show();
    }
  },


  _showResult: function(index, value) {
    var result = $(Duckie._template);
    result.find('a.photo').attr('href', value.full_size);
    result.find('a.photo').facebox();
    result.find('a.photo img.photo').attr('data-original', value.thumbnail);
    result.appendTo('#results');
  },


  _keyDown: function(eventObject) {
    if (eventObject.keyCode >= 37 && eventObject.keyCode <= 40) {
      $("[name='query']").blur();
    }
  },


  _keyPress: function(eventObject) {
    $.facebox.close();
    window.scrollTo(0, 0);
    $("[name='query']").focus();
  },


  _scroll: function(eventObject) {
    $.facebox.close();
    var position = $('html').position();
    if (!position.left && !position.top) {
      $("[name='query']").focus();
    }
  },
};


$(function() {
  Duckie.init();
});
