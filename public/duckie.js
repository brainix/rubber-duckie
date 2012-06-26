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
  _TIMEOUT: 10000,

  _template: null,
  _timer: null,
  _jqXHR: null,
  _examples: [
    ['sandal', 'dude with a sandal hanging off his erection'],
    ['book', 'naked chick organizing her bookshelf'],
    ['ice', 'naked chick standing on a glacier'],
    ['office', 'dude wearing pantyhose in his office'],
    ['plate', 'dinner plate decorated with a drawing of garfield with huge boobs'],
    ['playground', 'topless chick lying across a jungle gym'],
    ['soccer', 'topless chick wearing soccer shoes'],
    ['tree', 'naked chick hugging a tree'],
    ['popsicle', 'fat chick in panties, licking a popsicle'],
    ['football', 'naked chick in a pool, posing with her dog and a football'],
    ['Scooby Doo', 'Scooby Doo fucking Lois from Family Guy'],
    ['shell', 'topless girl who&rsquo;s found a seashell'],
  ],
  _initialized: false,


  init: function() {
    if (this._initialized) {
      // We'd previously been initialized.
      return false;
    }

    this._example();

    // Get the photo result template.
    this._template = $('#result').remove().html();
    $('#templates').remove()

    // Wire up the event handlers.
    $('#example-query').click(this._try);
    $('#search').submit(this._search);
    $(document).keydown(this._keyDown);
    $(document).keypress(this._keyPress);
    $(document).scroll(this._scroll);

    $('#loading').hide();

    // We're now initialized.
    return this._initialized = true;
  },


  _example: function() {
    var index = Math.floor(Math.random() * this._examples.length);
    var example = this._examples[index];
    var query = example[0];
    var result = example[1];
    $('#example-query').html(query);
    $('#example-result').html(result);
    $('#example').slideDown();
  },


  _try: function() {
    var query = $('#example-query').html();
    $("[name='query']").val(query);
    Duckie._search();
    return false;
  },


  _search: function() {
    var query = $("[name='query']").val();
    query = query.toLowerCase().trim().replace(/ +/g, ' ');
    if (!query) {
      return false;
    }

    Duckie._abort();
    Duckie._preSearch(query);
    Duckie._timer = window.setTimeout(Duckie._broken, Duckie._TIMEOUT);
    Duckie._jqXHR = $.getJSON('/search', {query: query}, function(data) {
        Duckie._abort();
        Duckie._postSearch(data);
      }
    );

    return false;
  },


  _abort: function() {
    if (this._timer !== null) {
      window.clearTimeout(this._timer);
      this._timer = null;
    }

    if (this._jqXHR !== null) {
      this._jqXHR.abort();
      this._jqXHR = null;
    }
  },


  _preSearch: function(query) {
    document.title = 'rubber duckie - ' + query;
    $('.query').html(query);
    $("[name='query']").val('');

    $('#loading').show();
    $('#wtf').hide();
    $('#results').empty();
    $('#no-results').hide();
    $('#broken').hide();
  },


  _broken: function() {
    Duckie._abort();
    $('#loading').hide();
    $('#broken').show();
  },


  _postSearch: function(results) {
    if (results.length !== 0) {
      $("[name='query']").blur();
    }

    $('#loading').hide();
    $.each(results, this._showResult);
    $('.lazy').lazyload();
    if (results.length === 0) {
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
    if (position.left === 0 && position.top === 0) {
      $("[name='query']").focus();
    }
  }
};


$(function() {
  Duckie.init();
});
