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
    ['bicycle', 'girl holding a bicycle, lifting her skirt to expose her g-string'],
    ['cancer', 'topless girl with a pink ribbon in her cleavage'],
    ['candy', 'girl penetrating herself with a lollipop'],
    ['ears', 'girl dressed as a bondage bunny'],
    ['fork', 'fork with its tines bent so it looks like the middle finger'],
    ['glove', 'man masturbating with a gloved hand'],
    ['heart', 'girl making a heart shape with her fingers over her left breast'],
    ['office', 'man wearing pantyhose in his office'],
    ['painful', 'girl getting her tongue severed'],
    ['plate', 'dinner plate decorated with a drawing of garfield with huge breasts'],
    ['popsicle', 'fat girl in panties, licking a popsicle'],
    ['puppy', 'man in bondage gear role playing as a puppy'],
    ['punk', 'girl with a mohawk, with electrical tape on her nipples, wearing panties, chained up'],
    ['sand', 'naked girl with sand handprints on her tits and pussy'],
    ['sandal', 'man with a sandal hanging off his erection'],
    ['scissors', 'naked girl on the left, and a shadow of scissors on the right, illustrating symmetry'],
    ['sweater', 'girl wearing a sweater, giving a handjob'],
    ['tweezers', 'topless girl in a bandana, pulling down her pants and tweezing her pubes'],
    ['umbrella', 'girl penetrating herself with an umbrella'],
    ['unicorn', 'girl wearing lace pasties and a unicorn horn'],
    ['wing', 'girl wearing lingerie, ordering chicken wings'],
    ['video game', 'girl wearing lingerie, playing a video game'],
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
    $('.home').click(this._wtf);
    $('#example-query').click(this._tryExample);
    $('#search').submit(this._search);

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
    query = query.trim().replace(/ +/g, ' ');
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


  _wtf: function() {
    Duckie._abortSearch();

    location.replace('#');
    document.title = 'Rubber Duckie - Unsafe Photo Search';
    $('.query').html('Unsafe Photo Search');
    $("[name='query']").val('');

    $('#loading').hide();
    $('#wtf').show();
    $('#results').empty();
    $('#no-results').hide();
    $('#broken').hide();

    Duckie._showExample();
    return false;
  },


  _preSearch: function(query) {
    location.replace('#' + encodeURIComponent(query));
    document.title = 'Rubber Duckie - ' + query;
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
};


$(function() {
  Duckie.init();
});
