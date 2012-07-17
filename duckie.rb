#-----------------------------------------------------------------------------#
#   duckie.rb                                                                 #
#                                                                             #
#   Copyright (c) 2012, Rajiv Bakulesh Shah, original author.                 #
#                                                                             #
#       This file is free software; you can redistribute it and/or modify     #
#       it under the terms of the GNU General Public License as published     #
#       by the Free Software Foundation, either version 3 of the License,     #
#       or (at your option) any later version.                                #
#                                                                             #
#       This file is distributed in the hope that it will be useful, but      #
#       WITHOUT ANY WARRANTY; without even the implied warranty of            #
#       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU     #
#       General Public License for more details.                              #
#                                                                             #
#       You should have received a copy of the GNU General Public License     #
#       along with this file.  If not, see:                                   #
#           <http://www.gnu.org/licenses/>.                                   #
#-----------------------------------------------------------------------------#


require 'haml'
require 'redis'
require 'sinatra'

load 'cache.rb'
load 'flickr.rb'


configure do
  set :haml, :format => :html5
  Flickr::Search.log_in

  url = ENV['REDISTOGO_URL'] || 'http://localhost:6379/'
  uri = URI.parse(url)
  REDIS = Redis.new(host: uri.host, port: uri.port, password: uri.password)
end


get '/' do
  haml :index
end


get '/search' do
  content_type :json
  query = params['query'].downcase.strip.squeeze(' ')
  Cache.lookup(query) { Flickr::Search.unsafe_search(query).to_json }
end
